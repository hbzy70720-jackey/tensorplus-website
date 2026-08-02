import type { Metadata } from "next";
import Link from "next/link";
import { FileText, BarChart3, ArrowRight } from "lucide-react";
import VisitsDashboard from "@/components/admin/visits-dashboard";

export const metadata: Metadata = {
  title: "访问记录 — 后台管理",
  robots: "noindex, nofollow",
};

export default function VisitsPage() {
  return (
    <>
      {/* 快速导航 */}
      <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-2">
          <Link
            href="/admin"
            className="flex items-center gap-4 rounded-xl border-2 border-transparent bg-white p-5 shadow-[var(--shadow-card)] transition-all hover:border-[var(--accent)] hover:shadow-md"
          >
            <div className="rounded-lg bg-[var(--accent)] p-3">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="font-[family-name:var(--font-heading)] text-lg font-bold text-[var(--text-dark)]">
                表单提交管理
              </h2>
              <p className="text-sm text-[var(--text-muted)]">
                查看和管理用户咨询、预约演示提交
              </p>
            </div>
            <ArrowRight className="h-5 w-5 text-[var(--text-muted)]" />
          </Link>

          <Link
            href="/admin/visits"
            className="flex items-center gap-4 rounded-xl border-2 border-emerald-500 bg-emerald-50/50 p-5 shadow-[var(--shadow-card)] transition-all hover:shadow-md"
          >
            <div className="rounded-lg bg-emerald-500 p-3">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="font-[family-name:var(--font-heading)] text-lg font-bold text-[var(--text-dark)]">
                访问记录统计
              </h2>
              <p className="text-sm text-[var(--text-muted)]">
                当前页面，查看网站访问数据
              </p>
            </div>
            <ArrowRight className="h-5 w-5 text-emerald-500" />
          </Link>
        </div>
      </div>
      <VisitsDashboard />
    </>
  );
}
