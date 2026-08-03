"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
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

function CaseListInner() {
  const searchParams = useSearchParams();
  const industry = searchParams.get("industry") || "";

  const [cases, setCases] = useState<CaseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchCases = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (industry) params.set("industry", industry);
      params.set("pageSize", "50");

      const res = await fetch(`/api/cases?${params}`);
      if (res.ok) {
        const data = await res.json();
        setCases(data.cases);
      } else {
        setError("加载失败");
      }
    } catch {
      setError("网络错误");
    } finally {
      setLoading(false);
    }
  }, [industry]);

  useEffect(() => {
    fetchCases();
  }, [fetchCases]);

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
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cases.map((c) => (
            <CaseCard key={c.id} {...c} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function CaseList() {
  return (
    <Suspense fallback={
      <div className="py-16 text-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-[var(--accent)]" />
      </div>
    }>
      <CaseListInner />
    </Suspense>
  );
}
