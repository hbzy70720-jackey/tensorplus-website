import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

// IP 地理位置解析（使用 ip-api.com 免费服务）
async function resolveGeo(ip: string): Promise<{
  country: string | null;
  province: string | null;
  city: string | null;
}> {
  // 本地/内网 IP 不解析
  if (
    ip === "127.0.0.1" ||
    ip === "::1" ||
    ip.startsWith("192.168.") ||
    ip.startsWith("10.") ||
    ip.startsWith("172.")
  ) {
    return { country: "本地", province: null, city: null };
  }

  try {
    const res = await fetch(`http://ip-api.com/json/${ip}?lang=zh-CN&fields=country,regionName,city`, {
      signal: AbortSignal.timeout(3000),
    });
    if (!res.ok) return { country: null, province: null, city: null };
    const data = await res.json();
    return {
      country: data.country || null,
      province: data.regionName || null,
      city: data.city || null,
    };
  } catch {
    return { country: null, province: null, city: null };
  }
}

function getClientIP(request: NextRequest): string {
  const xff = request.headers.get("x-forwarded-for");
  if (xff) {
    return xff.split(",")[0].trim();
  }
  return request.headers.get("x-real-ip") || "127.0.0.1";
}

// 会话有效期：30 分钟。超过则视为一次新的来访。
const SESSION_TTL_MS = 30 * 60 * 1000;

// POST /api/track — 记录一次页面访问（同一会话 30 分钟内合并为一条）
export async function POST(request: NextRequest) {
  try {
    const { path, referer, duration, sessionId } = await request
      .json()
      .catch(() => ({}));
    const ip = getClientIP(request);
    const ua = request.headers.get("user-agent") || "";
    const currentPath = path || "/";

    // 若携带会话编号，尝试合并到最近一次仍在活跃期的来访记录
    if (sessionId) {
      const latest = await prisma.visitRecord.findFirst({
        where: { sessionId },
        orderBy: { updatedAt: "desc" },
      });

      if (latest && Date.now() - latest.updatedAt.getTime() <= SESSION_TTL_MS) {
        // 活跃会话：追加访问页面，不新增记录
        let pages: string[] = [];
        try {
          pages = latest.pages ? JSON.parse(latest.pages) : [];
          if (!Array.isArray(pages)) pages = [];
        } catch {
          pages = [];
        }
        if (pages.length === 0 && latest.path) pages = [latest.path];
        if (!pages.includes(currentPath)) pages.push(currentPath);

        const updated = await prisma.visitRecord.update({
          where: { id: latest.id },
          data: {
            lastPath: currentPath,
            pages: JSON.stringify(pages),
            pageCount: pages.length,
          },
        });

        return NextResponse.json({ id: updated.id, isNew: false });
      }
    }

    // 新会话：解析地理位置并创建一条来访记录
    const geo = await resolveGeo(ip);
    const record = await prisma.visitRecord.create({
      data: {
        sessionId: sessionId || "",
        ip,
        path: currentPath,
        lastPath: currentPath,
        pages: JSON.stringify([currentPath]),
        pageCount: 1,
        referer: referer || null,
        userAgent: ua || null,
        country: geo.country,
        province: geo.province,
        city: geo.city,
        duration: duration || 0,
      },
    });

    return NextResponse.json({ id: record.id, isNew: true }, { status: 201 });
  } catch (err) {
    console.error("Track error:", err);
    return NextResponse.json({ error: "记录失败" }, { status: 500 });
  }
}

// PATCH /api/track — 更新访问时长
export async function PATCH(request: NextRequest) {
  try {
    const { id, duration } = await request.json().catch(() => ({}));
    if (!id || typeof duration !== "number") {
      return NextResponse.json({ error: "参数错误" }, { status: 400 });
    }

    await prisma.visitRecord.update({
      where: { id },
      data: { duration },
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "更新失败" }, { status: 500 });
  }
}
