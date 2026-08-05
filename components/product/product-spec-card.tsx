"use client";

import { useState } from "react";
import Image from "next/image";
import { ImageIcon } from "lucide-react";

interface SpecRow {
  param: string;
  value: string;
}

interface ProductSpecCardProps {
  name: string;
  imagePath: string;
  imagePlaceholder: string;
  specs: SpecRow[];
  performance: SpecRow[];
}

function MiniSpecTable({ title, rows }: { title: string; rows: SpecRow[] }) {
  return (
    <div>
      <h4 className="mb-3 text-sm font-bold uppercase tracking-wider text-[var(--accent)]">
        {title}
      </h4>
      <div className="overflow-hidden rounded-xl border border-gray-200">
        <table className="w-full">
          <tbody>
            {rows.map((row, i) => (
              <tr
                key={row.param}
                className={i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}
              >
                <td className="px-4 py-2.5 text-xs font-medium text-[var(--text-dark)] w-[45%]">
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
    </div>
  );
}

export default function ProductSpecCard({
  name,
  imagePath,
  imagePlaceholder,
  specs,
  performance,
}: ProductSpecCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-[var(--shadow-card)]">
      <h3 className="mb-6 font-[family-name:var(--font-heading)] text-xl font-bold text-[var(--text-dark)]">
        {name}
      </h3>

      <div className="flex flex-col gap-6 lg:flex-row">
        {/* 左侧：产品图片 */}
        <div className="relative flex w-full flex-shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gray-50 p-4 lg:w-[42%]">
          {(imageError || !imageLoaded) && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-1 bg-gray-50 text-[var(--text-muted)]">
              <ImageIcon className="h-10 w-10 opacity-30" />
              <span className="text-sm opacity-50">产品图片</span>
              <span className="text-xs opacity-35">{imagePlaceholder}</span>
            </div>
          )}

          <Image
            src={imagePath}
            alt={name}
            width={1000}
            height={563}
            className="relative z-0 h-auto w-full object-contain"
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
            unoptimized
          />
        </div>

        {/* 右侧：规格参数 + 性能指标 */}
        <div className="flex min-w-0 flex-1 flex-col gap-5">
          <MiniSpecTable title="规格参数" rows={specs} />
          <MiniSpecTable title="性能指标" rows={performance} />
        </div>
      </div>
    </div>
  );
}
