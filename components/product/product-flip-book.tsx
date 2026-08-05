"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Camera } from "lucide-react";

interface SpecRow {
  param: string;
  value: string;
}

export interface ProductData {
  id: string;
  name: string;
  subtitle: string;
  image: string | null;
  specs: SpecRow[];
  performance: SpecRow[];
}

interface ProductFlipBookProps {
  products: ProductData[];
}

/** 产品占位图 — 线框风格 */
function ImagePlaceholder({ name }: { name: string }) {
  return (
    <div className="flex aspect-[4/3] w-full max-w-lg items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50">
      <div className="text-center">
        <div className="mx-auto mb-3 inline-flex rounded-xl bg-gray-100 p-3">
          <Camera className="h-8 w-8 text-gray-400" />
        </div>
        <p className="text-sm font-semibold text-gray-400">{name}</p>
        <p className="mt-1 text-xs text-gray-300">产品图即将发布</p>
      </div>
    </div>
  );
}

/** 规格子表 */
function SpecSubTable({
  title,
  rows,
}: {
  title: string;
  rows: SpecRow[];
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200">
      <div className="bg-gray-50 px-4 py-2.5">
        <h4 className="text-sm font-semibold text-[var(--text-dark)]">{title}</h4>
      </div>
      <table className="w-full">
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={row.param}
              className={
                i % 2 === 0 ? "bg-white" : "bg-gray-50/50"
              }
            >
              <td className="w-[40%] px-4 py-2.5 text-xs font-medium text-[var(--text-dark)]">
                {row.param}
              </td>
              <td className="px-4 py-2.5 text-xs text-[var(--text-muted)]">
                {row.value}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function ProductFlipBook({ products }: ProductFlipBookProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState<number | null>(null);
  const [direction, setDirection] = useState<"next" | "prev">("next");
  const [isAnimating, setIsAnimating] = useState(false);

  const flipTo = useCallback(
    (target: number) => {
      if (isAnimating || target === activeIndex) return;
      setDirection(target > activeIndex ? "next" : "prev");
      setPrevIndex(activeIndex);
      setActiveIndex(target);
      setIsAnimating(true);
      setTimeout(() => {
        setPrevIndex(null);
        setIsAnimating(false);
      }, 600);
    },
    [activeIndex, isAnimating],
  );

  const goNext = () => flipTo((activeIndex + 1) % products.length);
  const goPrev = () =>
    flipTo((activeIndex - 1 + products.length) % products.length);

  const currentProduct = products[activeIndex];
  const exitingProduct = prevIndex !== null ? products[prevIndex] : null;

  return (
    <div>
      {/* ======== 产品标签 ======== */}
      <div className="mb-10 flex items-center justify-center gap-2">
        {products.map((p, i) => (
          <button
            key={p.id}
            type="button"
            onClick={() => flipTo(i)}
            className={`relative rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-300 ${
              i === activeIndex
                ? "bg-[var(--accent)] text-white shadow-lg shadow-blue-500/25"
                : "bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700"
            }`}
          >
            {p.name}
            {i === activeIndex && (
              <span className="absolute -bottom-1 left-1/2 h-0.5 w-8 -translate-x-1/2 rounded-full bg-[var(--accent-glow)]" />
            )}
          </button>
        ))}
      </div>

      {/* ======== 3D 翻书区域 ======== */}
      <div
        className="relative"
        style={{ perspective: "1200px" }}
      >
        {/* 退出中的旧卡片（绝对定位，不影响布局） */}
        {exitingProduct && (
          <div
            className="absolute inset-0 z-10"
            style={{
              animation: `${
                direction === "next" ? "flipOutLeft" : "flipOutRight"
              } 0.6s ease-in-out forwards`,
              backfaceVisibility: "hidden",
              transformOrigin:
                direction === "next" ? "left center" : "right center",
            }}
          >
            <ProductCardContent product={exitingProduct} />
          </div>
        )}

        {/* 进入中的新卡片（正常流，决定容器高度） */}
        <div
          style={{
            animation:
              prevIndex !== null
                ? `${
                    direction === "next" ? "flipInRight" : "flipInLeft"
                  } 0.6s ease-in-out`
                : "none",
            backfaceVisibility: "hidden",
            transformOrigin:
              direction === "next" ? "right center" : "left center",
          }}
        >
          <ProductCardContent product={currentProduct} />
        </div>
      </div>

      {/* ======== 导航：箭头 + 圆点 ======== */}
      <div className="mt-8 flex items-center justify-center gap-6">
        <button
          type="button"
          onClick={goPrev}
          disabled={isAnimating}
          className="group flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 transition-all hover:border-[var(--accent)] hover:text-[var(--accent)] hover:shadow-md disabled:opacity-30"
          aria-label="上一款产品"
        >
          <ChevronLeft className="h-5 w-5 transition-transform group-hover:-translate-x-0.5" />
        </button>

        <div className="flex items-center gap-2">
          {products.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => flipTo(i)}
              disabled={isAnimating}
              aria-label={`切换到 ${products[i].name}`}
              className={`rounded-full transition-all duration-300 ${
                i === activeIndex
                  ? "h-2.5 w-8 bg-[var(--accent)]"
                  : "h-2.5 w-2.5 bg-gray-300 hover:bg-gray-400"
              }`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={goNext}
          disabled={isAnimating}
          className="group flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 transition-all hover:border-[var(--accent)] hover:text-[var(--accent)] hover:shadow-md disabled:opacity-30"
          aria-label="下一款产品"
        >
          <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>
    </div>
  );
}

/** 单款产品卡片内容：图片 + 双列表格 */
function ProductCardContent({ product }: { product: ProductData }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-[var(--shadow-card)] sm:p-8">
      {/* 产品名 + 副标题 */}
      <div className="mb-6 text-center">
        <h3 className="font-[family-name:var(--font-heading)] text-xl font-bold text-[var(--text-dark)] sm:text-2xl">
          {product.name}
        </h3>
        <p className="mt-1 text-sm text-[var(--text-muted)]">
          {product.subtitle}
        </p>
      </div>

      {/* 产品图 */}
      <div className="mb-8 flex justify-center">
        {product.image ? (
          <div className="relative aspect-[4/3] w-full max-w-lg overflow-hidden rounded-2xl">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 512px"
            />
          </div>
        ) : (
          <ImagePlaceholder name={product.name} />
        )}
      </div>

      {/* 双列表格：规格参数 + 性能指标 */}
      <div className="grid gap-6 md:grid-cols-2">
        <SpecSubTable title="规格参数" rows={product.specs} />
        <SpecSubTable title="性能指标" rows={product.performance} />
      </div>
    </div>
  );
}
