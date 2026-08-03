import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getAuthCookieName, verifyToken } from "@/lib/auth";
import { Prisma } from "@prisma/client";

async function authenticate(request: NextRequest): Promise<boolean> {
  const token = request.cookies.get(getAuthCookieName())?.value;
  if (!token) return false;
  const payload = await verifyToken(token);
  return !!payload;
}

export async function GET(request: NextRequest) {
  if (!(await authenticate(request))) {
    return NextResponse.json({ error: "未授权" }, { status: 401 });
  }

  const { searchParams } = request.nextUrl;
  const search = searchParams.get("search") || "";
  const industry = searchParams.get("industry") || "";
  const published = searchParams.get("published");
  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const pageSize = Math.min(100, Math.max(1, Number(searchParams.get("pageSize")) || 20));

  const where: Prisma.CaseStudyWhereInput = {};

  if (search) {
    where.OR = [
      { title: { contains: search } },
      { customer: { contains: search } },
      { description: { contains: search } },
    ];
  }

  if (industry && ["光伏", "林业", "石油", "电力"].includes(industry)) {
    where.industry = industry;
  }

  if (published !== null && published !== "") {
    where.published = published === "true";
  }

  const [cases, total] = await Promise.all([
    prisma.caseStudy.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.caseStudy.count({ where }),
  ]);

  return NextResponse.json({
    cases,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  });
}

export async function POST(request: NextRequest) {
  if (!(await authenticate(request))) {
    return NextResponse.json({ error: "未授权" }, { status: 401 });
  }

  const body = await request.json();
  const { title, description, content, coverImage, industry, customer, deliveryDate, tags, published } = body;

  if (!title || !content) {
    return NextResponse.json({ error: "标题和内容为必填项" }, { status: 400 });
  }

  // 先用临时唯一值占位，创建成功后用数据库 ID 更新
  const tempSlug = `temp-${Date.now().toString(36)}`;

  const caseStudy = await prisma.caseStudy.create({
    data: {
      title,
      slug: tempSlug,
      description: description || null,
      content,
      coverImage: coverImage || null,
      industry: industry || null,
      customer: customer || null,
      deliveryDate: deliveryDate || null,
      tags: tags || "[]",
      published: published ?? false,
    },
  });

  // 用数据库自增 ID 作为最终 slug
  const updated = await prisma.caseStudy.update({
    where: { id: caseStudy.id },
    data: { slug: String(caseStudy.id) },
  });

  return NextResponse.json({ case: updated }, { status: 201 });
}
