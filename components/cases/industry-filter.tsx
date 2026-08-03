"use client";

import { useRouter, useSearchParams } from "next/navigation";

const industries = [
  { value: "", label: "全部" },
  { value: "光伏", label: "光伏" },
  { value: "林业", label: "林业" },
  { value: "石油", label: "石油" },
  { value: "电力", label: "电力" },
];

export default function IndustryFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const current = searchParams.get("industry") || "";

  const handleChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set("industry", value);
    } else {
      params.delete("industry");
    }
    router.push(`/cases?${params.toString()}`);
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
