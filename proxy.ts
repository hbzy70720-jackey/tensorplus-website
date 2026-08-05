import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getAuthCookieName, verifyToken } from "@/lib/auth";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 只处理 /admin 路径
  if (!pathname.startsWith("/admin")) return NextResponse.next();

  // 登录页不拦截
  if (pathname === "/admin/login") return NextResponse.next();

  // 验证 token
  const token = request.cookies.get(getAuthCookieName())?.value;
  if (!token) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  const payload = await verifyToken(token);
  if (!payload) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
