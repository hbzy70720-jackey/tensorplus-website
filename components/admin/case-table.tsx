"use client";

import { Pencil, Trash2, Eye } from "lucide-react";
import Link from "next/link";

interface CaseItem {
  id: number;
  title: string;
  slug: string;
  customer: string | null;
  industry: string | null;
  published: boolean;
  createdAt: string;
}

interface CaseTableProps {
  cases: CaseItem[];
  selectedId: number | null;
  onSelect: (id: number) => void;
  onDelete: (id: number) => void;
}

export default function CaseTable({ cases: caseList, selectedId, onSelect, onDelete }: CaseTableProps) {
  if (caseList.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="text-[var(--text-muted)]">暂无案例</p>
        <Link
          href="/admin/cases/new"
          className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          创建第一个案例
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-gray-200 bg-gray-50">
          <tr>
            <th className="px-4 py-3 font-medium text-[var(--text-muted)]">标题</th>
            <th className="px-4 py-3 font-medium text-[var(--text-muted)] hidden sm:table-cell">客户</th>
            <th className="px-4 py-3 font-medium text-[var(--text-muted)] hidden md:table-cell">行业</th>
            <th className="px-4 py-3 font-medium text-[var(--text-muted)]">状态</th>
            <th className="px-4 py-3 font-medium text-[var(--text-muted)] hidden lg:table-cell">创建时间</th>
            <th className="px-4 py-3 text-right font-medium text-[var(--text-muted)]">操作</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {caseList.map((c) => (
            <tr
              key={c.id}
              onClick={() => onSelect(c.id)}
              className={`cursor-pointer transition-colors hover:bg-gray-50 ${
                selectedId === c.id ? "bg-blue-50" : ""
              }`}
            >
              <td className="px-4 py-3 font-medium text-[var(--text-dark)] max-w-[200px] truncate">
                {c.title}
              </td>
              <td className="px-4 py-3 text-[var(--text-muted)] hidden sm:table-cell">
                {c.customer || "-"}
              </td>
              <td className="px-4 py-3 hidden md:table-cell">
                {c.industry ? (
                  <span className="inline-block rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-[var(--accent)]">
                    {c.industry}
                  </span>
                ) : (
                  <span className="text-[var(--text-muted)]">-</span>
                )}
              </td>
              <td className="px-4 py-3">
                <span
                  className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    c.published
                      ? "bg-green-50 text-green-600"
                      : "bg-yellow-50 text-yellow-600"
                  }`}
                >
                  {c.published ? "已发布" : "草稿"}
                </span>
              </td>
              <td className="px-4 py-3 text-[var(--text-muted)] hidden lg:table-cell">
                {new Date(c.createdAt).toLocaleDateString("zh-CN")}
              </td>
              <td className="px-4 py-3 text-right">
                <div className="flex items-center justify-end gap-1">
                  {c.published && (
                    <Link
                      href={`/cases/${c.slug}`}
                      target="_blank"
                      onClick={(e) => e.stopPropagation()}
                      className="rounded p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                      title="查看前台"
                    >
                      <Eye className="h-4 w-4" />
                    </Link>
                  )}
                  <Link
                    href={`/admin/cases/${c.id}/edit`}
                    onClick={(e) => e.stopPropagation()}
                    className="rounded p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-[var(--accent)]"
                    title="编辑"
                  >
                    <Pencil className="h-4 w-4" />
                  </Link>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm("确定删除这个案例吗？")) onDelete(c.id);
                    }}
                    className="rounded p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500"
                    title="删除"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
