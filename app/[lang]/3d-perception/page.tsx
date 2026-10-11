import type { Metadata } from "next";
import { Camera, ScanEye, Sun, Eye } from "lucide-react";
import ProductHero from "@/components/product/product-hero";
import FeatureGrid from "@/components/product/feature-grid";
import ProductCarousel from "@/components/product/product-carousel";
import ScenarioShowcase from "@/components/product/scenario-showcase";
import ProductCTA from "@/components/product/product-cta";
import Section from "@/components/layout/section";
import SectionHeading from "@/components/layout/section-heading";
import Container from "@/components/layout/container";
import { getDictionary } from "@/lib/i18n/dictionaries";

export const metadata: Metadata = {
  title: "3D感知方案",
  description:
    "高精度3D相机 + 物体识别算法，亚毫米级精度，抗强光干扰。为光伏、电力、林业、石油等行业提供开箱即用的视觉解决方案。",
};

// 图标与图片路径（不可翻译的展示元数据），与词典 perception.* 按索引对齐
const featureIcons = [
  <Camera key="camera" className="h-6 w-6 text-[var(--accent)]" />,
  <ScanEye key="scaneye" className="h-6 w-6 text-[var(--accent)]" />,
  <Sun key="sun" className="h-6 w-6 text-[var(--accent)]" />,
];

const productImages = [
  { imagePath: "/uploads/perception/tensor-plus", imagePlaceholder: "tensor-plus" },
  { imagePath: "/uploads/perception/tensor-eye", imagePlaceholder: "tensor-eye" },
  { imagePath: "/uploads/perception/tensor-mini", imagePlaceholder: "tensor-mini" },
];

const scenarioMeta = [
  { images: ["pv-1", "pv-2", "pv-3"], imageFolder: "perception" },
  { images: ["log-1", "log-2", "log-3"], imageFolder: "perception" },
];

export default async function PerceptionPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const t = getDictionary(lang);

  const features = t.perception.features.map((f, i) => ({ ...f, icon: featureIcons[i] }));
  const products = t.perception.products.map((p, i) => ({ ...p, ...productImages[i] }));
  const scenarios = t.perception.scenarios.map((s, i) => ({ ...s, ...scenarioMeta[i] }));

  return (
    <>
      <ProductHero
        title={t.perception.heroTitle}
        tagline={t.perception.heroTagline}
        description={t.perception.heroDescription}
        icon={<Eye className="h-10 w-10 text-[var(--accent-glow)]" />}
      />

      <Section variant="light">
        <Container>
          <SectionHeading
            title={t.perception.capabilitiesTitle}
            subtitle={t.perception.capabilitiesSubtitle}
          />
          <FeatureGrid features={features} />
        </Container>
      </Section>

      <Section variant="gray">
        <Container>
          <SectionHeading
            title={t.perception.seriesTitle}
            subtitle={t.perception.seriesSubtitle}
          />
          <ProductCarousel products={products} />
        </Container>
      </Section>

      <Section variant="light">
        <Container>
          <SectionHeading
            title={t.perception.scenariosTitle}
            subtitle={t.perception.scenariosSubtitle}
          />
          <ScenarioShowcase scenarios={scenarios} />
        </Container>
      </Section>

      <ProductCTA />
    </>
  );
}
