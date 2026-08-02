"use client";

import type { ReactNode } from "react";
import ScrollReveal from "@/components/ui/scroll-reveal";
import ImageCarousel from "@/components/ui/image-carousel";

interface TechSubItem {
  icon: ReactNode;
  title: string;
  description: string;
}

interface TechHighlight {
  title: string;
  description: string;
  highlight?: string;
  subItems: TechSubItem[];
  /** 图片文件名数组，如 ["perception-1.jpg", "perception-2.jpg"] */
  images?: string[];
  /** 图片所在 public/images/ 下的子目录 */
  imageFolder?: string;
}

interface TechHighlightsProps {
  items: TechHighlight[];
}

export default function TechHighlights({ items }: TechHighlightsProps) {
  return (
    <div className="space-y-20">
      {items.map((item, i) => (
        <ScrollReveal
          key={item.title}
          direction={i % 2 === 0 ? "left" : "right"}
        >
          <div
            className={`flex flex-col items-center gap-10 ${
              i % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
            }`}
          >
            {/* 图片区 */}
            <div className="flex w-full shrink-0 items-center justify-center lg:w-1/2">
              <ImageCarousel
                images={item.images || []}
                folder={item.imageFolder || ""}
                alt={`${item.title} 技术亮点`}
              />
            </div>

            {/* 文字内容 */}
            <div className="w-full lg:w-1/2">
              <h3 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-[var(--text-dark)]">
                {item.title}
              </h3>
              <p className="mt-4 leading-relaxed text-[var(--text-muted)]">
                {item.description}
              </p>
              {item.highlight && (
                <p className="mt-3 text-sm font-semibold text-[var(--accent)]">
                  {item.highlight}
                </p>
              )}

              {/* 子项：图标 + 标题 + 说明 */}
              <div className="mt-6 space-y-4">
                {item.subItems.map((sub) => (
                  <div key={sub.title} className="flex items-start gap-4">
                    <div className="mt-0.5 inline-flex shrink-0 rounded-lg bg-blue-50 p-2 text-[var(--accent)]">
                      {sub.icon}
                    </div>
                    <div>
                      <h4 className="font-semibold text-[var(--text-dark)]">
                        {sub.title}
                      </h4>
                      <p className="mt-1 text-sm leading-relaxed text-[var(--text-muted)]">
                        {sub.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ScrollReveal>
      ))}
    </div>
  );
}
