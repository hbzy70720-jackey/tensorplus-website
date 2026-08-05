"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductSpecCard from "@/components/product/product-spec-card";

interface SpecRow {
  param: string;
  value: string;
}

interface Product {
  name: string;
  imagePath: string;
  imagePlaceholder: string;
  specs: SpecRow[];
  performance: SpecRow[];
}

interface ProductCarouselProps {
  products: Product[];
}

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -300 : 300,
    opacity: 0,
  }),
};

export default function ProductCarousel({ products }: ProductCarouselProps) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);

  const goTo = useCallback(
    (index: number) => {
      if (index === current) return;
      setDirection(index > current ? 1 : -1);
      setCurrent(index);
    },
    [current],
  );

  const goPrev = useCallback(() => {
    const prev = (current - 1 + products.length) % products.length;
    setDirection(-1);
    setCurrent(prev);
  }, [current, products.length]);

  const goNext = useCallback(() => {
    const next = (current + 1) % products.length;
    setDirection(1);
    setCurrent(next);
  }, [current, products.length]);

  return (
    <div className="relative">
      {/* 顶部标签导航 */}
      <div className="mb-8 flex items-center justify-center gap-2">
        {products.map((p, i) => (
          <button
            key={p.name}
            onClick={() => goTo(i)}
            className={`relative rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-300 ${
              i === current
                ? "bg-[var(--accent)] text-white shadow-lg shadow-blue-500/25"
                : "bg-gray-100 text-[var(--text-muted)] hover:bg-gray-200"
            }`}
          >
            {p.name}
            {i === current && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 rounded-full bg-[var(--accent)]"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
                style={{ zIndex: -1 }}
              />
            )}
          </button>
        ))}
      </div>

      {/* 卡片区域 + 左右箭头 */}
      <div className="relative px-14">
        {/* 左箭头 */}
        <button
          onClick={goPrev}
          className="absolute left-0 top-1/2 z-10 -translate-y-1/2 rounded-full border border-gray-200 bg-white p-3 shadow-md transition-all hover:scale-110 hover:shadow-lg hover:border-gray-300"
          aria-label="上一个产品"
        >
          <ChevronLeft className="h-5 w-5 text-[var(--text-dark)]" />
        </button>

        <div className="overflow-hidden">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={current}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.35, ease: "easeInOut" }}
            >
              <ProductSpecCard {...products[current]} />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* 右箭头 */}
        <button
          onClick={goNext}
          className="absolute right-0 top-1/2 z-10 -translate-y-1/2 rounded-full border border-gray-200 bg-white p-3 shadow-md transition-all hover:scale-110 hover:shadow-lg hover:border-gray-300"
          aria-label="下一个产品"
        >
          <ChevronRight className="h-5 w-5 text-[var(--text-dark)]" />
        </button>
      </div>

      {/* 底部指示器 */}
      <div className="mt-6 flex items-center justify-center gap-3">
        {products.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === current ? "w-8 bg-[var(--accent)]" : "w-2 bg-gray-300 hover:bg-gray-400"
            }`}
            aria-label={`第 ${i + 1} 个产品`}
          />
        ))}
        <span className="ml-2 text-sm font-medium text-[var(--text-muted)]">
          {current + 1} / {products.length}
        </span>
      </div>
    </div>
  );
}
