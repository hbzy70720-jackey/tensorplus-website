import { NextRequest, NextResponse } from "next/server";
import { getAuthCookieName, verifyToken } from "@/lib/auth";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import sharp from "sharp";

async function authenticate(request: NextRequest): Promise<boolean> {
  const token = request.cookies.get(getAuthCookieName())?.value;
  if (!token) return false;
  const payload = await verifyToken(token);
  return !!payload;
}

export async function POST(request: NextRequest) {
  if (!(await authenticate(request))) {
    return NextResponse.json({ error: "未授权" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "未选择文件" }, { status: 400 });
  }

  // 验证文件类型（放宽限制，支持 Word 粘贴的各种图片格式）
  const allowedTypes = [
    "image/png", "image/jpeg", "image/gif", "image/webp", "image/svg+xml",
    "image/bmp", "image/x-bmp", "image/x-windows-bmp",
    "image/tiff", "image/x-tiff",
    "image/wmf", "image/x-wmf", "image/x-emf", "image/emf",
    "application/octet-stream",  // 某些系统将剪贴板图片标记为此类型
  ];
  const fileExt = path.extname(file.name).toLowerCase();
  const allowedExts = [".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg", ".bmp", ".tiff", ".tif", ".wmf", ".emf"];

  if (!allowedTypes.includes(file.type) && !allowedExts.includes(fileExt)) {
    return NextResponse.json(
      { error: `不支持的图片格式: ${file.type || fileExt}` },
      { status: 400 }
    );
  }

  // 限制文件大小 10MB
  if (file.size > 10 * 1024 * 1024) {
    return NextResponse.json({ error: "图片大小不能超过10MB" }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  let buffer = Buffer.from(bytes);
  let ext = path.extname(file.name) || ".png";

  // 压缩：栅格图统一转 WebP 并限制尺寸；sharp 无法处理的格式（如 Word 粘贴的 wmf/emf）原样保存
  try {
    const meta = await sharp(buffer, { failOn: "none" }).metadata();
    const compressible = ["png", "jpeg", "webp", "bmp", "tiff", "avif"];
    if (meta.format && compressible.includes(meta.format)) {
      // @ts-ignore-next-line  sharp库类型定义bug ArrayBufferLike
      buffer = (await sharp(buffer)
        .rotate()
        .resize({ width: 1600, height: 1600, fit: "inside", withoutEnlargement: true })
        .webp({ quality: 82 })
        .toBuffer()) as Buffer;
      ext = ".webp";
    }
  } catch {
    // sharp 识别失败时保留原图，不阻断上传
  }

  // 生成唯一文件名
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;

  // 图片存到 public 之外的 uploads 目录。若放在 public 里，
  // 生产环境 next start 只在启动时扫描一次 public，运行时新上传的文件不会被服务，
  // 导致图片 404。改用专门的读取接口 /api/uploads/cases/... 来取图。
  const uploadDir = path.join(process.cwd(), "uploads", "cases");

  await mkdir(uploadDir, { recursive: true });
  await writeFile(path.join(uploadDir, filename), buffer);

  const url = `/api/uploads/cases/${filename}`;
  return NextResponse.json({ url, filename });
}
