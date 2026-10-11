"use client";

import { Sun, Zap, TreePine, Droplets } from "lucide-react";
import ScrollReveal from "@/components/ui/scroll-reveal";
import { useDict } from "@/lib/i18n";

// 行业图标（与 t.home.industries 按索引对齐，图标不可翻译）
const industryIcons = [Sun, TreePine, Droplets, Zap];

export default function IndustryCarousel() {
  const t = useDict();

  return (
    <ScrollReveal>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {t.home.industries.map((industry, i) => {
          const Icon = industryIcons[i];
          return (
            <div
              key={industry.name}
              className="group rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-[var(--shadow-card)] transition-all duration-[var(--duration-normal)] hover:-translate-y-1 hover:shadow-[var(--shadow-card-hover)]"
            >
              <div className="mx-auto mb-4 inline-flex rounded-xl bg-blue-50 p-3 transition-colors group-hover:bg-blue-100">
                <Icon className="h-6 w-6 text-[var(--accent)]" />
              </div>
              <h4 className="mb-2 font-semibold text-[var(--text-dark)]">
                {industry.name}
              </h4>
              <p className="text-sm leading-relaxed text-[var(--text-muted)]">
                {industry.description}
              </p>
            </div>
          );
        })}
      </div>
    </ScrollReveal>
  );
}
