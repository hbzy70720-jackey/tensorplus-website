import { NextResponse } from "next/server";
import { clearAuthCookie } from "@/lib/auth";

export async function POST(request: Request) {
  // 动态取当前访问的 origin，避免硬编码 localhost，适配本地/宝塔/华为云等任意部署环境
  const origin = new URL(request.url).origin;
  const response = NextResponse.redirect(new URL("/admin/login", origin));
  response.headers.append("Set-Cookie", clearAuthCookie());
  return response;
}
