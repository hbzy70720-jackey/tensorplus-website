"use client";

import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";
import Container from "@/components/layout/container";
import { useDict, useLocale } from "@/lib/i18n";
import { localizedHref } from "@/lib/locale-link";

export default function Footer() {
  const t = useDict();
  const lang = useLocale();

  return (
    <footer className="bg-[var(--bg-dark)] text-[var(--text-light)]">
      <Container className="py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <Link
              href={localizedHref("/", lang)}
              className="font-[family-name:var(--font-heading)] text-xl font-bold"
            >
              <span className="gradient-text">Tensor</span>
              <span>Plus</span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-[var(--text-muted)]">
              {t.footer.brandDesc}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-400">
              {t.footer.quickLinks}
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href={localizedHref("/3d-perception", lang)}
                  className="text-[var(--text-muted)] transition-colors hover:text-white"
                >
                  {t.nav.perception}
                </Link>
              </li>
              <li>
                <Link
                  href={localizedHref("/robot", lang)}
                  className="text-[var(--text-muted)] transition-colors hover:text-white"
                >
                  {t.nav.robot}
                </Link>
              </li>
              <li>
                <Link
                  href={localizedHref("/cases", lang)}
                  className="text-[var(--text-muted)] transition-colors hover:text-white"
                >
                  {t.nav.cases}
                </Link>
              </li>
              <li>
                <Link
                  href={localizedHref("/about", lang)}
                  className="text-[var(--text-muted)] transition-colors hover:text-white"
                >
                  {t.nav.about}
                </Link>
              </li>
              <li>
                <Link
                  href={localizedHref("/contact", lang)}
                  className="text-[var(--text-muted)] transition-colors hover:text-white"
                >
                  {t.nav.bookDemo}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-400">
              {t.footer.contact}
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-[var(--accent)]" />
                <a
                  href="mailto:sales@tensorplus.cn"
                  className="text-[var(--text-muted)] transition-colors hover:text-white"
                >
                  sales@tensorplus.cn
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-[var(--accent)]" />
                <div className="space-y-1">
                  <p className="text-sm text-[var(--text-muted)]">张先生：<span className="text-white">18616718989</span></p>
                  <p className="text-sm text-[var(--text-muted)]">杨先生：<span className="text-white">18611406172</span></p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[var(--accent)]" />
                <span className="text-[var(--text-muted)]">
                  北京市海淀区成府路45号中关村智造大街G座2层206
                </span>
              </li>
            </ul>
          </div>

          {/* CTA */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-400">
              {t.footer.business}
            </h3>
            <p className="text-sm leading-relaxed text-[var(--text-muted)]">
              {t.footer.businessDesc}
            </p>
            <div className="mt-4">
              <Link
                href={localizedHref("/contact", lang)}
                className="inline-flex items-center gap-2 rounded-[var(--radius-btn)] bg-[var(--accent)] px-6 py-2.5 text-sm font-medium text-white transition-all hover:bg-blue-700"
              >
                {t.footer.bookDemo}
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 border-t border-gray-800 pt-8 text-center text-sm text-[var(--text-muted)]">
          <p>{t.footer.copyright(new Date().getFullYear())}</p>
          <p className="mt-2 flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
            <a
              href="https://beian.miit.gov.cn/"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-[var(--text-light)]"
            >
              京ICP备18017788号-4
            </a>
            <a
              href="https://beian.mps.gov.cn/#/query/webSearch?code=11010802050104"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 transition-colors hover:text-[var(--text-light)]"
            >
              <img
                src="/images/gongan.png"
                alt=""
                width={18}
                height={18}
                className="inline-block"
              />
              京公网安备11010802050104号
            </a>
          </p>
        </div>
      </Container>
    </footer>
  );
}
