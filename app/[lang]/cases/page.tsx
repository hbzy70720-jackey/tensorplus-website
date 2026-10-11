import type { Metadata } from "next";
import { FolderOpen } from "lucide-react";
import Section from "@/components/layout/section";
import SectionHeading from "@/components/layout/section-heading";
import Container from "@/components/layout/container";
import ProductHero from "@/components/product/product-hero";
import ProductCTA from "@/components/product/product-cta";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { seoMeta } from "@/lib/seo";
import CaseList from "./case-list";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const isEn = lang === "en";
  const t = getDictionary(lang);
  return {
    title: t.cases.metaTitle,
    description: t.cases.metaDescription,
    ...seoMeta("/cases", isEn),
  };
}

export default async function CasesPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const t = getDictionary(lang);

  return (
    <>
      {/* Hero */}
      <ProductHero
        title={t.cases.heroTitle}
        tagline={t.cases.heroTagline}
        description={t.cases.heroDescription}
        icon={<FolderOpen className="h-10 w-10 text-[var(--accent-glow)]" />}
      />

      <Section variant="light">
        <Container>
          <SectionHeading
            title={t.cases.listTitle}
            subtitle={t.cases.listSubtitle}
          />
          <CaseList />
        </Container>
      </Section>

      <ProductCTA />
    </>
  );
}
