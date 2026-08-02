"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, Trash2, Download, MapPin, Monitor, Clock } from "lucide-react";

interface VisitRecord {
  id: number;
  ip: string;
  path: string;
  referer: string | null;
  userAgent: string | null;
  country: string | null;
  province: string | null;
  city: string | null;
  duration: number;
  createdAt: string;
}

interface VisitsData {
  records: VisitRecord[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// 获取简单的设备类型
function getDevice(ua: string | null): string {
  if (!ua) return "-";
  if (/Mobile|Android|iPhone|iPad/i.test(ua)) return "📱 移动端";
  if (/Tablet/i.test(ua)) return "📱 平板";
  return "💻 PC";
}

// 获取浏览器
function getBrowser(ua: string | null): string {
  if (!ua) return "-";
  if (/Edg/i.test(ua)) return "Edge";
  if (/Chrome/i.test(ua)) return "Chrome";
  if (/Firefox/i.test(ua)) return "Firefox";
  if (/Safari/i.test(ua)) return "Safari";
  return "Other";
}

function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}秒`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}分${seconds % 60}秒`;
  return `${Math.floor(seconds / 3600)}时${Math.floor((seconds % 3600) / 60)}分`;
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleString("zh-CN", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export default function VisitsDashboard() {
  const [data, setData] = useState<VisitsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [province, setProvince] = useState("");
  const [country, setCountry] = useState("");
  const [path, setPath] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [ip, setIp] = useState("");

  // 删除
  const [deleteBefore, setDeleteBefore] = useState("");
  const [deleting, setDeleting] = useState(false);

  const fetchVisits = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (province) params.set("province", province);
    if (country) params.set("country", country);
    if (path) params.set("path", path);
    if (startDate) params.set("startDate", startDate);
    if (endDate) params.set("endDate", endDate);
    if (ip) params.set("ip", ip);
    params.set("page", String(page));
    params.set("pageSize", "50");

    const res = await fetch(`/api/admin/visits?${params}`, {
      credentials: "include",
    });
    if (res.ok) {
      setData(await res.json());
    }
    setLoading(false);
  }, [province, country, path, startDate, endDate, ip, page]);

  useEffect(() => {
    fetchVisits();
  }, [fetchVisits]);

  // 筛选变化回到第一页
  useEffect(() => {
    setPage(1);
  }, [province, country, path, startDate, endDate, ip]);

