"use client";

import { Sun, Zap, TreePine, Droplets, Wheat } from "lucide-react";
import ScrollReveal, { StaggerChild } from "@/components/ui/scroll-reveal";

const industries = [
  {
    icon: Sun,
    name: "光伏",
    desc: "光伏组件姿态估计，支架识别定位，自动化安装与检测",
  },
  {
    icon: TreePine,
    name: "林业",
    desc: "原木姿态估计，木材分级分拣，森林资源普查",
  },
  {
    icon: Wheat,
    name: "农业",
    desc: "自主导航耕作，作物识别，精准喷洒与收割",
  },
  {
    icon: Droplets,
    name: "石油",
    desc: "管线巡检，储罐检测，钻井平台自动化作业",
  },
  {
    icon: Zap,
    name: "电力",
    desc: "变电站巡检，输电线路检测，设备热成像分析",
  },
];

export default function IndustryCarousel() {
  return (
    <ScrollReveal>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {industries.map((industry) => (
          <div
            key={industry.name}
            className="group rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-[var(--shadow-card)] transition-all duration-[var(--duration-normal)] hover:-translate-y-1 hover:shadow-[var(--shadow-card-hover)]"
          >
            <div className="mx-auto mb-4 inline-flex rounded-xl bg-blue-50 p-3 transition-colors group-hover:bg-blue-100">
              <industry.icon className="h-6 w-6 text-[var(--accent)]" />
            </div>
            <h4 className="mb-2 font-semibold text-[var(--text-dark)]">
              {industry.name}
            </h4>
            <p className="text-xs leading-relaxed text-[var(--text-muted)]">
              {industry.desc}
            </p>
          </div>
        ))}
      </div>
    </ScrollReveal>
  );
}
