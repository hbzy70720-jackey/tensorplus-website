"use client";

import { useState, useEffect, useCallback } from "react";
import FilterBar from "@/components/admin/filter-bar";
import SubmissionTable from "@/components/admin/submission-table";
import DetailPanel from "@/components/admin/detail-panel";

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

export function AdminDashboard() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [source, setSource] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [exportLoading, setExportLoading] = useState(false);

  const fetchSubmissions = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (status) params.set("status", status);
    if (source) params.set("source", source);
    params.set("page", String(page));
    params.set("pageSize", "20");

    const res = await fetch(`/api/admin/submissions?${params}`, {
      credentials: "include",
    });
    if (res.ok) {
      const data = await res.json();
      setSubmissions(data.submissions);
      setTotal(data.total);
      setTotalPages(data.totalPages);
    }
    setLoading(false);
  }, [search, status, source, page]);

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  // 搜索/筛选变化时回到第一页
  useEffect(() => {
    setPage(1);
  }, [search, status, source]);

  const handleStatusChange = async (id: number, newStatus: string) => {
    const res = await fetch(`/api/admin/submissions/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ status: newStatus }),
    });
    if (res.ok) fetchSubmissions();
  };

  const handleDelete = async (id: number) => {
    const res = await fetch(`/api/admin/submissions/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (res.ok) {
      if (selectedId === id) setSelectedId(null);
      fetchSubmissions();
    }
  };

  const handleSaveNotes = async (id: number, notes: string) => {
    const res = await fetch(`/api/admin/submissions/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ notes }),
    });
    if (res.ok) fetchSubmissions();
  };

  const handleExport = async () => {
    setExportLoading(true);
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (status) params.set("status", status);
    if (source) params.set("source", source);

    const res = await fetch(`/api/admin/submissions/export?${params}`, {
      credentials: "include",
    });
    if (res.ok) {
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download =
        res.headers
          .get("Content-Disposition")
          ?.match(/filename="(.+)"/)?.[1] || "export.csv";
      a.click();
      URL.revokeObjectURL(url);
    }
    setExportLoading(false);
  };

  const selectedSubmission =
    submissions.find((s) => s.id === selectedId) || null;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-[var(--text-dark)] sm:text-3xl">
          表单提交管理
        </h1>
        <p className="mt-1 text-sm text-[var(--text-muted)]">
          共 {total} 条提交记录
        </p>
      </div>

      {/* Filter */}
      <div className="mb-6">
        <FilterBar
          search={search}
          status={status}
          source={source}
          onSearchChange={setSearch}
          onStatusChange={setStatus}
          onSourceChange={setSource}
          onExport={handleExport}
          exportLoading={exportLoading}
        />
      </div>

      {/* Table */}
      {loading ? (
        <div className="py-16 text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-[var(--accent)]" />
          <p className="mt-4 text-sm text-[var(--text-muted)]">加载中...</p>
        </div>
      ) : (
        <SubmissionTable
          submissions={submissions}
          selectedId={selectedId}
          onSelect={(id) => setSelectedId(id === selectedId ? null : id)}
          onStatusChange={handleStatusChange}
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

      {/* Detail Panel */}
      {selectedSubmission && (
        <div className="mt-6">
          <DetailPanel
            submission={selectedSubmission}
            onSaveNotes={handleSaveNotes}
            onClose={() => setSelectedId(null)}
          />
        </div>
      )}
    </div>
  );
}
