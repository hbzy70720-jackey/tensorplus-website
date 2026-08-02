import { cn } from "@/lib/utils";

interface SectionProps {
  children: React.ReactNode;
  variant?: "dark" | "light" | "transition" | "gray";
  className?: string;
  id?: string;
}

export default function Section({
  children,
  variant = "light",
  className,
  id,
}: SectionProps) {
  return (
    <section
      id={id}
      className={cn(
        "section",
        variant === "dark" && "bg-[var(--bg-deep)] text-[var(--text-light)]",
        variant === "light" && "bg-[var(--bg-white)] text-[var(--text-dark)]",
        variant === "gray" && "bg-[var(--bg-light)] text-[var(--text-dark)]",
        variant === "transition" &&
          "bg-gradient-to-b from-[var(--bg-deep)] to-[var(--bg-dark)] text-[var(--text-light)]",
        className
      )}
    >
      {children}
    </section>
  );
}
