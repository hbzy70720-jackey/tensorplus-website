import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";
import Container from "@/components/layout/container";

export default function Footer() {
  return (
    <footer className="bg-[var(--bg-dark)] text-[var(--text-light)]">
      <Container className="py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <Link
              href="/"
              className="font-[family-name:var(--font-heading)] text-xl font-bold"
            >
              <span className="gradient-text">Tensor</span>
              <span>Plus</span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-[var(--text-muted)]">
              北京张量无限科技有限公司 — 专注于高精度3D感知与户外作业机器人解决方案。
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-400">
              快速链接
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/3d-perception"
                  className="text-[var(--text-muted)] transition-colors hover:text-white"
                >
                  3D感知方案
                </Link>
              </li>
              <li>
                <Link
                  href="/robot"
                  className="text-[var(--text-muted)] transition-colors hover:text-white"
                >
                  户外作业机器人
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-[var(--text-muted)] transition-colors hover:text-white"
                >
                  关于我们
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-[var(--text-muted)] transition-colors hover:text-white"
                >
                  预约演示
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-400">
              联系方式
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
              商务合作
            </h3>
            <p className="text-sm leading-relaxed text-[var(--text-muted)]">
              如果您对我们的产品或方案感兴趣，欢迎随时联系。我们会在24小时内回复。
            </p>
            <div className="mt-4">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-[var(--radius-btn)] bg-[var(--accent)] px-6 py-2.5 text-sm font-medium text-white transition-all hover:bg-blue-700"
              >
                预约演示 →
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 border-t border-gray-800 pt-8 text-center text-sm text-[var(--text-muted)]">
          &copy; {new Date().getFullYear()} 北京张量无限科技有限公司. All
          rights reserved.
        </div>
      </Container>
    </footer>
  );
}
