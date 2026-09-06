import type { Metadata } from "next";
import { MessageCircle } from "lucide-react";
import Section from "@/components/layout/section";
import SectionHeading from "@/components/layout/section-heading";
import Container from "@/components/layout/container";
import ProductHero from "@/components/product/product-hero";
import ContactForm from "@/components/contact/contact-form";
import ContactInfo from "@/components/contact/contact-info";

export const metadata: Metadata = {
  title: "预约演示",
  description:
    "预约TensorPlus张量无限产品演示 — 获取3D感知方案、户外作业机器人一对一技术演示。",
};

export default function ContactPage() {
  return (
    <>
      {/* Hero */}
      <ProductHero
        title="预约演示"
        tagline="一对一技术演示，24小时快速响应"
        description="填写下方表单，我们的技术专家将会在24小时内与您联系，为您安排产品介绍以及一对一现场产品演示。"
        icon={<MessageCircle className="h-10 w-10 text-[var(--accent-glow)]" />}
      />

      <Section variant="light">
        <Container>
          <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-5">
            {/* Form */}
            <div className="lg:col-span-3">
              <h2 className="mb-8 font-[family-name:var(--font-heading)] text-2xl font-bold text-[var(--text-dark)]">
                发送咨询
              </h2>
              <ContactForm />
            </div>

            {/* Info */}
            <div className="lg:col-span-2">
              <h2 className="mb-8 font-[family-name:var(--font-heading)] text-2xl font-bold text-[var(--text-dark)]">
                联系信息
              </h2>
              <ContactInfo />
            </div>
          </div>

          {/* Reassurance */}
          <div className="mx-auto mt-16 max-w-lg rounded-2xl bg-blue-50 p-6 text-center">
            <p className="text-sm font-medium text-[var(--accent)]">
              我们会在24小时内回复您的咨询
            </p>
          </div>
        </Container>
      </Section>
    </>
  );
}
