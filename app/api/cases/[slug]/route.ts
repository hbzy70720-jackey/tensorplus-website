import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const caseStudy = await prisma.caseStudy.findUnique({
    where: { slug, published: true },
  });

  if (!caseStudy) {
    return NextResponse.json({ error: "案例不存在" }, { status: 404 });
  }

  return NextResponse.json({ case: caseStudy });
}
