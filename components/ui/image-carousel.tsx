"use client";

import { useState, useCallback, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageCarouselProps {
  /** 图片文件名数组，例如 ["perception-pv-1.jpg", "perception-pv-2.jpg"] */
  images: string[];
  /** 图片所在子目录，例如 "perception" */
  folder: string;
  /** alt 文本前缀，会自动拼接序号 */
  alt: string;
  /** 容器高度类名，默认 h-72 sm:h-80 */
  heightClass?: string;
}

export default function ImageCarousel({
  images,
  folder,
  alt,
  heightClass = "h-64 sm:h-80",
}: ImageCarouselProps) {
  const [current, setCurrent] = useState(0);
  const [loaded, setLoaded] = useState<Record<number, boolean>>({});

  // 切换图片时预加载相邻图片
  useEffect(() => {
    const toPreload = [current + 1, current - 1].filter(
      (i) => i >= 0 && i < images.length && !loaded[i]
    );
    if (toPreload.length === 0) return;
    toPreload.forEach((i) => {
      const img = new Image();
      img.onload = () => setLoaded((prev) => ({ ...prev, [i]: true }));
      img.src = `/images/${folder}/${images[i]}`;
    });
  }, [current, images, folder, loaded]);

  const goTo = useCallback(
    (index: number) => {
      if (index >= 0 && index < images.length) setCurrent(index);
    },
    [images.length]
  );

  const prev = useCallback(() => {
    setCurrent((c) => (c === 0 ? images.length - 1 : c - 1));
  }, [images.length]);

  const next = useCallback(() => {
    setCurrent((c) => (c === images.length - 1 ? 0 : c + 1));
  }, [images.length]);

  // 键盘左右键切换
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [prev, next]);

  if (images.length === 0) {
    return (
      <div
        className={cn(
          "flex w-full items-center justify-center rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50",
          heightClass
        )}
      >
        <p className="text-sm text-[var(--text-muted)]">暂无图片</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* 图片区域 */}
      <div className={cn("relative overflow-hidden rounded-2xl", heightClass)}>
        {images.map((img, i) => (
          <div
            key={img}
            className={cn(
              "absolute inset-0 transition-opacity duration-500",
              i === current ? "opacity-100" : "opacity-0 pointer-events-none"
            )}
          >
            <img
              src={`/images/${folder}/${img}`}
              alt={`${alt} - ${i + 1}`}
              className="h-full w-full object-cover"
              loading={i === 0 ? "eager" : "lazy"}
            />
          </div>
        ))}

        {/* 渐变遮罩 — 底部让指示点更可见 */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/30 to-transparent" />

        {/* 左右箭头 — 仅多图时显示 */}
        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 text-gray-700 shadow-md backdrop-blur-sm transition-all hover:bg-white hover:shadow-lg"
              aria-label="上一张"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 text-gray-700 shadow-md backdrop-blur-sm transition-all hover:bg-white hover:shadow-lg"
              aria-label="下一张"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}
      </div>

      {/* 指示点 — 仅多图时显示 */}
      {images.length > 1 && (
        <div className="mt-3 flex items-center justify-center gap-2">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                i === current
                  ? "w-6 bg-[var(--accent)]"
                  : "w-2 bg-gray-300 hover:bg-gray-400"
              )}
              aria-label={`第 ${i + 1} 张图片`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
