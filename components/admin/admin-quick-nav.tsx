import Link from "next/link";
import { FileText, FolderOpen, BarChart3, ArrowRight } from "lucide-react";

type ActivePage = "submissions" | "cases" | "visits";

interface AdminQuickNavProps {
  active: ActivePage;
}

const links = [
  {
    key: "submissions" as const,
    href: "/admin",
    label: "表单提交管理",
    desc: "查看和管理用户咨询、预约演示提交",
    icon: FileText,
    color: "bg-[var(--accent)]",
    activeClass: "border-[var(--accent)] bg-blue-50/50",
    arrowClass: "text-[var(--accent)]",
  },
  {
    key: "cases" as const,
    href: "/admin/cases",
    label: "案例管理",
    desc: "发布和管理客户交付案例",
    icon: FolderOpen,
    color: "bg-violet-500",
    activeClass: "border-violet-500 bg-violet-50/50",
    arrowClass: "text-violet-500",
  },
  {
    key: "visits" as const,
    href: "/admin/visits",
    label: "访问记录统计",
    desc: "查看网站访问者IP、地区、停留时长等数据",
    icon: BarChart3,
    color: "bg-emerald-500",
    activeClass: "border-emerald-500 bg-emerald-50/50",
    arrowClass: "text-emerald-500",
  },
];

export default function AdminQuickNav({ active }: AdminQuickNavProps) {
  return (
    <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
      <div className="grid gap-4 sm:grid-cols-3">
        {links.map(({ key, href, label, desc, icon: Icon, color, activeClass, arrowClass }) => {
          const isActive = key === active;
          return (
            <Link
              key={key}
              href={href}
              className={`flex items-center gap-4 rounded-xl border-2 p-5 transition-all hover:shadow-md ${
                isActive
                  ? activeClass + " shadow-[var(--shadow-card)]"
                  : "border-transparent bg-white shadow-[var(--shadow-card)] hover:border-[var(--accent)]"
              }`}
            >
              <div className={`rounded-lg p-3 ${color}`}>
                <Icon className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="font-[family-name:var(--font-heading)] text-lg font-bold text-[var(--text-dark)] truncate">
                  {label}
                </h2>
                <p className="text-sm text-[var(--text-muted)] line-clamp-2">{desc}</p>
              </div>
              <ArrowRight
                className={`h-5 w-5 shrink-0 ${
                  isActive ? arrowClass : "text-[var(--text-muted)]"
                }`}
              />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
