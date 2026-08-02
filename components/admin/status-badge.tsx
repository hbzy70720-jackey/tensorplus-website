import { cn } from "@/lib/utils";

const config = {
  new: { label: "新提交", bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-500" },
  processing: { label: "处理中", bg: "bg-yellow-50", text: "text-yellow-700", dot: "bg-yellow-500" },
  replied: { label: "已回复", bg: "bg-green-50", text: "text-green-700", dot: "bg-green-500" },
};

interface StatusBadgeProps {
  status: "new" | "processing" | "replied";
  className?: string;
}

export default function StatusBadge({ status, className }: StatusBadgeProps) {
  const c = config[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
        c.bg,
        c.text,
        className
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", c.dot)} />
      {c.label}
    </span>
  );
}
