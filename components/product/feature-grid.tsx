"use client";

import type { ReactNode } from "react";
import ScrollReveal, { StaggerChild } from "@/components/ui/scroll-reveal";

interface Feature {
  icon: ReactNode;
  title: string;
  description: string;
  highlight?: string;
}

interface FeatureGridProps {
  features: Feature[];
}

export default function FeatureGrid({ features }: FeatureGridProps) {
  return (
    <ScrollReveal stagger>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => (
          <StaggerChild key={feature.title}>
            <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-[var(--shadow-card)] transition-all duration-[var(--duration-normal)] hover:-translate-y-1 hover:shadow-[var(--shadow-card-hover)]">
              <div className="mb-5 inline-flex rounded-xl bg-blue-50 p-3">
                {feature.icon}
              </div>
              <h3 className="mb-3 font-[family-name:var(--font-heading)] text-xl font-bold text-[var(--text-dark)]">
                {feature.title}
              </h3>
              <p className="leading-relaxed text-[var(--text-muted)]">
                {feature.description}
              </p>
              {feature.highlight && (
                <p className="mt-3 text-sm font-semibold text-[var(--accent)]">
                  {feature.highlight}
                </p>
              )}
            </div>
          </StaggerChild>
        ))}
      </div>
    </ScrollReveal>
  );
}
