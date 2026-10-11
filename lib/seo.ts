import type { Metadata } from "next";

export const SITE_URL = "https://www.tensorplus.cn";

// 生成站内页面的 canonical + hreflang + openGraph（locale/url）。
// path 为不含 locale 前缀的站内路径：首页用 ""，其余如 "/about"、"/cases/6"。
export function seoMeta(
  path: string,
  isEn: boolean
): Pick<Metadata, "alternates" | "openGraph"> {
  const zhUrl = `${SITE_URL}${path}`;
  const enUrl = `${SITE_URL}/en${path}`;
  return {
    alternates: {
      canonical: isEn ? enUrl : zhUrl,
      languages: { "zh-CN": zhUrl, en: enUrl },
    },
    openGraph: { locale: isEn ? "en_US" : "zh_CN", url: isEn ? enUrl : zhUrl },
  };
}
