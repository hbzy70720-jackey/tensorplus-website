"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import Button from "@/components/ui/button";
import Container from "@/components/layout/container";

const navLinks = [
  { href: "/", label: "首页" },
  { href: "/3d-perception", label: "3D感知方案" },
  { href: "/robot", label: "户外作业机器人" },
  { href: "/cases", label: "客户案例" },
  { href: "/about", label: "关于我们" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const isDarkPage = pathname === "/";

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
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className={cn(
              "font-[family-name:var(--font-heading)] text-xl font-bold tracking-tight transition-colors",
              scrolled || !isDarkPage
                ? "text-[var(--text-dark)]"
                : "text-white"
            )}
          >
            <span className="gradient-text">Tensor</span>
            <span className={scrolled || !isDarkPage ? "" : "text-white"}>
              Plus
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden items-center gap-1 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                  pathname === link.href
                    ? "text-[var(--accent)]"
                    : scrolled || !isDarkPage
                    ? "text-[var(--text-muted)] hover:text-[var(--text-dark)]"
                    : "text-gray-300 hover:text-white"
                )}
              >
                {link.label}
              </Link>
            ))}
            <div className="ml-4">
              <Button href="/contact" size="sm">
                预约演示
              </Button>
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
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "block rounded-lg px-4 py-3 text-base font-medium transition-colors",
                  pathname === link.href
                    ? "text-[var(--accent)] bg-blue-50"
                    : "text-[var(--text-dark)] hover:bg-gray-50"
                )}
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-3 px-4">
              <Button href="/contact" className="w-full">
                预约演示
              </Button>
            </div>
          </div>
        )}
      </Container>
    </nav>
  );
}
