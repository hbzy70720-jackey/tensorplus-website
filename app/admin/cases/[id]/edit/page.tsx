import type { Metadata } from "next";
import { notFound } from "next/navigation";
import prisma from "@/lib/db";
import CaseForm from "@/components/admin/case-form";

export const metadata: Metadata = {
  title: "编辑案例 — 后台管理",
  robots: "noindex, nofollow",
};

export default async function EditCasePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const caseId = Number(id);
  if (isNaN(caseId)) notFound();

  const caseStudy = await prisma.caseStudy.findUnique({
    where: { id: caseId },
  });

  if (!caseStudy) notFound();

  return <CaseForm initialData={caseStudy} />;
}
