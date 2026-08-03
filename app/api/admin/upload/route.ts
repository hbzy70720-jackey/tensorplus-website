import { NextRequest, NextResponse } from "next/server";
import { getAuthCookieName, verifyToken } from "@/lib/auth";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

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
  const buffer = Buffer.from(bytes);

  // 生成唯一文件名
  const ext = path.extname(file.name) || ".png";
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;
  const uploadDir = path.join(process.cwd(), "public", "uploads", "cases");

  await mkdir(uploadDir, { recursive: true });
  await writeFile(path.join(uploadDir, filename), buffer);

  const url = `/uploads/cases/${filename}`;
  return NextResponse.json({ url, filename });
}
