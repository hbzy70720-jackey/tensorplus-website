import HeroBanner from "@/components/hero/hero-banner";
import ProductCards from "@/components/home/product-cards";
import IndustryCarousel from "@/components/home/industry-carousel";
import StatsSection from "@/components/home/stats-section";
import CTABanner from "@/components/home/cta-banner";
import Section from "@/components/layout/section";
import SectionHeading from "@/components/layout/section-heading";
import Container from "@/components/layout/container";
import { getDictionary } from "@/lib/i18n/dictionaries";

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const t = getDictionary(lang);

  return (
    <>
      {/* Section 1: Hero (Dark) */}
      <HeroBanner />

      {/* Section 2: Product Overview (Dark → Transition) */}
      <Section variant="transition" id="products">
        <Container>
          <SectionHeading
            title={t.home.productsTitle}
            subtitle={t.home.productsSubtitle}
            light
          />
          <ProductCards />
        </Container>
      </Section>

      {/* Section 3: Industry Applications (Light) */}
      <Section variant="gray">
        <Container>
          <SectionHeading
            title={t.home.industriesTitle}
            subtitle={t.home.industriesSubtitle}
          />
          <IndustryCarousel />
        </Container>
      </Section>

      {/* Section 4: Key Stats (Light) */}
      <Section variant="light">
        <Container>
          <SectionHeading
            title={t.home.statsTitle}
            subtitle={t.home.statsSubtitle}
          />
          <StatsSection />
        </Container>
      </Section>

      {/* Section 5: CTA (Dark) */}
      <CTABanner />
    </>
  );
}
