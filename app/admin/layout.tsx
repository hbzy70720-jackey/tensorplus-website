import type { Metadata } from "next";
import AdminHeader from "./admin-header";

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
      {/* Top Bar（登录页自动隐藏） */}
      <AdminHeader />

      {/* Content */}
      <main>{children}</main>
    </div>
  );
}
