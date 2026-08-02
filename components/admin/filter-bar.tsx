"use client";

import { Search, Download, Filter } from "lucide-react";

interface FilterBarProps {
  search: string;
  status: string;
  source: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onSourceChange: (value: string) => void;
  onExport: () => void;
  exportLoading?: boolean;
}

export default function FilterBar({
  search,
  status,
  source,
  onSearchChange,
  onStatusChange,
  onSourceChange,
  onExport,
  exportLoading = false,
}: FilterBarProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      {/* 搜索 */}
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="搜索姓名、邮箱、公司..."
          className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 text-sm transition-colors focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
        />
      </div>

      {/* 状态筛选 */}
      <div className="relative">
        <Filter className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <select
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
          className="w-full appearance-none rounded-lg border border-gray-300 py-2.5 pl-10 pr-8 text-sm transition-colors focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)] sm:w-auto"
        >
          <option value="">全部状态</option>
          <option value="new">新提交</option>
          <option value="processing">处理中</option>
          <option value="replied">已回复</option>
        </select>
      </div>

      {/* 来源筛选 */}
      <select
        value={source}
        onChange={(e) => onSourceChange(e.target.value)}
        className="rounded-lg border border-gray-300 px-3 py-2.5 text-sm transition-colors focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)] sm:w-auto"
      >
        <option value="">全部来源</option>
        <option value="contact">联系我们</option>
        <option value="demo">预约演示</option>
      </select>

      {/* 导出 */}
      <button
        onClick={onExport}
        disabled={exportLoading}
        className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-[var(--text-dark)] transition-colors hover:bg-gray-50 disabled:opacity-50"
      >
        <Download className="h-4 w-4" />
        {exportLoading ? "导出中..." : "导出CSV"}
      </button>
    </div>
  );
}
