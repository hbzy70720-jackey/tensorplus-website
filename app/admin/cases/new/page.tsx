import type { Metadata } from "next";
import CaseForm from "@/components/admin/case-form";

export const metadata: Metadata = {
  title: "新建案例 — 后台管理",
  robots: "noindex, nofollow",
};

export default function NewCasePage() {
  return <CaseForm />;
}
