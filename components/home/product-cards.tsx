"use client";

import Link from "next/link";
import { Camera, Bot, ArrowRight } from "lucide-react";
import ScrollReveal, { StaggerChild } from "@/components/ui/scroll-reveal";
import { useDict, useLocale } from "@/lib/i18n";
import { localizedHref } from "@/lib/locale-link";

export default function ProductCards() {
  const t = useDict();
  const lang = useLocale();

  return (
    <ScrollReveal stagger>
      <div className="grid gap-6 sm:grid-cols-2">
        <StaggerChild>
          <Link
            href={localizedHref("/3d-perception", lang)}
            className="group glass glow-border block rounded-[var(--radius-card)] p-6 transition-all duration-[var(--duration-normal)] hover:-translate-y-1 sm:p-8"
          >
            <div className="mb-6 inline-flex rounded-xl bg-blue-500/10 p-4">
              <Camera className="h-8 w-8 text-[var(--accent-glow)]" />
            </div>
            <h3 className="mb-3 font-[family-name:var(--font-heading)] text-2xl font-bold text-white">
              {t.home.card1Title}
            </h3>
            <p className="mb-6 leading-relaxed text-gray-400">
              {t.home.card1Desc}
            </p>
            <span className="inline-flex items-center gap-2 text-sm font-medium text-[var(--accent-glow)] transition-colors group-hover:text-white">
              {t.home.learnMore}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
          </Link>
        </StaggerChild>

        <StaggerChild>
          <Link
            href={localizedHref("/robot", lang)}
            className="group glass glow-border block rounded-[var(--radius-card)] p-6 transition-all duration-[var(--duration-normal)] hover:-translate-y-1 sm:p-8"
          >
            <div className="mb-6 inline-flex rounded-xl bg-emerald-500/10 p-4">
              <Bot className="h-8 w-8 text-emerald-400" />
            </div>
            <h3 className="mb-3 font-[family-name:var(--font-heading)] text-2xl font-bold text-white">
              {t.home.card2Title}
            </h3>
            <p className="mb-6 leading-relaxed text-gray-400">
              {t.home.card2Desc}
            </p>
            <span className="inline-flex items-center gap-2 text-sm font-medium text-emerald-400 transition-colors group-hover:text-white">
              {t.home.learnMore}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
          </Link>
        </StaggerChild>
      </div>
    </ScrollReveal>
  );
}
