"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import CaseCard from "@/components/cases/case-card";
import IndustryFilter from "@/components/cases/industry-filter";
import { Suspense } from "react";

interface CaseItem {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  coverImage: string | null;
  industry: string | null;
  customer: string | null;
  deliveryDate: string | null;
  tags: string;
}

const PAGE_SIZE = 9;

function CaseListInner() {
  const searchParams = useSearchParams();
  const industry = searchParams.get("industry") || "";

  const [cases, setCases] = useState<CaseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchCases = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (industry) params.set("industry", industry);
      params.set("page", String(page));
      params.set("pageSize", String(PAGE_SIZE));

      const res = await fetch(`/api/cases?${params}`);
      if (res.ok) {
        const data = await res.json();
        setCases(data.cases);
        setTotal(data.total);
        setTotalPages(data.totalPages);
      }
    } catch {
      // 网络错误时同样显示占位内容
    } finally {
      setLoading(false);
    }
  }, [industry, page]);

  useEffect(() => {
    fetchCases();
  }, [fetchCases]);

  // 切换行业筛选时回到第一页
  useEffect(() => {
    setPage(1);
  }, [industry]);

  return (
    <div>
      {/* Filter */}
      <div className="mb-8">
        <IndustryFilter />
      </div>

      {/* Loading */}
      {loading && (
        <div className="py-16 text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-[var(--accent)]" />
          <p className="mt-4 text-sm text-[var(--text-muted)]">加载中...</p>
        </div>
      )}

      {/* Empty / Error — 统一显示友好提示 */}
      {!loading && cases.length === 0 && (
        <div className="py-16 text-center">
          <div className="mx-auto mb-4 inline-flex rounded-2xl bg-blue-500/10 p-4">
            <svg className="h-10 w-10 text-[var(--accent-glow)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m5.231 13.481L15 17.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v16.5c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9zm3.75 11.625a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
            </svg>
          </div>
          <p className="text-lg font-semibold text-[var(--text-muted)]">版块升级中</p>
          <p className="mt-2 text-sm text-gray-400">精彩案例即将上线，敬请期待</p>
        </div>
      )}

      {/* Grid */}
      {!loading && cases.length > 0 && (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {cases.map((c) => (
              <CaseCard key={c.id} {...c} />
            ))}
          </div>

          {/* Pagination — 仅超过9个案例时显示 */}
          {total > PAGE_SIZE && (
            <div className="mt-10 flex items-center justify-center gap-3">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-[var(--text-dark)] transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30"
              >
                <ChevronLeft className="h-4 w-4" />
                上一页
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`h-9 w-9 rounded-lg text-sm font-medium transition-colors ${
                      p === page
                        ? "bg-[var(--accent)] text-white"
                        : "text-[var(--text-muted)] hover:bg-gray-100 hover:text-[var(--text-dark)]"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-[var(--text-dark)] transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30"
              >
                下一页
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function CaseList() {
  return (
    <Suspense
      fallback={
        <div className="py-16 text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-[var(--accent)]" />
        </div>
      }
    >
      <CaseListInner />
    </Suspense>
  );
}
