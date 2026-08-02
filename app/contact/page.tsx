import type { Metadata } from "next";
import { MessageCircle } from "lucide-react";
import Section from "@/components/layout/section";
import SectionHeading from "@/components/layout/section-heading";
import Container from "@/components/layout/container";
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
      <section className="bg-[var(--bg-deep)] py-16">
        <Container className="text-center">
          <div className="mx-auto mb-6 inline-flex rounded-2xl bg-blue-500/10 p-4">
            <MessageCircle className="h-10 w-10 text-[var(--accent-glow)]" />
          </div>
          <h1 className="font-[family-name:var(--font-heading)] text-3xl font-bold tracking-tight text-white sm:text-4xl">
            预约<span className="gradient-text">演示</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-gray-400">
            填写下方表单，我们的技术专家会在24小时内与您联系，为您安排一对一产品演示。
          </p>
        </Container>
      </section>

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
