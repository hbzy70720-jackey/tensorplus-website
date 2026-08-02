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

// POST /api/track — 记录一次页面访问
export async function POST(request: NextRequest) {
  try {
    const { path, referer, duration } = await request.json().catch(() => ({}));
    const ip = getClientIP(request);
    const ua = request.headers.get("user-agent") || "";

    const geo = await resolveGeo(ip);

    const record = await prisma.visitRecord.create({
      data: {
        ip,
        path: path || "/",
        referer: referer || null,
        userAgent: ua || null,
        country: geo.country,
        province: geo.province,
        city: geo.city,
        duration: duration || 0,
      },
    });

    return NextResponse.json({ id: record.id }, { status: 201 });
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
