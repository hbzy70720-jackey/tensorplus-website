import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getAuthCookieName, verifyToken } from "@/lib/auth";

// 排除后台/接口/静态资源；无前缀公共页面 rewrite 到 /zh，/en 直通。
const EXCLUDED = /^\/(admin|api|_next)(\/|$)|\./;

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1) 后台鉴权：只处理 /admin，登录页放行，其余校验 token（原有逻辑）
  if (pathname.startsWith("/admin")) {
    if (pathname === "/admin/login") return NextResponse.next();

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

  // 2) 公共页面 locale：无前缀 rewrite 到 /zh，/en 直通，注入 x-locale 供根布局设置 <html lang>
  const isEn = pathname === "/en" || pathname.startsWith("/en/");
  const locale = isEn ? "en" : "zh";

  const headers = new Headers(request.headers);
  headers.set("x-locale", locale);

  if (EXCLUDED.test(pathname) || isEn) {
    return NextResponse.next({ request: { headers } });
  }

  const url = request.nextUrl.clone();
  url.pathname = "/zh" + (pathname === "/" ? "" : pathname);
  return NextResponse.rewrite(url, { request: { headers } });
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|images/|api/).*)",
  ],
};
