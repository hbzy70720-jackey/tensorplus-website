import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getAuthCookieName, verifyToken } from "@/lib/auth";

async function authenticate(request: NextRequest): Promise<boolean> {
  const token = request.cookies.get(getAuthCookieName())?.value;
  if (!token) return false;
  const payload = await verifyToken(token);
  return !!payload;
}

// GET /api/admin/visits — 获取访问记录列表（支持筛选+分页）
export async function GET(request: NextRequest) {
  if (!(await authenticate(request))) {
    return NextResponse.json({ error: "未授权" }, { status: 401 });
  }

  const { searchParams } = request.nextUrl;
  const page = parseInt(searchParams.get("page") || "1");
  const pageSize = parseInt(searchParams.get("pageSize") || "50");
  const province = searchParams.get("province") || "";
  const country = searchParams.get("country") || "";
  const path = searchParams.get("path") || "";
  const startDate = searchParams.get("startDate") || "";
  const endDate = searchParams.get("endDate") || "";
  const ip = searchParams.get("ip") || "";

  const where: Record<string, unknown> = {};

  if (province) where.province = { contains: province };
  if (country) where.country = { contains: country };
  if (path) where.path = { contains: path };
  if (ip) where.ip = { contains: ip };

  if (startDate || endDate) {
    const createdAt: Record<string, Date> = {};
    if (startDate) createdAt.gte = new Date(startDate);
    if (endDate) createdAt.lte = new Date(endDate + "T23:59:59.999Z");
    where.createdAt = createdAt;
  }

  const [records, total] = await Promise.all([
    prisma.visitRecord.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.visitRecord.count({ where }),
  ]);

  return NextResponse.json({
    records,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  });
}

// DELETE /api/admin/visits — 删除指定日期之前的访问记录
export async function DELETE(request: NextRequest) {
  if (!(await authenticate(request))) {
    return NextResponse.json({ error: "未授权" }, { status: 401 });
  }

  try {
    const { before } = await request.json();
    if (!before) {
      return NextResponse.json({ error: "请指定删除截止日期" }, { status: 400 });
    }

    const result = await prisma.visitRecord.deleteMany({
      where: {
        createdAt: { lt: new Date(before) },
      },
    });

    return NextResponse.json({ deleted: result.count });
  } catch {
    return NextResponse.json({ error: "删除失败" }, { status: 500 });
  }
}
