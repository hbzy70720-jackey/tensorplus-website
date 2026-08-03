import Link from "next/link";
import Button from "@/components/ui/button";
import Container from "@/components/layout/container";

export default function CTABanner() {
  return (
    <section className="bg-[var(--bg-deep)] py-16">
      <Container className="text-center">
        <h2 className="font-[family-name:var(--font-heading)] text-3xl font-bold tracking-tight text-white sm:text-4xl">
          准备好迎接户外工作自动化了吗？
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-lg text-gray-400">
          无论您是机器人企业还是终端用户，我们都能提供业内领先、高性价比的3D感知与户外机器人解决方案。
        </p>
        <div className="mt-8">
          <Button href="/contact" size="lg">
            预约产品演示
          </Button>
        </div>
      </Container>
    </section>
  );
}