  const handleDelete = async () => {
    if (!deleteBefore) return;
    if (
      !window.confirm(
        `确定删除 ${deleteBefore} 之前的所有访问记录吗？此操作不可撤销。`
      )
    )
      return;

    setDeleting(true);
    try {
      const res = await fetch("/api/admin/visits", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ before: deleteBefore }),
      });
      if (res.ok) {
        const result = await res.json();
        alert(`已删除 ${result.deleted} 条记录`);
        setDeleteBefore("");
        fetchVisits();
      }
    } catch {
      // 静默处理
    } finally {
      setDeleting(false);
    }
  };

  // 导出 CSV
  const handleExportCSV = () => {
    if (!data?.records.length) return;
    const header = "IP,地区,页面,设备,浏览器,来源,停留时长,访问时间\n";
    const rows = data.records
      .map((r) => {
        const location = [r.country, r.province, r.city]
          .filter(Boolean)
          .join("/") || "-";
        return [
          r.ip,
          `"${location}"`,
          r.path,
          getDevice(r.userAgent),
          getBrowser(r.userAgent),
          `"${(r.referer || "").replace(/"/g, '""')}"`,
          formatDuration(r.duration),
          r.createdAt,
        ].join(",");
      })
      .join("\n");

    const csv = "﻿" + header + rows;
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `visits-export-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const location = (r: VisitRecord) => {
    const parts = [r.country, r.province, r.city].filter(Boolean);
    return parts.length ? parts.join(" ") : "未知";
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-[var(--text-dark)] sm:text-3xl">
            访问记录
          </h1>
          <p className="mt-1 text-sm text-[var(--text-muted)]">
            共 {data?.total ?? 0} 条记录
          </p>
        </div>
        <button
          onClick={handleExportCSV}
          disabled={!data?.records.length}
          className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm transition-colors hover:bg-gray-50 disabled:opacity-50"
        >
          <Download className="h-4 w-4" />
          导出CSV
        </button>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap items-end gap-3">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-xs text-[var(--text-muted)] mb-1">
            搜索IP
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              value={ip}
              onChange={(e) => setIp(e.target.value)}
              placeholder="IP地址..."
              className="w-full rounded-lg border border-gray-300 py-2 pl-9 pr-3 text-sm transition-colors focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
            />
          </div>
        </div>
        <div>
          <label className="block text-xs text-[var(--text-muted)] mb-1">
            地区
          </label>
          <input
            value={province}
            onChange={(e) => setProvince(e.target.value)}
            placeholder="省份..."
            className="w-28 rounded-lg border border-gray-300 py-2 px-3 text-sm focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
          />
        </div>
        <div>
          <label className="block text-xs text-[var(--text-muted)] mb-1">
            页面
          </label>
          <input
            value={path}
            onChange={(e) => setPath(e.target.value)}
            placeholder="路径..."
            className="w-32 rounded-lg border border-gray-300 py-2 px-3 text-sm focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
          />
        </div>
        <div>
          <label className="block text-xs text-[var(--text-muted)] mb-1">
            开始日期
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-36 rounded-lg border border-gray-300 py-2 px-3 text-sm focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
          />
        </div>
        <div>
          <label className="block text-xs text-[var(--text-muted)] mb-1">
            结束日期
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-36 rounded-lg border border-gray-300 py-2 px-3 text-sm focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
          />
        </div>
        <button
          onClick={() => {
            setIp("");
            setProvince("");
            setPath("");
            setStartDate("");
            setEndDate("");
            setCountry("");
          }}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm transition-colors hover:bg-gray-50"
        >
          重置
        </button>
      </div>

      {/* Delete Old Records */}
      <div className="mb-6 flex items-end gap-3 rounded-lg border border-red-100 bg-red-50 p-4">
        <div>
          <label className="block text-xs text-red-600 mb-1">
            清理历史记录（删除指定日期之前的所有记录）
          </label>
          <input
            type="date"
            value={deleteBefore}
            onChange={(e) => setDeleteBefore(e.target.value)}
            className="w-40 rounded-lg border border-red-300 py-2 px-3 text-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
          />
        </div>
        <button
          onClick={handleDelete}
          disabled={!deleteBefore || deleting}
          className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-50"
        >
          <Trash2 className="h-4 w-4" />
          {deleting ? "删除中..." : "删除旧记录"}
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <div className="py-16 text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-[var(--accent)]" />
          <p className="mt-4 text-sm text-[var(--text-muted)]">加载中...</p>
        </div>
      ) : !data?.records.length ? (
        <div className="py-16 text-center">
          <p className="text-[var(--text-muted)]">暂无访问记录</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                  IP地址
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                  地区
                </th>
                <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] sm:table-cell">
                  页面
                </th>
                <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] lg:table-cell">
                  设备
                </th>
                <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] xl:table-cell">
                  浏览器
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                  停留
                </th>
                <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] md:table-cell">
                  时间
                </th>
              </tr>
            </thead>
            <tbody>
              {data.records.map((r) => (
                <tr
                  key={r.id}
                  className="border-b border-gray-50 transition-colors hover:bg-gray-50/50"
                >
                  <td className="px-4 py-3">
                    <code className="rounded bg-gray-100 px-1.5 py-0.5 text-xs font-mono text-[var(--text-dark)]">
                      {r.ip}
                    </code>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1 text-sm text-[var(--text-dark)]">
                      <MapPin className="h-3 w-3 text-[var(--text-muted)]" />
                      {location(r)}
                    </span>
                  </td>
                  <td className="hidden px-4 py-3 text-sm text-[var(--text-muted)] sm:table-cell">
                    {r.path}
                  </td>
                  <td className="hidden px-4 py-3 text-sm text-[var(--text-muted)] lg:table-cell">
                    <span className="inline-flex items-center gap-1">
                      <Monitor className="h-3 w-3" />
                      {getDevice(r.userAgent)}
                    </span>
                  </td>
                  <td className="hidden px-4 py-3 text-sm text-[var(--text-muted)] xl:table-cell">
                    {getBrowser(r.userAgent)}
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1 text-sm text-[var(--text-muted)]">
                      <Clock className="h-3 w-3" />
                      {formatDuration(r.duration)}
                    </span>
                  </td>
                  <td className="hidden whitespace-nowrap px-4 py-3 text-sm text-[var(--text-muted)] md:table-cell">
                    {formatTime(r.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {data && data.totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-2">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page <= 1}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm transition-colors hover:bg-gray-50 disabled:opacity-50"
          >
            上一页
          </button>
          <span className="px-4 text-sm text-[var(--text-muted)]">
            第 {page} / {data.totalPages} 页
          </span>
          <button
            onClick={() => setPage(Math.min(data.totalPages, page + 1))}
            disabled={page >= data.totalPages}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm transition-colors hover:bg-gray-50 disabled:opacity-50"
          >
            下一页
          </button>
        </div>
      )}
    </div>
  );
}
