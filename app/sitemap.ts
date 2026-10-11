import type { MetadataRoute } from "next";
import prisma from "@/lib/db";

const SITE = "https://www.tensorplus.cn";

// 静态路径（不含 locale 前缀，首页用 ""）
const STATIC_PATHS: { path: string; priority: number }[] = [
  { path: "", priority: 1 },
  { path: "/3d-perception", priority: 0.8 },
  { path: "/robot", priority: 0.8 },
  { path: "/cases", priority: 0.7 },
  { path: "/about", priority: 0.6 },
  { path: "/contact", priority: 0.8 },
];

// 生成 zh 与 en 两条 entry，双向 hreflang
function bilingualEntry(
  path: string,
  lastModified: Date,
  priority: number
): MetadataRoute.Sitemap {
  const zhUrl = `${SITE}${path}`;
  const enUrl = `${SITE}/en${path}`;
  const alternates = { languages: { "zh-CN": zhUrl, en: enUrl } };
  return [
    {
      url: zhUrl,
      lastModified,
      changeFrequency: "monthly",
      priority,
      alternates,
    },
    {
      url: enUrl,
      lastModified,
      changeFrequency: "monthly",
      priority,
      alternates,
    },
  ];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];
  const now = new Date();

  for (const { path, priority } of STATIC_PATHS) {
    entries.push(...bilingualEntry(path, now, priority));
  }

  // 动态案例条目（仅已发布）
  const cases = await prisma.caseStudy.findMany({
    where: { published: true },
    select: { slug: true, updatedAt: true },
  });
  for (const c of cases) {
    entries.push(...bilingualEntry(`/cases/${c.slug}`, c.updatedAt, 0.7));
  }

  return entries;
}
