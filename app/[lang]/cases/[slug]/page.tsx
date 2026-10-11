import type { Metadata } from "next";
import { notFound } from "next/navigation";
import prisma from "@/lib/db";
import Container from "@/components/layout/container";
import Section from "@/components/layout/section";
import ProductCTA from "@/components/product/product-cta";
import { Calendar, Building2, Tag, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { getDictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";
import { industryLabel, industryColor } from "@/lib/industry";
import { localizedHref } from "@/lib/locale-link";

interface PageProps {
  params: Promise<{ lang: Locale; slug: string }>;
}

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang, slug } = await params;
  const isEn = lang === "en";
  const caseStudy = await prisma.caseStudy.findUnique({
    where: { slug, published: true },
  });

  if (!caseStudy) {
    return { title: isEn ? "Case not found" : "案例不存在" };
  }

  const title = isEn ? caseStudy.titleEn || caseStudy.title : caseStudy.title;
  const description = isEn
    ? caseStudy.descriptionEn || caseStudy.description
    : caseStudy.description;

  return {
    title,
    description: description || (isEn ? `Customer story: ${title}` : `客户案例：${title}`),
  };
}

export default async function CaseDetailPage({ params }: PageProps) {
  const { lang, slug } = await params;
  const isEn = lang === "en";
  const t = getDictionary(lang);
  const caseStudy = await prisma.caseStudy.findUnique({
    where: { slug, published: true },
  });

  if (!caseStudy) notFound();

  // 按 lang 取值，英文字段为空时回退中文
  const title = isEn ? caseStudy.titleEn || caseStudy.title : caseStudy.title;
  const customer = isEn ? caseStudy.customerEn || caseStudy.customer : caseStudy.customer;
  const content = isEn ? caseStudy.contentEn || caseStudy.content : caseStudy.content;
  const tagsRaw = isEn
    ? caseStudy.tagsEn && caseStudy.tagsEn !== "[]"
      ? caseStudy.tagsEn
      : caseStudy.tags
    : caseStudy.tags;

  const tagList: string[] = (() => {
    try {
      return JSON.parse(tagsRaw);
    } catch {
      return [];
    }
  })();

  return (
    <>
      {/* Hero */}
      <section className="relative bg-[var(--bg-deep)] pt-32 pb-20">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-blue-900/20 via-transparent to-cyan-900/10" />
        <Container className="relative z-10">
          <Link
            href={localizedHref("/cases", lang)}
            className="mb-6 inline-flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            {t.cases.backToList}
          </Link>

          <div className="mx-auto max-w-3xl text-center">
            {/* Badges */}
            <div className="mb-8 flex flex-wrap items-center justify-center gap-2.5">
              {caseStudy.industry && (
                <span className={`inline-block rounded-full px-3 py-1 text-sm font-medium ${industryColor(caseStudy.industry)}`}>
                  {industryLabel(caseStudy.industry, lang)}
                </span>
              )}
              {tagList.map((tag) => (
                <span key={tag} className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-sm text-gray-300">
                  <Tag className="h-3.5 w-3.5" />
                  {tag}
                </span>
              ))}
            </div>

            <h1 className="font-[family-name:var(--font-heading)] text-3xl font-bold tracking-tight text-white sm:text-4xl">
              {title}
            </h1>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-base text-gray-400">
              {customer && (
                <span className="inline-flex items-center gap-1.5">
                  <Building2 className="h-5 w-5 text-[var(--accent-glow)]" />
                  {customer}
                </span>
              )}
              {caseStudy.deliveryDate && (
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="h-5 w-5 text-[var(--accent-glow)]" />
                  {caseStudy.deliveryDate}
                </span>
              )}
            </div>
          </div>
        </Container>
      </section>

      {/* Content */}
      <Section variant="light">
        <Container>
          <article className="mx-auto max-w-3xl">
            {/* Cover Image */}
            {caseStudy.coverImage && (
              <img
                src={caseStudy.coverImage}
                alt={title}
                className="mb-10 w-full rounded-2xl object-cover shadow-lg"
              />
            )}

            {/* HTML Content */}
            <div
              className="prose prose-lg max-w-none
                [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mt-8 [&_h1]:mb-4
                [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mt-8 [&_h2]:mb-4
                [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:mt-6 [&_h3]:mb-3
                [&_p]:my-4 [&_p]:leading-relaxed [&_p]:text-[var(--text-muted)]
                [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:my-4 [&_ul]:space-y-1
                [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:my-4 [&_ol]:space-y-1
                [&_li]:text-[var(--text-muted)]
                [&_blockquote]:border-l-4 [&_blockquote]:border-[var(--accent)] [&_blockquote]:bg-blue-50/50 [&_blockquote]:pl-6 [&_blockquote]:py-4 [&_blockquote]:pr-4 [&_blockquote]:rounded-r-lg [&_blockquote]:my-6
                [&_blockquote_p]:text-[var(--text-dark)] [&_blockquote_p]:my-0
                [&_pre]:bg-gray-900 [&_pre]:text-gray-100 [&_pre]:rounded-xl [&_pre]:p-6 [&_pre]:overflow-x-auto [&_pre]:my-6
                [&_code]:bg-gray-100 [&_code]:rounded [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-sm [&_code]:text-pink-600
                [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:text-gray-100
                [&_img]:rounded-xl [&_img]:max-w-full [&_img]:my-6 [&_img]:shadow-md
                [&_a]:text-[var(--accent)] [&_a]:underline [&_a]:decoration-[var(--accent-glow)] [&_a]:underline-offset-2
                [&_hr]:my-10 [&_hr]:border-gray-200
                [&_table]:w-full [&_table]:border-collapse [&_table]:my-6 [&_table]:text-sm
                [&_th]:border [&_th]:border-gray-300 [&_th]:bg-gray-50 [&_th]:px-4 [&_th]:py-2 [&_th]:text-left [&_th]:font-semibold
                [&_td]:border [&_td]:border-gray-300 [&_td]:px-4 [&_td]:py-2
                [&_tr:nth-child(even)_td]:bg-gray-50/50
              "
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </article>
        </Container>
      </Section>

      <ProductCTA />
    </>
  );
}
