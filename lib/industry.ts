import type { Locale } from "@/lib/i18n/config";

export const INDUSTRY_MAP: Record<string, { zh: string; en: string; color: string }> = {
  光伏: { zh: "光伏", en: "Solar", color: "bg-yellow-50 text-yellow-700" },
  林业: { zh: "林业", en: "Forestry", color: "bg-green-50 text-green-700" },
  石油: { zh: "石油", en: "Oil & Gas", color: "bg-orange-50 text-orange-700" },
  电力: { zh: "电力", en: "Power", color: "bg-blue-50 text-blue-700" },
};

export const INDUSTRY_OPTIONS = Object.keys(INDUSTRY_MAP);

export function industryLabel(value: string | null | undefined, lang: Locale): string {
  if (!value) return "";
  return lang === "en" ? (INDUSTRY_MAP[value]?.en ?? value) : (INDUSTRY_MAP[value]?.zh ?? value);
}

export function industryColor(value: string | null | undefined): string {
  return value ? (INDUSTRY_MAP[value]?.color ?? "bg-gray-50 text-gray-600") : "bg-gray-50 text-gray-600";
}
