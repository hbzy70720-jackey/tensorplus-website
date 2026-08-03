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
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchCases = useCallback(async () => {
    setLoading(true);
    setError("");
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
      } else {
        setError("加载失败");
      }
    } catch {
      setError("网络错误");
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

      {/* Error */}
      {error && (
        <div className="py-16 text-center">
          <p className="text-red-500">{error}</p>
        </div>
      )}

      {/* Empty */}
      {!loading && !error && cases.length === 0 && (
        <div className="py-16 text-center">
          <p className="text-lg text-[var(--text-muted)]">暂无案例</p>
          <p className="mt-2 text-sm text-gray-400">敬请期待更多客户案例</p>
        </div>
      )}

      {/* Grid */}
      {!loading && !error && cases.length > 0 && (
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
