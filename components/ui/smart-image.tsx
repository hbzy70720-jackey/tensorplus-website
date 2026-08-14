"use client";

import { useState } from "react";
import type { ImgHTMLAttributes } from "react";
import { imageCandidates } from "@/lib/image";

interface SmartImageProps
  extends Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "onError"> {
  /** 图片基础路径：可带扩展名，也可不带（不带时自动尝试各格式） */
  src: string;
  /** 所有候选格式都加载失败后触发 */
  onError?: () => void;
}

/**
 * 不依赖特定图片格式的 <img>。
 * src 不带扩展名时，按 webp→png→jpg 等顺序自动尝试，第一个能加载成功的即为最终图片；
 * 全部失败后才会触发外部传入的 onError。
 */
export default function SmartImage({ src, alt = "", onError, ...rest }: SmartImageProps) {
  const [attempt, setAttempt] = useState(0);
  const candidates = imageCandidates(src);

  if (candidates.length === 0) return null;

  const current = candidates[Math.min(attempt, candidates.length - 1)];

  return (
    <img
      {...rest}
      src={current}
      alt={alt}
      onError={() => {
        if (attempt < candidates.length - 1) {
          setAttempt((a) => a + 1);
        } else {
          onError?.();
        }
      }}
    />
  );
}
