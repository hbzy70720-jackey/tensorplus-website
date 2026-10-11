"use client";

import Link from "next/link";
import Container from "@/components/layout/container";
import { useDict, useLocale } from "@/lib/i18n";
import { localizedHref } from "@/lib/locale-link";

export default function ProductCTA() {
  const t = useDict();
  const lang = useLocale();

  return (
    <section className="bg-[var(--bg-deep)] py-16">
      <Container className="text-center">
        <h2 className="font-[family-name:var(--font-heading)] text-3xl font-bold tracking-tight text-white sm:text-4xl">
          {t.home.ctaTitle}
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-lg text-gray-400">
          {t.home.ctaDesc}
        </p>
        <div className="mt-8">
          <Link
            href={localizedHref("/contact", lang)}
            className="inline-flex items-center gap-2 rounded-[var(--radius-btn)] bg-[var(--accent)] px-8 py-4 text-lg font-medium text-white shadow-lg shadow-blue-500/25 transition-all hover:bg-blue-700"
          >
            {t.home.ctaButton} →
          </Link>
        </div>
      </Container>
    </section>
  );
}
