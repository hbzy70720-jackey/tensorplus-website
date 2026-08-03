import type { Metadata } from "next";
import { FolderOpen } from "lucide-react";
import Section from "@/components/layout/section";
import SectionHeading from "@/components/layout/section-heading";
import Container from "@/components/layout/container";
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
      <section className="bg-[var(--bg-deep)] py-16">
        <Container className="text-center">
          <div className="mx-auto mb-6 inline-flex rounded-2xl bg-blue-500/10 p-4">
            <FolderOpen className="h-10 w-10 text-[var(--accent-glow)]" />
          </div>
          <h1 className="font-[family-name:var(--font-heading)] text-3xl font-bold tracking-tight text-white sm:text-4xl">
            客户<span className="gradient-text">案例</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-gray-400">
            从光伏到林业，从石油到电力 — 我们的解决方案已在多个行业头部客户落地验证。
          </p>
        </Container>
      </section>

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
