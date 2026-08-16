import { NextResponse } from "next/server";
import { clearAuthCookie } from "@/lib/auth";

export async function POST() {
  // 用相对路径跳转，浏览器会自动在当前域名下跳转，
  // 彻底避免反向代理（宝塔/华为云）把 origin 解析成 localhost 的问题
  const response = new NextResponse(null, { status: 303 });
  response.headers.set("Location", "/admin/login");
  response.headers.append("Set-Cookie", clearAuthCookie());
  return response;
}
