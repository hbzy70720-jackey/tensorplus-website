import type { Metadata } from "next";
import { Building2, MapPin } from "lucide-react";
import Section from "@/components/layout/section";
import SectionHeading from "@/components/layout/section-heading";
import Container from "@/components/layout/container";
import ProductCTA from "@/components/product/product-cta";

export const metadata: Metadata = {
  title: "关于我们",
  description:
    "北京张量无限科技有限公司，专注于户外机器人高精度3D感知与户外作业机器人解决方案。",
};

const milestones = [
  {
    year: "2020",
    title: "公司成立",
    desc: "北京张量无限科技有限公司在北京中关村智造大街成立，核心团队来自清华大学计算机系。",
  },
  {
    year: "2022",
    title: "首款3D相机发布",
    desc: "推出首款户外高精度3D相机，实现毫米级精度成像，填补户外高精度3D成像的市场空白。",
  },
  {
    year: "2024",
    title: "光伏行业成功落地",
    desc: "光伏组件安装机器人视觉系统成功签约多家机器人企业，成为业内领先的3D感知解决方案。",
  },
  {
    year: "2025",
    title: "第二代3D相机发布",
    desc: "成像精度达到亚毫米级，且更为稳定，在各种极端的室外场景下均可稳定地生成高精度的3D图像。",
  },
  {
    year: "2026",
    title: "户外作业机器人发布",
    desc: "推出户外作业机器人，融合自主导航与3D感知，成功应用于农业、林业等领域。",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-[var(--bg-deep)] py-16">
        <Container className="text-center">
          <div className="mx-auto mb-6 inline-flex rounded-2xl bg-blue-500/10 p-4">
            <Building2 className="h-10 w-10 text-[var(--accent-glow)]" />
          </div>
          <h1 className="font-[family-name:var(--font-heading)] text-3xl font-bold tracking-tight text-white sm:text-4xl">
            关于<span className="gradient-text">TensorPlus</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-gray-400">
            我们致力于让每一台户外机器人都能看懂世界，自主行走。
            从3D感知到自主导航，TensorPlus
            正在重新定义机器人与物理世界的交互方式。
          </p>
        </Container>
      </section>

      {/* Mission */}
      <Section variant="light">
        <Container>
          <SectionHeading
            title="使命与愿景"
            subtitle="以技术创新为驱动，为全球户外机器人提供可靠的『眼睛』和『大脑』"
          />
          <div className="mx-auto grid max-w-4xl gap-6 sm:grid-cols-2">
            <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-white p-8">
              <h3 className="mb-4 font-[family-name:var(--font-heading)] text-xl font-bold text-[var(--accent)]">
                我们的使命
              </h3>
              <p className="leading-relaxed text-[var(--text-muted)]">
                为户外机器人提供高可靠、高精度的感知与导航解决方案，
                让机器人在真实世界中安全、精准、高效地工作。
              </p>
            </div>
            <div className="rounded-2xl border border-cyan-100 bg-gradient-to-br from-cyan-50 to-white p-8">
              <h3 className="mb-4 font-[family-name:var(--font-heading)] text-xl font-bold text-[var(--accent-glow)]">
                我们的愿景
              </h3>
              <p className="leading-relaxed text-[var(--text-muted)]">
                成为全球领先的户外机器人智能系统提供商，
                让每一台户外机器人都具备"看"和"走"的智能能力。
              </p>
            </div>
          </div>
        </Container>
      </Section>

      {/* Timeline */}
      <Section variant="gray">
        <Container>
          <SectionHeading
            title="发展历程"
            subtitle="从初创到行业领先的每一步"
          />
          <div className="mx-auto max-w-3xl">
            {milestones.map((m, i) => (
              <div key={m.year} className="relative flex gap-6 pb-8 last:pb-0">
                {/* Line */}
                {i < milestones.length - 1 && (
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
            title="找到我们"
            subtitle="欢迎来访，技术交流与合作洽谈"
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
