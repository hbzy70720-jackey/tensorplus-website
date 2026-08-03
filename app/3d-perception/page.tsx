import type { Metadata } from "next";
import { Camera, ScanEye, Sun, Eye } from "lucide-react";
import ProductHero from "@/components/product/product-hero";
import FeatureGrid from "@/components/product/feature-grid";
import SpecTable from "@/components/product/spec-table";
import ScenarioShowcase from "@/components/product/scenario-showcase";
import ProductCTA from "@/components/product/product-cta";
import Section from "@/components/layout/section";
import SectionHeading from "@/components/layout/section-heading";
import Container from "@/components/layout/container";

export const metadata: Metadata = {
  title: "3D感知方案",
  description:
    "高精度3D相机 + 物体识别算法，亚毫米级精度，抗强光干扰。为光伏、电力、林业、石油等行业提供开箱即用的视觉解决方案。",
};

const features = [
  {
    icon: <Camera className="h-6 w-6 text-[var(--accent)]" />,
    title: "高精度3D相机",
    description:
      "户外强阳光干扰、逆光等复杂条件下，对常见材质物体达到亚毫米级3D成像精度。效果稳定，抗干扰能力强，提供高质量点云与彩色图像。",
    highlight: "精度: <0.1mm",
  },
  {
    icon: <ScanEye className="h-6 w-6 text-[var(--accent)]" />,
    title: "物体识别算法",
    description:
      "已实现光伏组件、光伏支架、原木等多种物体的姿态估计算法。可快速集成到机器人上，完成机械臂引导、精确测量、定位等任务。",
    highlight: "识别准确率: 99.8%",
  },
  {
    icon: <Sun className="h-6 w-6 text-[var(--accent)]" />,
    title: "全天候户外适配",
    description:
      "专为户外复杂光照环境设计，强阳光、阴影、逆光条件下均能稳定运行。已通过光伏电站、林场、油田等户外场景长期验证。",
    highlight: "IP67 防护等级",
  },
];

const specs = [
  { param: "3D成像精度", value: "<0.1mm @ 1m距离" },
  { param: "工作距离", value: "0.3m - 5m" },
  { param: "视场角 (FOV)", value: "60° × 45° (可定制)" },
  { param: "点云分辨率", value: "1920 × 1200" },
  { param: "帧率", value: "最高 30fps" },
  { param: "防护等级", value: "IP67" },
  { param: "工作温度", value: "-20°C ~ +60°C" },
  { param: "数据接口", value: "GigE / USB 3.0" },
  { param: "SDK支持", value: "C++ / Python / ROS" },
];

const scenarios = [
  {
    name: "光伏组件安装机器人",
    description:
      "3D视觉感知系统可精确计算出每一块光伏组件的安装位姿，引导机械臂完成完全自动化的组件安装，包括螺栓安装与紧固。",
    points: [
      "组件姿态估计精度±0.5mm，±0.1°",
      "支持不同类型的光伏组件与支架",
      "强阳光下稳定运行",
    ],
    images: ["pv-1.jpg", "pv-2.jpg", "pv-3.jpg"],
    imageFolder: "perception",
  },
  {
    name: "原木智能测量",
    description:
      "在林业场景中，3D相机可快速扫描原木堆，精确测量每根原木的直径和体积，用于交易、交割以及生产管理。",
    points: [
      "单次扫描测量时间 <25秒",
      "直径测量平均误差 <±2mm",
      "支持全球各地的检尺标准",
    ],
    images: ["log-1.jpg", "log-2.jpg", "log-3.jpg"],
    imageFolder: "perception",
  },
];

export default function PerceptionPage() {
  return (
    <>
      <ProductHero
        title="户外高精度3D感知方案"
        tagline="让机器看懂世界，亚毫米级精度"
        description="户外机器人高精度3D感知系统，包括适用于户外场景的高精度3D相机、机器人3D感知算法，为用户提供开箱即用的视觉解决方案。"
        icon={<Eye className="h-10 w-10 text-[var(--accent-glow)]" />}
      />

      <Section variant="light">
        <Container>
          <SectionHeading
            title="核心能力"
            subtitle="软硬件一体，从相机到算法的完整技术栈"
          />
          <FeatureGrid features={features} />
        </Container>
      </Section>

      <Section variant="gray">
        <Container>
          <SectionHeading
            title="技术规格"
            subtitle="专业级工业3D相机参数"
          />
          <SpecTable specs={specs} />
        </Container>
      </Section>

      <Section variant="light">
        <Container>
          <SectionHeading
            title="应用场景"
            subtitle="已在多个行业头部客户落地验证"
          />
          <ScenarioShowcase scenarios={scenarios} />
        </Container>
      </Section>

      <ProductCTA />
    </>
  );
}
