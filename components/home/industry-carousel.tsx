"use client";

import { Sun, Zap, TreePine, Droplets } from "lucide-react";
import ScrollReveal, { StaggerChild } from "@/components/ui/scroll-reveal";

const industries = [
  {
    icon: Sun,
    name: "光伏",
    descriptions: ["光伏组件自动化安装、自动化清洁维护"],
  },
  {
    icon: TreePine,
    name: "林业",
    descriptions: ["从种植到林业调查、采伐、测量的全流程智能化"],
  },
  {
    icon: Droplets,
    name: "石油",
    descriptions: ["石油钻井、石油管道安装与维护的智能化"],
  },
  {
    icon: Zap,
    name: "电力",
    descriptions: ["实现电力设备安装、维护的智能化"],
  },
];

export default function IndustryCarousel() {
  return (
    <ScrollReveal>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
            {industry.descriptions.map((line, i) => (
              <p key={i} className="text-xs leading-relaxed text-[var(--text-muted)]">
                {line}
              </p>
            ))}
          </div>
        ))}
      </div>
    </ScrollReveal>
  );
}
