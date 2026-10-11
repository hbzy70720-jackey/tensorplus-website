import HeroBanner from "@/components/hero/hero-banner";
import ProductCards from "@/components/home/product-cards";
import IndustryCarousel from "@/components/home/industry-carousel";
import StatsSection from "@/components/home/stats-section";
import CTABanner from "@/components/home/cta-banner";
import Section from "@/components/layout/section";
import SectionHeading from "@/components/layout/section-heading";
import Container from "@/components/layout/container";

export default function HomePage() {
  return (
    <>
      {/* Section 1: Hero (Dark) */}
      <HeroBanner />

      {/* Section 2: Product Overview (Dark → Transition) */}
      <Section variant="transition" id="products">
        <Container>
          <SectionHeading
            title="核心产品方案"
            subtitle="两大核心产品线，覆盖从感知到执行的完整闭环"
            light
          />
          <ProductCards />
        </Container>
      </Section>

      {/* Section 3: Industry Applications (Light) */}
      <Section variant="gray">
        <Container>
          <SectionHeading
            title="行业应用场景"
            subtitle="深耕四大行业，解决方案已在多个头部客户落地验证"
          />
          <IndustryCarousel />
        </Container>
      </Section>

      {/* Section 4: Key Stats (Light) */}
      <Section variant="light">
        <Container>
          <SectionHeading
            title="核心优势"
            subtitle="实现复杂场景下的极高精度与可靠性"
          />
          <StatsSection />
        </Container>
      </Section>

      {/* Section 5: CTA (Dark) */}
      <CTABanner />
    </>
  );
}
