"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import Button from "@/components/ui/button";
import Container from "@/components/layout/container";
import { useDict, useLocale } from "@/lib/i18n";
import { localizedHref, stripLocalePrefix } from "@/lib/locale-link";
import LanguageSwitcher from "@/components/layout/language-switcher";

// Logo 图片路径：直接用「完整 logo（图标 + TENSOR⁺ 文字）」图片。
// dark 版用在黑底（首页），white 版用在白底（其他页 / 滚动后）。
const LOGO_ON_DARK = "/images/logo-dark.png"; // 完整 logo · 首页黑底用
const LOGO_ON_LIGHT = "/images/logo-white.png"; // 完整 logo · 其他页白底用

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const t = useDict();
  const lang = useLocale();

  const navLinks = [
    { href: "/", label: t.nav.home },
    { href: "/3d-perception", label: t.nav.perception },
    { href: "/robot", label: t.nav.robot },
    { href: "/cases", label: t.nav.cases },
    { href: "/about", label: t.nav.about },
  ];

  // 首页（/ 或 /en）黑底；其余页白底。rewrite 后 usePathname 仍返回原始路径，故无需处理 /zh。
  const isDarkPage = stripLocalePrefix(pathname) === "/";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-0 z-50 w-full transition-all duration-[var(--duration-normal)]",
        scrolled || !isDarkPage
          ? "bg-white/90 backdrop-blur-xl border-b border-gray-100 shadow-sm"
          : "bg-transparent"
      )}
    >
      <Container>
        <div className="flex h-28 items-center justify-between">
          {/* Logo：完整 logo 图片（图标 + TENSOR⁺ 文字） */}
          <Link
            href={localizedHref("/", lang)}
            aria-label="TensorPlus 首页"
            className="flex items-center"
          >
            <img
              src={scrolled || !isDarkPage ? LOGO_ON_LIGHT : LOGO_ON_DARK}
              alt="TensorPlus"
              className="h-10 w-auto sm:h-12 lg:h-14"
            />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden items-center gap-1 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={localizedHref(link.href, lang)}
                className={cn(
                  "rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                  stripLocalePrefix(pathname) === link.href
                    ? "text-[var(--accent)]"
                    : scrolled || !isDarkPage
                    ? "text-[var(--text-muted)] hover:text-[var(--text-dark)]"
                    : "text-gray-300 hover:text-white"
                )}
              >
                {link.label}
              </Link>
            ))}
            <div className="ml-4 flex items-center gap-2">
              <Button href={localizedHref("/contact", lang)} size="sm">
                {t.nav.bookDemo}
              </Button>
              <LanguageSwitcher dark={!scrolled && isDarkPage} />
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <X
                className={cn(
                  "h-6 w-6",
                  scrolled || !isDarkPage
                    ? "text-[var(--text-dark)]"
                    : "text-white"
                )}
              />
            ) : (
              <Menu
                className={cn(
                  "h-6 w-6",
                  scrolled || !isDarkPage
                    ? "text-[var(--text-dark)]"
                    : "text-white"
                )}
              />
            )}
          </button>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <div className="border-t border-gray-100 bg-white pb-6 pt-4 lg:hidden">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={localizedHref(link.href, lang)}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "block rounded-lg px-4 py-3 text-base font-medium transition-colors",
                  stripLocalePrefix(pathname) === link.href
                    ? "text-[var(--accent)] bg-blue-50"
                    : "text-[var(--text-dark)] hover:bg-gray-50"
                )}
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-3 flex flex-col gap-2 px-4">
              <Button href={localizedHref("/contact", lang)} className="w-full">
                {t.nav.bookDemo}
              </Button>
              <LanguageSwitcher />
            </div>
          </div>
        )}
      </Container>
    </nav>
  );
}
