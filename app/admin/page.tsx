import { AdminDashboard } from "@/components/admin/admin-dashboard";
import AdminQuickNav from "@/components/admin/admin-quick-nav";

export default function AdminPage() {
  return (
    <>
      <AdminQuickNav active="submissions" />
      <AdminDashboard />
    </>
  );
}
