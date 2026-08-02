import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getAuthCookieName, verifyToken } from "@/lib/auth";

async function authenticate(request: NextRequest): Promise<boolean> {
  const token = request.cookies.get(getAuthCookieName())?.value;
  if (!token) return false;
  const payload = await verifyToken(token);
  return !!payload;
}

// GET /api/admin/submissions/[id]/notes — 获取某条提交的所有备注历史
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await authenticate(request))) {
    return NextResponse.json({ error: "未授权" }, { status: 401 });
  }

  const { id } = await params;
  const submissionId = parseInt(id);
  if (isNaN(submissionId)) {
    return NextResponse.json({ error: "无效的ID" }, { status: 400 });
  }

  const notes = await prisma.noteEntry.findMany({
    where: { submissionId },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(notes);
}

// POST /api/admin/submissions/[id]/notes — 添加一条备注
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await authenticate(request))) {
    return NextResponse.json({ error: "未授权" }, { status: 401 });
  }

  const { id } = await params;
  const submissionId = parseInt(id);
  if (isNaN(submissionId)) {
    return NextResponse.json({ error: "无效的ID" }, { status: 400 });
  }

  try {
    const { content } = await request.json();
    if (!content || !content.trim()) {
      return NextResponse.json({ error: "备注内容不能为空" }, { status: 400 });
    }

    const note = await prisma.noteEntry.create({
      data: {
        submissionId,
        content: content.trim(),
      },
    });

    return NextResponse.json(note, { status: 201 });
  } catch {
    return NextResponse.json({ error: "保存失败" }, { status: 500 });
  }
}
