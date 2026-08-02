"use client";

import { ChevronDown, Mail, Trash2 } from "lucide-react";
import StatusBadge from "@/components/admin/status-badge";
import { cn } from "@/lib/utils";

interface Submission {
  id: number;
  name: string;
  email: string;
  company: string | null;
  phone: string | null;
  message: string;
  source: string;
  status: string;
  notes: string | null;
  createdAt: string;
}

interface SubmissionTableProps {
  submissions: Submission[];
  selectedId: number | null;
  onSelect: (id: number) => void;
  onStatusChange: (id: number, status: string) => void;
  onDelete: (id: number) => void;
}

const sourceLabel: Record<string, string> = {
  contact: "联系我们",
  demo: "预约演示",
};

const nextStatus: Record<string, string> = {
  new: "processing",
  processing: "replied",
  replied: "new",
};

export default function SubmissionTable({
  submissions,
  selectedId,
  onSelect,
  onStatusChange,
  onDelete,
}: SubmissionTableProps) {
  if (submissions.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="text-[var(--text-muted)]">暂无提交数据</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-100 bg-gray-50/50">
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
              姓名
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
              邮箱
            </th>
            <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] md:table-cell">
              电话
            </th>
            <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] md:table-cell">
              公司
            </th>
            <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] sm:table-cell">
              来源
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
              状态
            </th>
            <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] lg:table-cell">
              时间
            </th>
            <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
              操作
            </th>
          </tr>
        </thead>
        <tbody>
          {submissions.map((s) => (
            <tr
              key={s.id}
              onClick={() => onSelect(s.id)}
              className={cn(
                "cursor-pointer border-b border-gray-50 transition-colors hover:bg-gray-50/50",
                selectedId === s.id && "bg-blue-50/30"
              )}
            >
              <td className="px-4 py-3 text-sm font-medium text-[var(--text-dark)]">
                {s.name}
              </td>
              <td className="px-4 py-3">
                {s.email ? (
                  <a
                    href={`mailto:${s.email}`}
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-1 text-sm text-[var(--accent)] hover:underline"
                  >
                    <Mail className="h-3 w-3" />
                    {s.email}
                  </a>
                ) : (
                  <span className="text-sm text-[var(--text-muted)]">-</span>
                )}
              </td>
              <td className="hidden px-4 py-3 text-sm text-[var(--text-muted)] md:table-cell">
                {s.phone || "-"}
              </td>
              <td className="hidden px-4 py-3 text-sm text-[var(--text-muted)] md:table-cell">
                {s.company || "-"}
              </td>
              <td className="hidden px-4 py-3 sm:table-cell">
                <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-[var(--text-muted)]">
                  {sourceLabel[s.source] || s.source}
                </span>
              </td>
              <td className="px-4 py-3">
                <StatusBadge status={s.status as "new" | "processing" | "replied"} />
              </td>
              <td className="hidden whitespace-nowrap px-4 py-3 text-sm text-[var(--text-muted)] lg:table-cell">
                {new Date(s.createdAt).toLocaleDateString("zh-CN", {
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </td>
              <td className="px-4 py-3 text-right">
                <div className="flex items-center justify-end gap-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onStatusChange(s.id, nextStatus[s.status]);
                    }}
                    className="rounded px-2 py-1 text-xs text-[var(--accent)] transition-colors hover:bg-blue-50"
                  >
                    → {s.status === "new" ? "处理中" : s.status === "processing" ? "已回复" : "还原"}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm("确定删除该提交？")) {
                        onDelete(s.id);
                      }
                    }}
                    className="rounded px-1.5 py-1 text-xs text-red-400 transition-colors hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                  <ChevronDown
                    className={cn(
                      "ml-1 h-4 w-4 text-gray-300 transition-transform",
                      selectedId === s.id && "rotate-180"
                    )}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
