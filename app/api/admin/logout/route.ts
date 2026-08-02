import { NextResponse } from "next/server";
import { clearAuthCookie } from "@/lib/auth";

export async function POST() {
  const response = NextResponse.redirect(new URL("/admin/login", "http://localhost:3001"));
  response.headers.append("Set-Cookie", clearAuthCookie());
  return response;
}
