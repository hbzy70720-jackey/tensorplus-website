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
  const status = searchParams.get("status") || "";
  const source = searchParams.get("source") || "";

  const where: Prisma.SubmissionWhereInput = {};
  if (search) {
    where.OR = [
      { name: { contains: search } },
      { email: { contains: search } },
      { phone: { contains: search } },
    ];
  }
  if (status && ["new", "processing", "replied"].includes(status)) {
    where.status = status;
  }
  if (source && ["contact", "demo"].includes(source)) {
    where.source = source;
  }

  const submissions = await prisma.submission.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  const header = "姓名,邮箱,电话,公司,需求描述,来源,状态,提交时间,内部备注\n";
  const statusMap: Record<string, string> = {
    new: "新提交",
    processing: "处理中",
    replied: "已回复",
  };

  const rows = submissions
    .map((s) => {
      return [
        `"${s.name.replace(/"/g, '""')}"`,
        `"${(s.email || "").replace(/"/g, '""')}"`,
        `"${(s.phone || "").replace(/"/g, '""')}"`,
        `"${(s.company || "").replace(/"/g, '""')}"`,
        `"${s.message.replace(/"/g, '""')}"`,
        s.source === "demo" ? "预约演示" : "联系我们",
        statusMap[s.status] || s.status,
        s.createdAt.toISOString(),
        `"${(s.notes || "").replace(/"/g, '""')}"`,
      ].join(",");
    })
    .join("\n");

  const csv = "﻿" + header + rows; // BOM for Excel 中文兼容

  const date = new Date().toISOString().split("T")[0];
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="submissions-export-${date}.csv"`,
    },
  });
}
