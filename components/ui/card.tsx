import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  variant?: "glass" | "solid";
  hover?: boolean;
  className?: string;
  onClick?: () => void;
}

export default function Card({
  children,
  variant = "solid",
  hover = true,
  className,
  onClick,
}: CardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "rounded-[var(--radius-card)] p-6 sm:p-8",
        variant === "glass" && "glass",
        variant === "solid" &&
          "bg-white border border-gray-100 shadow-[var(--shadow-card)]",
        hover &&
          "transition-all duration-[var(--duration-normal)] var(--ease-out-expo) hover:-translate-y-1 hover:shadow-[var(--shadow-card-hover)]",
        onClick && "cursor-pointer",
        className
      )}
    >
      {children}
    </div>
  );
}
