import Link from "next/link";
import Container from "@/components/layout/container";

export default function NotFound() {
  return (
    <section className="flex min-h-screen items-center bg-[var(--bg-deep)] pt-20">
      <Container className="text-center">
        <div className="mx-auto mb-8 text-8xl font-bold text-gray-800">
          404
        </div>
        <h1 className="font-[family-name:var(--font-heading)] text-3xl font-bold text-white">
          页面未找到
        </h1>
        <p className="mx-auto mt-4 max-w-md text-gray-400">
          您访问的页面不存在或已被移动。
        </p>
        <div className="mt-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-[var(--radius-btn)] bg-[var(--accent)] px-6 py-3 font-medium text-white transition-all hover:bg-blue-700"
          >
            ← 返回首页
          </Link>
        </div>
      </Container>
    </section>
  );
}
