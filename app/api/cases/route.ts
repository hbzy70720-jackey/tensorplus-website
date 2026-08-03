import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const industry = searchParams.get("industry") || "";
  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const pageSize = Math.min(50, Math.max(1, Number(searchParams.get("pageSize")) || 12));

  const where: Record<string, unknown> = { published: true };

  if (industry && ["光伏", "林业", "石油", "电力"].includes(industry)) {
    where.industry = industry;
  }

  const [cases, total] = await Promise.all([
    prisma.caseStudy.findMany({
      where,
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        coverImage: true,
        industry: true,
        customer: true,
        deliveryDate: true,
        tags: true,
        createdAt: true,
      },
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
