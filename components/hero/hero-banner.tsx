import Link from "next/link";
import ParticleBackground from "@/components/hero/particle-background";
import Container from "@/components/layout/container";

export default function HeroBanner() {
  return (
    <section className="relative flex min-h-[85vh] items-center justify-center overflow-hidden bg-[var(--bg-deep)]">
      {/* Particle Canvas */}
      <ParticleBackground />

      {/* Gradient Overlay */}
      <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-transparent via-transparent to-[var(--bg-deep)]" />

      {/* Content */}
      <Container className="relative z-10 pb-20 pt-20 text-center">
        <h1 className="mx-auto max-w-4xl font-[family-name:var(--font-heading)] text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
          让机器
          <span className="gradient-text">看懂世界</span>
          <br />
          让机器人
          <span className="gradient-text">智驰野境</span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-gray-400 sm:text-xl">
          高精度3D感知 + 户外作业机器人
          <br />
          为林业、光伏、电力、石油、农业等行业提供开箱即用的智能解决方案
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="#products"
            className="inline-flex items-center gap-2 rounded-[var(--radius-btn)] bg-[var(--accent)] px-8 py-4 text-lg font-medium text-white shadow-lg shadow-blue-500/25 transition-all hover:bg-blue-700 hover:shadow-blue-500/40"
          >
            查看方案
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-[var(--radius-btn)] border border-gray-600 px-8 py-4 text-lg font-medium text-white transition-all hover:border-[var(--accent)] hover:text-[var(--accent)]"
          >
            预约演示 →
          </Link>
        </div>
      </Container>
    </section>
  );
}
