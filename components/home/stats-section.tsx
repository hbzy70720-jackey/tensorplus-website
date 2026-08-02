"use client";

import { useEffect, useRef, useState } from "react";
import ScrollReveal from "@/components/ui/scroll-reveal";

const stats = [
  { value: 0.1, unit: "mm", label: "3D成像精度", prefix: "<" },
  { value: 99.8, unit: "%", label: "识别准确率" },
  { value: 5, unit: "+", label: "落地行业" },
];

function AnimatedStat({
  target,
  unit,
  label,
  prefix = "",
}: {
  target: number;
  unit: string;
  label: string;
  prefix?: string;
}) {
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
    <div ref={ref} className="text-center">
      <div className="font-[family-name:var(--font-heading)] text-5xl font-bold tracking-tight text-[var(--accent)] sm:text-6xl">
        {prefix}
        {count.toFixed(target < 1 ? 1 : 0)}
        <span className="text-2xl text-[var(--text-muted)]">{unit}</span>
      </div>
      <div className="mt-2 text-sm font-medium uppercase tracking-wider text-[var(--text-muted)]">
        {label}
      </div>
    </div>
  );
}

export default function StatsSection() {
  return (
    <ScrollReveal>
      <div className="grid gap-8 sm:grid-cols-3">
        {stats.map((stat) => (
          <AnimatedStat
            key={stat.label}
            target={stat.value}
            unit={stat.unit}
            label={stat.label}
            prefix={stat.prefix}
          />
        ))}
      </div>
    </ScrollReveal>
  );
}
