import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Bot, Sun, Sparkles, Sunset, ScanEye, Gauge, ClipboardList, RefreshCw, Crosshair } from "lucide-react";
import ProductHero from "@/components/product/product-hero";
import SpecTable from "@/components/product/spec-table";
import TechHighlights from "@/components/product/tech-highlights";
import ProductCTA from "@/components/product/product-cta";
import Section from "@/components/layout/section";
import SectionHeading from "@/components/layout/section-heading";
import Container from "@/components/layout/container";
import { getDictionary } from "@/lib/i18n/dictionaries";

export const metadata: Metadata = {
  title: "户外作业机器人",
  description:
    "户外作业机器人，具备自主导航（SLAM+路径规划+避障）和自主执行能力，可精确可靠地完成各种复杂动作，适用于农业、林业、石油、电力等行业。",
};

// 子项图标与图片路径（不可翻译的展示元数据），与词典 robot.techHighlights 按索引对齐
const techSubItemIcons: ReactNode[][] = [
  [
    <Sun key="sun" className="h-5 w-5" />,
    <Sparkles key="sparkles" className="h-5 w-5" />,
    <Sunset key="sunset" className="h-5 w-5" />,
  ],
  [
    <ScanEye key="scaneye" className="h-5 w-5" />,
    <Gauge key="gauge" className="h-5 w-5" />,
  ],
  [
    <ClipboardList key="clipboard" className="h-5 w-5" />,
    <RefreshCw key="refresh" className="h-5 w-5" />,
    <Crosshair key="crosshair" className="h-5 w-5" />,
  ],
];

const techImages = [
  { images: ["perception-1", "perception-2", "perception-3", "perception-4"], imageFolder: "robot" },
  { images: ["navigation-1", "navigation-2"], imageFolder: "robot" },
  { images: ["execution-1", "execution-2"], imageFolder: "robot" },
];

export default async function RobotPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const t = getDictionary(lang);

  const techHighlights = t.robot.techHighlights.map((item, i) => ({
    ...item,
    ...techImages[i],
    subItems: item.subItems.map((sub, j) => ({ ...sub, icon: techSubItemIcons[i][j] })),
  }));

  return (
    <>
      <ProductHero
        title={t.robot.heroTitle}
        tagline={t.robot.heroTagline}
        description={t.robot.heroDescription}
        icon={<Bot className="h-10 w-10 text-emerald-400" />}
      />

      <Section variant="light">
        <Container>
          <SectionHeading
            title={t.robot.highlightsTitle}
            subtitle={t.robot.highlightsSubtitle}
          />
          <TechHighlights items={techHighlights} />
        </Container>
      </Section>

      <Section variant="gray">
        <Container>
          <SectionHeading
            title={t.robot.specsTitle}
            subtitle={t.robot.specsSubtitle}
          />
          <SpecTable specs={t.robot.specs} />
        </Container>
      </Section>

      <ProductCTA />
    </>
  );
}
