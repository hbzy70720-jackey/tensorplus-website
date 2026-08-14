import type { Metadata } from "next";
import { Bot, Sun, Sparkles, Sunset, ScanEye, Gauge, ClipboardList, RefreshCw, Crosshair } from "lucide-react";
import ProductHero from "@/components/product/product-hero";
import SpecTable from "@/components/product/spec-table";
import TechHighlights from "@/components/product/tech-highlights";
import ProductCTA from "@/components/product/product-cta";
import Section from "@/components/layout/section";
import SectionHeading from "@/components/layout/section-heading";
import Container from "@/components/layout/container";

export const metadata: Metadata = {
  title: "户外作业机器人",
  description:
    "户外作业机器人，具备自主导航（SLAM+路径规划+避障）和自主执行能力，可精确可靠地完成各种复杂动作，适用于农业、林业、石油、电力等行业。",
};

const techHighlights = [
  {
    title: "3D感知",
    description:
      "在户外强阳光干扰、逆光等复杂条件下对常见材质的物体能达到亚毫米级的3D成像精度，效果稳定，抗干扰能力强。高质量的点云与彩色图像为视觉算法提供优质的输入数据。",
    highlight: "3D成像精度：亚毫米级",
    subItems: [
      {
        icon: <Sun className="h-5 w-5" />,
        title: "强阳光干扰",
        description: "在强阳光直射下依然稳定成像，不受环境光干扰。",
      },
      {
        icon: <Sparkles className="h-5 w-5" />,
        title: "高反光",
        description: "对金属、水面等高反光材质物体精准捕捉，点云完整。",
      },
      {
        icon: <Sunset className="h-5 w-5" />,
        title: "逆光",
        description: "逆光场景下保持成像质量不衰减，细节不丢失。",
      },
    ],
    images: ["perception-1", "perception-2", "perception-3", "perception-4"],
    imageFolder: "robot",
  },
  {
    title: "自主导航",
    description:
      "在野外复杂地形下实现完全自主的导航，机器人自主探索，感知周围环境，自动规划路径，控制底盘运动。",
    highlight: "RTK定位精度：±2cm",
    subItems: [
      {
        icon: <ScanEye className="h-5 w-5" />,
        title: "环境感知",
        description: "多传感器3D感知方案，构建精确的3D数字地图与作业任务地图。",
      },
      {
        icon: <Gauge className="h-5 w-5" />,
        title: "自主控制",
        description: "端到端路径规划+底盘控制与基于3D网格的路径规范方案融合，确保高精度、高可靠性，有效应对各种复杂的corner case。",
      },
    ],
    images: ["navigation-1", "navigation-2"],
    imageFolder: "robot",
  },
  {
    title: "自主执行",
    description:
      "自动规划任务，生成执行方案，无需人工过多干预。高精度3D感知方案用于引导机械臂完成精确、可靠的操作，支持多工具末端切换。",
    highlight: "操作重复精度：±0.5mm",
    subItems: [
      {
        icon: <ClipboardList className="h-5 w-5" />,
        title: "任务规划",
        description: "自动分解任务、生成执行序列，人工干预降到最低。",
      },
      {
        icon: <RefreshCw className="h-5 w-5" />,
        title: "末端切换",
        description: "支持多工具自动切换，适配不同作业需求。",
      },
      {
        icon: <Crosshair className="h-5 w-5" />,
        title: "精准操控",
        description: "3D感知引导机械臂，操作重复精度±0.5mm。",
      },
    ],
    images: ["execution-1", "execution-2"],
    imageFolder: "robot",
  },
];

const specs = [
  { param: "尺寸", value: "1832×1100×1400mm" },
  { param: "重量", value: "1750kg" },
  { param: "动力", value: "电动" },
  { param: "最大行驶速度", value: "12km/h" },
  { param: "最大爬坡角度", value: "30°" },
  { param: "工作温度", value: "-20℃~+60℃" },
  { param: "工业防护", value: "IP65" },
  { param: "电池续航", value: "5h" },
  { param: "控制方式", value: "视觉自动引导+规划" },
  { param: "底盘类型", value: "履带式" },
];

export default function RobotPage() {
  return (
    <>
      <ProductHero
        title="户外作业机器人"
        tagline="3D感知 + 自主导航 + 自主执行"
        description="针对户外场景的全自动作业机器人，融合亚毫米级3D感知、全地形自主导航与高精度自主执行能力，实现从感知到操作的完整闭环。"
        icon={<Bot className="h-10 w-10 text-emerald-400" />}
      />

      <Section variant="light">
        <Container>
          <SectionHeading
            title="技术亮点"
            subtitle="从感知到执行，全链路自主闭环"
          />
          <TechHighlights items={techHighlights} />
        </Container>
      </Section>

      <Section variant="gray">
        <Container>
          <SectionHeading
            title="技术规格"
            subtitle="工业级全地形移动平台参数"
          />
          <SpecTable specs={specs} />
        </Container>
      </Section>

      <ProductCTA />
    </>
  );
}
