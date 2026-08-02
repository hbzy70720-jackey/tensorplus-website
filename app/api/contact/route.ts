import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, company, phone, message, source } = body;

    // Server-side validation
    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json(
        { error: "姓名不能为空" },
        { status: 400 }
      );
    }

    if (!company || typeof company !== "string" || !company.trim()) {
      return NextResponse.json(
        { error: "公司/机构不能为空" },
        { status: 400 }
      );
    }

    if (!phone || typeof phone !== "string" || !phone.trim()) {
      return NextResponse.json(
        { error: "电话不能为空" },
        { status: 400 }
      );
    }

    if (
      email &&
      typeof email === "string" &&
      email.trim() &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      return NextResponse.json(
        { error: "请提供有效的邮箱地址" },
        { status: 400 }
      );
    }

    if (
      !message ||
      typeof message !== "string" ||
      message.trim().length < 10
    ) {
      return NextResponse.json(
        { error: "需求描述至少需要10个字" },
        { status: 400 }
      );
    }

    // 写入数据库
    await prisma.submission.create({
      data: {
        name: name.trim(),
        email: email?.trim() || null,
        company: company?.trim() || null,
        phone: phone?.trim() || null,
        message: message.trim(),
        source: source === "demo" ? "demo" : "contact",
      },
    });

    return NextResponse.json(
      { success: true, message: "感谢您的咨询，我们会在24小时内回复。" },
      { status: 200 }
    );
  } catch (err) {
    console.error("Contact form error:", err);
    return NextResponse.json(
      { error: "服务器错误，请稍后再试" },
      { status: 500 }
    );
  }
}
