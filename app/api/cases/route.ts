import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const industry = searchParams.get("industry") || "";
  const lang = searchParams.get("lang") || "zh";
  const isEn = lang === "en";
  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const pageSize = Math.min(50, Math.max(1, Number(searchParams.get("pageSize")) || 12));

  const where: Record<string, unknown> = { published: true };

  if (industry && ["光伏", "林业", "石油", "电力"].includes(industry)) {
    where.industry = industry;
  }

  const [rows, total] = await Promise.all([
    prisma.caseStudy.findMany({
      where,
      select: {
        id: true,
        title: true,
        titleEn: true,
        slug: true,
        description: true,
        descriptionEn: true,
        coverImage: true,
        industry: true,
        customer: true,
        customerEn: true,
        deliveryDate: true,
        tags: true,
        tagsEn: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.caseStudy.count({ where }),
  ]);

  // 按 lang 本地化文本字段，英文字段为空时回退中文；industry 保持 canonical 中文值，由前端 industryLabel() 转译
  const cases = rows.map((r) => ({
    id: r.id,
    slug: r.slug,
    title: isEn ? r.titleEn || r.title : r.title,
    description: isEn ? r.descriptionEn || r.description : r.description,
    customer: isEn ? r.customerEn || r.customer : r.customer,
    industry: r.industry,
    tags: isEn ? (r.tagsEn && r.tagsEn !== "[]" ? r.tagsEn : r.tags) : r.tags,
    coverImage: r.coverImage,
    deliveryDate: r.deliveryDate,
    createdAt: r.createdAt,
  }));

  return NextResponse.json({
    cases,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  });
}
