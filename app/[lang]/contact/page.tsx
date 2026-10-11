import type { Metadata } from "next";
import { MessageCircle } from "lucide-react";
import Section from "@/components/layout/section";
import Container from "@/components/layout/container";
import ProductHero from "@/components/product/product-hero";
import ContactForm from "@/components/contact/contact-form";
import ContactInfo from "@/components/contact/contact-info";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { seoMeta } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const isEn = lang === "en";
  const t = getDictionary(lang);
  return {
    title: t.contact.metaTitle,
    description: t.contact.metaDescription,
    ...seoMeta("/contact", isEn),
  };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const t = getDictionary(lang);

  return (
    <>
      {/* Hero */}
      <ProductHero
        title={t.contact.heroTitle}
        tagline={t.contact.heroTagline}
        description={t.contact.heroDescription}
        icon={<MessageCircle className="h-10 w-10 text-[var(--accent-glow)]" />}
      />

      <Section variant="light">
        <Container>
          <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-5">
            {/* Form */}
            <div className="lg:col-span-3">
              <h2 className="mb-8 font-[family-name:var(--font-heading)] text-2xl font-bold text-[var(--text-dark)]">
                {t.contact.formTitle}
              </h2>
              <ContactForm />
            </div>

            {/* Info */}
            <div className="lg:col-span-2">
              <h2 className="mb-8 font-[family-name:var(--font-heading)] text-2xl font-bold text-[var(--text-dark)]">
                {t.contact.infoTitle}
              </h2>
              <ContactInfo />
            </div>
          </div>

          {/* Reassurance */}
          <div className="mx-auto mt-16 max-w-lg rounded-2xl bg-blue-50 p-6 text-center">
            <p className="text-sm font-medium text-[var(--accent)]">
              {t.contact.reassurance}
            </p>
          </div>
        </Container>
      </Section>
    </>
  );
}
