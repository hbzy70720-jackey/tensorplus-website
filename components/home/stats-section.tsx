"use client";

import { useEffect, useRef, useState } from "react";
import ScrollReveal from "@/components/ui/scroll-reveal";

interface StatItem {
  /** 大字展示内容 */
  display: string;
  /** 下方说明文字 */
  label: string;
  /** 是否数字动画（仅对纯数字 display 生效） */
  animate?: boolean;
  /** 动画目标值 */
  target?: number;
  /** 小数位数 */
  decimals?: number;
}

const stats: StatItem[] = [
  { display: "<0.1mm, 0.05°", label: "3D感知精度" },
  { display: "99.999%", label: "动作执行成功率", animate: true, target: 99.999, decimals: 3 },
  { display: "户外场景可用", label: "不受强阳光、逆光等极端条件干扰" },
];

function AnimatedStat({ target, decimals = 1 }: { target: number; decimals: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const duration = 1500;
          const start = performance.now();

          const animate = (now: number) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(target * eased);

            if (progress < 1) {
              requestAnimationFrame(animate);
            }
          };

          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [target]);

  return (
    <span ref={ref}>
      {count.toFixed(decimals)}
    </span>
  );
}

function StatCard({ stat }: { stat: StatItem }) {
  const isNumeric = stat.animate && stat.target !== undefined;

  return (
    <div className="text-center">
      <div className="font-[family-name:var(--font-heading)] text-5xl font-bold tracking-tight text-[var(--accent)] sm:text-6xl">
        {isNumeric ? (
          <>
            <AnimatedStat target={stat.target!} decimals={stat.decimals ?? 1} />
            <span className="text-2xl text-[var(--text-muted)]">%</span>
          </>
        ) : (
          stat.display
        )}
      </div>
      <div className="mt-2 text-sm font-medium text-[var(--text-muted)]">
        {stat.label}
      </div>
    </div>
  );
}

export default function StatsSection() {
  return (
    <ScrollReveal>
      <div className="grid gap-8 sm:grid-cols-3">
        {stats.map((stat) => (
          <StatCard key={stat.label} stat={stat} />
        ))}
      </div>
    </ScrollReveal>
  );
}
