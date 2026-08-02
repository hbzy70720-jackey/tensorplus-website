"use client";

import { Check } from "lucide-react";
import ScrollReveal from "@/components/ui/scroll-reveal";
import ImageCarousel from "@/components/ui/image-carousel";

interface Scenario {
  name: string;
  description: string;
  points: string[];
  /** 图片文件名数组，如 ["scenario-1.jpg", "scenario-2.jpg"] */
  images?: string[];
  /** 图片所在 public/images/ 下的子目录 */
  imageFolder?: string;
}

interface ScenarioShowcaseProps {
  scenarios: Scenario[];
}

export default function ScenarioShowcase({ scenarios }: ScenarioShowcaseProps) {
  return (
    <div className="space-y-14">
      {scenarios.map((scenario, i) => (
        <ScrollReveal
          key={scenario.name}
          direction={i % 2 === 0 ? "left" : "right"}
        >
          <div
            className={`flex flex-col items-center gap-8 ${
              i % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
            }`}
          >
            {/* Image */}
            <div className="flex w-full shrink-0 items-center justify-center lg:w-1/2">
              <ImageCarousel
                images={scenario.images || []}
                folder={scenario.imageFolder || ""}
                alt={`${scenario.name} 应用场景`}
              />
            </div>

            {/* Text content */}
            <div className="w-full lg:w-1/2">
              <h3 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-[var(--text-dark)]">
                {scenario.name}
              </h3>
              <p className="mt-4 leading-relaxed text-[var(--text-muted)]">
                {scenario.description}
              </p>
              <ul className="mt-6 space-y-3">
                {scenario.points.map((point) => (
                  <li key={point} className="flex items-start gap-3">
                    <Check className="mt-0.5 h-5 w-5 shrink-0 text-[var(--accent)]" />
                    <span className="text-sm text-[var(--text-dark)]">
                      {point}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </ScrollReveal>
      ))}
    </div>
  );
}
