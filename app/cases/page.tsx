import type { Metadata } from "next";
import { FolderOpen } from "lucide-react";
import Section from "@/components/layout/section";
import SectionHeading from "@/components/layout/section-heading";
import Container from "@/components/layout/container";
import ProductHero from "@/components/product/product-hero";
import ProductCTA from "@/components/product/product-cta";
import CaseList from "./case-list";

export const metadata: Metadata = {
  title: "客户案例",
  description:
    "TensorPlus 客户交付案例展示，涵盖光伏、林业、石油、电力等行业的户外机器人3D感知解决方案。",
};

export default function CasesPage() {
  return (
    <>
      {/* Hero */}
      <ProductHero
        title="客户案例"
        tagline="聚焦行业真实痛点+深入客户作业一线"
        description="从光伏到林业，从电力到石油——我们的解决方案已在多个行业头部客户落地验证，为客户的智能化作业创造可量化价值"
        icon={<FolderOpen className="h-10 w-10 text-[var(--accent-glow)]" />}
      />

      <Section variant="light">
        <Container>
          <SectionHeading
            title="交付案例"
            subtitle="每一个案例都是一份信任与承诺"
          />
          <CaseList />
        </Container>
      </Section>

      <ProductCTA />
    </>
  );
}
