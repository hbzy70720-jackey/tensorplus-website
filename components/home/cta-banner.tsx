"use client";

import Button from "@/components/ui/button";
import Container from "@/components/layout/container";
import { useDict, useLocale } from "@/lib/i18n";
import { localizedHref } from "@/lib/locale-link";

export default function CTABanner() {
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
          <Button href={localizedHref("/contact", lang)} size="lg">
            {t.home.ctaButton}
          </Button>
        </div>
      </Container>
    </section>
  );
}
