import Container from "@/components/layout/container";

interface ProductHeroProps {
  title: string;
  tagline: string;
  description: string;
  icon: React.ReactNode;
}

export default function ProductHero({
  title,
  tagline,
  description,
  icon,
}: ProductHeroProps) {
  return (
    <section className="relative bg-[var(--bg-deep)] py-16">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-blue-900/20 via-transparent to-cyan-900/10" />
      <Container className="relative z-10 text-center">
        <div className="mx-auto mb-6 inline-flex rounded-2xl bg-blue-500/10 p-4">
          {icon}
        </div>
        <h1 className="font-[family-name:var(--font-heading)] text-3xl font-bold tracking-tight text-white sm:text-4xl">
          {title}
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-xl font-medium text-[var(--accent-glow)]">
          {tagline}
        </p>
        <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-gray-400">
          {description}
        </p>
      </Container>
    </section>
  );
}
