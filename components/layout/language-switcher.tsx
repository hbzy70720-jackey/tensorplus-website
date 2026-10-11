"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Globe, ChevronDown } from "lucide-react";
import { locales, type Locale, localeNames } from "@/lib/i18n/config";
import { useLocale } from "@/lib/i18n";
import { localizePath } from "@/lib/locale-link";
import { cn } from "@/lib/utils";

export default function LanguageSwitcher({ dark = false }: { dark?: boolean }) {
  const pathname = usePathname();
  const currentLang = useLocale();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
          dark ? "text-gray-300 hover:text-white" : "text-[var(--text-muted)] hover:text-[var(--text-dark)]"
        )}
      >
        <Globe className="h-4 w-4" />
        {localeNames[currentLang]}
        <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 min-w-[140px] overflow-hidden rounded-xl border border-gray-100 bg-white py-1 shadow-lg">
          {locales.map((lang: Locale) => (
            <Link
              key={lang}
              href={localizePath(pathname, lang)}
              className={cn(
                "block px-4 py-2 text-sm transition-colors",
                lang === currentLang ? "bg-gray-50 font-medium text-[var(--accent)]" : "text-[var(--text-muted)] hover:bg-gray-50 hover:text-[var(--text-dark)]"
              )}
            >
              {localeNames[lang]}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
