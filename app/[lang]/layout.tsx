import { LocaleProvider } from "@/lib/i18n";
import PublicShell from "@/components/layout/public-shell";

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = lang === "en" ? "en" : "zh";
  return (
    <LocaleProvider lang={locale}>
      <PublicShell>{children}</PublicShell>
    </LocaleProvider>
  );
}
