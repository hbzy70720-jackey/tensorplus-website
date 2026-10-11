"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useDict, useLocale } from "@/lib/i18n";
import { INDUSTRY_OPTIONS, industryLabel } from "@/lib/industry";
import { localizedHref } from "@/lib/locale-link";

export default function IndustryFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const current = searchParams.get("industry") || "";
  const t = useDict();
  const lang = useLocale();

  const industries = [
    { value: "", label: t.cases.all },
    ...INDUSTRY_OPTIONS.map((v) => ({ value: v, label: industryLabel(v, lang) })),
  ];

  const handleChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set("industry", value);
    } else {
      params.delete("industry");
    }
    router.push(localizedHref(`/cases?${params.toString()}`, lang));
  };

  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      {industries.map(({ value, label }) => (
        <button
          key={value}
          onClick={() => handleChange(value)}
          className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
            current === value
              ? "bg-[var(--accent)] text-white shadow-sm"
              : "bg-white text-[var(--text-muted)] border border-gray-200 hover:border-gray-300 hover:text-[var(--text-dark)]"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
