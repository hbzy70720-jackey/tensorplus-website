import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getAuthCookieName, verifyToken } from "@/lib/auth";

async function authenticate(request: NextRequest): Promise<boolean> {
  const token = request.cookies.get(getAuthCookieName())?.value;
  if (!token) return false;
  const payload = await verifyToken(token);
  return !!payload;
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await authenticate(request))) {
    return NextResponse.json({ error: "未授权" }, { status: 401 });
  }

  const { id } = await params;
  const caseId = Number(id);
  if (isNaN(caseId)) {
    return NextResponse.json({ error: "无效的ID" }, { status: 400 });
  }

  const existing = await prisma.caseStudy.findUnique({ where: { id: caseId } });
  if (!existing) {
    return NextResponse.json({ error: "案例不存在" }, { status: 404 });
  }

  const body = await request.json();
  const { title, description, content, coverImage, industry, customer, deliveryDate, tags, published } = body;

  const updated = await prisma.caseStudy.update({
    where: { id: caseId },
    data: {
      ...(title !== undefined && { title }),
      ...(description !== undefined && { description }),
      ...(content !== undefined && { content }),
      ...(coverImage !== undefined && { coverImage }),
      ...(industry !== undefined && { industry }),
      ...(customer !== undefined && { customer }),
      ...(deliveryDate !== undefined && { deliveryDate }),
      ...(tags !== undefined && { tags }),
      ...(published !== undefined && { published }),
    },
  });

  return NextResponse.json({ case: updated });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await authenticate(request))) {
    return NextResponse.json({ error: "未授权" }, { status: 401 });
  }

  const { id } = await params;
  const caseId = Number(id);
  if (isNaN(caseId)) {
    return NextResponse.json({ error: "无效的ID" }, { status: 400 });
  }

  const existing = await prisma.caseStudy.findUnique({ where: { id: caseId } });
  if (!existing) {
    return NextResponse.json({ error: "案例不存在" }, { status: 404 });
  }

  await prisma.caseStudy.delete({ where: { id: caseId } });
  return NextResponse.json({ success: true });
}
