"use client";

import Link from "next/link";
import { Camera, Bot, ArrowRight } from "lucide-react";
import ScrollReveal, { StaggerChild } from "@/components/ui/scroll-reveal";

export default function ProductCards() {
  return (
    <ScrollReveal stagger>
      <div className="grid gap-6 sm:grid-cols-2">
        <StaggerChild>
          <Link
            href="/3d-perception"
            className="group glass glow-border block rounded-[var(--radius-card)] p-6 transition-all duration-[var(--duration-normal)] hover:-translate-y-1 sm:p-8"
          >
            <div className="mb-6 inline-flex rounded-xl bg-blue-500/10 p-4">
              <Camera className="h-8 w-8 text-[var(--accent-glow)]" />
            </div>
            <h3 className="mb-3 font-[family-name:var(--font-heading)] text-2xl font-bold text-white">
              高精度3D感知方案
            </h3>
            <p className="mb-6 leading-relaxed text-gray-400">
              行业领先的户外高精度3D相机+物体识别算法，亚毫米级精度，抗强光、阴影干扰，已在光伏、林业、电力等行业智能化场景中得到大量成功应用。
            </p>
            <span className="inline-flex items-center gap-2 text-sm font-medium text-[var(--accent-glow)] transition-colors group-hover:text-white">
              了解更多
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
          </Link>
        </StaggerChild>

        <StaggerChild>
          <Link
            href="/robot"
            className="group glass glow-border block rounded-[var(--radius-card)] p-6 transition-all duration-[var(--duration-normal)] hover:-translate-y-1 sm:p-8"
          >
            <div className="mb-6 inline-flex rounded-xl bg-emerald-500/10 p-4">
              <Bot className="h-8 w-8 text-emerald-400" />
            </div>
            <h3 className="mb-3 font-[family-name:var(--font-heading)] text-2xl font-bold text-white">
              户外作业机器人
            </h3>
            <p className="mb-6 leading-relaxed text-gray-400">
              自主导航（SLAM + 路径规划 + 避障）+ 自主执行，可在野外复杂地形实现完全自动行走和精确操作。
            </p>
            <span className="inline-flex items-center gap-2 text-sm font-medium text-emerald-400 transition-colors group-hover:text-white">
              了解更多
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
          </Link>
        </StaggerChild>
      </div>
    </ScrollReveal>
  );
}
