import type { Metadata } from "next";
import { Building2, MapPin } from "lucide-react";
import Section from "@/components/layout/section";
import SectionHeading from "@/components/layout/section-heading";
import Container from "@/components/layout/container";
import ProductHero from "@/components/product/product-hero";
import ProductCTA from "@/components/product/product-cta";
import { getDictionary } from "@/lib/i18n/dictionaries";

export const metadata: Metadata = {
  title: "关于我们",
  description:
    "北京张量无限科技有限公司，专注于户外机器人高精度3D感知与户外作业机器人解决方案。",
};

export default async function AboutPage({
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
        title={t.about.heroTitle}
        tagline={t.about.heroTagline}
        description={
          <>
            {t.about.heroDesc1}
            <br />
            {t.about.heroDesc2}
          </>
        }
        icon={<Building2 className="h-10 w-10 text-[var(--accent-glow)]" />}
      />

      {/* Mission */}
      <Section variant="light">
        <Container>
          <SectionHeading
            title={t.about.missionTitle}
            subtitle={t.about.missionSubtitle}
          />
          <div className="mx-auto grid max-w-4xl gap-6 sm:grid-cols-2">
            <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-white p-8">
              <h3 className="mb-4 font-[family-name:var(--font-heading)] text-xl font-bold text-[var(--accent)]">
                {t.about.missionCardTitle}
              </h3>
              <p className="leading-relaxed text-[var(--text-muted)]">
                {t.about.missionCardDesc}
              </p>
            </div>
            <div className="rounded-2xl border border-cyan-100 bg-gradient-to-br from-cyan-50 to-white p-8">
              <h3 className="mb-4 font-[family-name:var(--font-heading)] text-xl font-bold text-[var(--accent-glow)]">
                {t.about.visionCardTitle}
              </h3>
              <p className="leading-relaxed text-[var(--text-muted)]">
                {t.about.visionCardDesc}
              </p>
            </div>
          </div>
        </Container>
      </Section>

      {/* Timeline */}
      <Section variant="gray">
        <Container>
          <SectionHeading
            title={t.about.timelineTitle}
            subtitle={t.about.timelineSubtitle}
          />
          <div className="mx-auto max-w-3xl">
            {t.about.milestones.map((m, i) => (
              <div key={m.year} className="relative flex gap-6 pb-8 last:pb-0">
                {/* Line */}
                {i < t.about.milestones.length - 1 && (
                  <div className="absolute left-[27px] top-12 h-full w-px bg-gray-200" />
                )}
                {/* Dot */}
                <div className="relative shrink-0">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[var(--accent)] to-[var(--accent-glow)] text-sm font-bold text-white shadow-lg shadow-blue-500/25">
                    {m.year}
                  </div>
                </div>
                {/* Content */}
                <div className="pt-1">
                  <h3 className="font-[family-name:var(--font-heading)] text-lg font-bold text-[var(--text-dark)]">
                    {m.title}
                  </h3>
                  <p className="mt-2 leading-relaxed text-[var(--text-muted)]">
                    {m.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Address */}
      <Section variant="light">
        <Container className="text-center">
          <SectionHeading
            title={t.about.addressTitle}
            subtitle={t.about.addressSubtitle}
          />
          <div className="mx-auto flex max-w-lg items-start gap-4 rounded-2xl border border-gray-100 bg-white p-8 text-left shadow-[var(--shadow-card)]">
            <MapPin className="mt-1 h-6 w-6 shrink-0 text-[var(--accent)]" />
            <div>
              <p className="font-semibold text-[var(--text-dark)]">
                北京张量无限科技有限公司
              </p>
              <p className="mt-1 text-[var(--text-muted)]">
                北京市海淀区成府路45号
                <br />
                中关村智造大街G座2层206
              </p>
            </div>
          </div>
        </Container>
      </Section>

      <ProductCTA />
    </>
  );
}
