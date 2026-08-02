import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "后台管理 — TensorPlus",
  robots: "noindex, nofollow",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[var(--bg-light)]">
      {/* Top Bar */}
      <header className="sticky top-0 z-40 border-b border-gray-200 bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link
            href="/admin"
            className="font-[family-name:var(--font-heading)] text-lg font-bold"
          >
            <span className="gradient-text">Tensor</span>Plus{" "}
            <span className="text-[var(--text-muted)]">· 后台</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="text-sm text-[var(--text-muted)] transition-colors hover:text-[var(--text-dark)]"
            >
              表单管理
            </Link>
            <Link
              href="/admin/visits"
              className="text-sm text-[var(--text-muted)] transition-colors hover:text-[var(--text-dark)]"
            >
              访问记录
            </Link>
            <Link
              href="/"
              target="_blank"
              className="text-sm text-[var(--text-muted)] transition-colors hover:text-[var(--text-dark)]"
            >
              查看官网 ↗
            </Link>
            <form action="/api/admin/logout" method="POST">
              <button
                type="submit"
                className="rounded-lg px-3 py-1.5 text-sm text-[var(--text-muted)] transition-colors hover:bg-red-50 hover:text-red-600"
              >
                退出
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Content */}
      <main>{children}</main>
    </div>
  );
}
