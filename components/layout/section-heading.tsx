import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
  light?: boolean;
  className?: string;
}

export default function SectionHeading({
  title,
  subtitle,
  centered = true,
  light = false,
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "mb-10 max-w-3xl",
        centered && "mx-auto text-center",
        className
      )}
    >
      <h2
        className={cn(
          "font-[family-name:var(--font-heading)] text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl",
          light ? "text-[var(--text-light)]" : "text-[var(--text-dark)]"
        )}
      >
        {title}
      </h2>
      <div
        className={cn(
          "mx-auto mt-4 h-1 w-20 rounded-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent-glow)]",
          centered && "mx-auto"
        )}
      />
      {subtitle && (
        <p
          className={cn(
            "mt-4 text-lg leading-relaxed",
            light ? "text-[var(--text-muted)]" : "text-[var(--text-muted)]"
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
