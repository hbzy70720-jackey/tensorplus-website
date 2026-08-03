import type { Metadata } from "next";
import VisitsDashboard from "@/components/admin/visits-dashboard";
import AdminQuickNav from "@/components/admin/admin-quick-nav";

export const metadata: Metadata = {
  title: "访问记录 — 后台管理",
  robots: "noindex, nofollow",
};

export default function VisitsPage() {
  return (
    <>
      <AdminQuickNav active="visits" />
      <VisitsDashboard />
    </>
  );
}
