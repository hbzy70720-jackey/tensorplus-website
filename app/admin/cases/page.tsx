"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Plus, Search } from "lucide-react";
import CaseTable from "@/components/admin/case-table";

interface CaseItem {
  id: number;
  title: string;
  slug: string;
  customer: string | null;
  industry: string | null;
  published: boolean;
  createdAt: string;
}

export default function AdminCasesPage() {
  const [cases, setCases] = useState<CaseItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [industry, setIndustry] = useState("");
  const [published, setPublished] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchCases = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (industry) params.set("industry", industry);
    if (published) params.set("published", published);
    params.set("page", String(page));
    params.set("pageSize", "20");

    const res = await fetch(`/api/admin/cases?${params}`, { credentials: "include" });
    if (res.ok) {
      const data = await res.json();
      setCases(data.cases);
      setTotal(data.total);
      setTotalPages(data.totalPages);
    }
    setLoading(false);
  }, [search, industry, published, page]);

  useEffect(() => {
    fetchCases();
  }, [fetchCases]);

  useEffect(() => {
    setPage(1);
  }, [search, industry, published]);

  const handleDelete = async (id: number) => {
    const res = await fetch(`/api/admin/cases/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (res.ok) fetchCases();
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-[var(--text-dark)] sm:text-3xl">
            案例管理
          </h1>
          <p className="mt-1 text-sm text-[var(--text-muted)]">共 {total} 篇案例</p>
        </div>
        <Link
          href="/admin/cases/new"
          className="inline-flex items-center gap-2 rounded-lg bg-[var(--accent)] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          新建案例
        </Link>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="搜索标题或客户..."
            className="w-full rounded-lg border border-gray-300 py-2 pl-9 pr-4 text-sm focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
          />
        </div>

        <select
          value={industry}
          onChange={(e) => setIndustry(e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
        >
          <option value="">全部行业</option>
          <option value="光伏">光伏</option>
          <option value="林业">林业</option>
          <option value="石油">石油</option>
          <option value="电力">电力</option>
        </select>

        <select
          value={published}
          onChange={(e) => setPublished(e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
        >
          <option value="">全部状态</option>
          <option value="true">已发布</option>
          <option value="false">草稿</option>
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <div className="py-16 text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-[var(--accent)]" />
          <p className="mt-4 text-sm text-[var(--text-muted)]">加载中...</p>
        </div>
      ) : (
        <CaseTable
          cases={cases}
          selectedId={null}
          onSelect={() => {}}
          onDelete={handleDelete}
        />
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-2">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page <= 1}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm transition-colors hover:bg-gray-50 disabled:opacity-50"
          >
            上一页
          </button>
          <span className="px-4 text-sm text-[var(--text-muted)]">
            第 {page} / {totalPages} 页
          </span>
          <button
            onClick={() => setPage(Math.min(totalPages, page + 1))}
            disabled={page >= totalPages}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm transition-colors hover:bg-gray-50 disabled:opacity-50"
          >
            下一页
          </button>
        </div>
      )}
    </div>
  );
}
