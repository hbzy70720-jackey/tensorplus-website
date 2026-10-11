import type { Locale } from "@/lib/i18n/config";

// 去掉路径开头的 /en 或 /zh 前缀（若有），得到不带 locale 的路径
export function stripLocalePrefix(pathname: string): string {
  if (pathname === "/en") return "/";
  if (pathname.startsWith("/en/")) return pathname.slice(3) || "/";
  if (pathname === "/zh") return "/";
  if (pathname.startsWith("/zh/")) return pathname.slice(3) || "/";
  return pathname;
}

// 生成目标语言的同页路径
export function localizePath(pathname: string, targetLang: Locale): string {
  const base = stripLocalePrefix(pathname);
  if (targetLang === "en") return base === "/" ? "/en" : `/en${base}`;
  return base;
}

// 生成目标语言下的站内链接（给 <Link href> 用）
export function localizedHref(href: string, lang: Locale): string {
  if (href.startsWith("http") || href.startsWith("mailto") || href.startsWith("#")) return href;
  return lang === "en" ? (href === "/" ? "/en" : `/en${href}`) : href;
}
