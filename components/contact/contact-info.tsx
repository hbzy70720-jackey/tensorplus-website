"use client";

import { Mail, Phone, MapPin, Copy, Check } from "lucide-react";
import { useState } from "react";

function CopyableText({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="group flex w-full items-center gap-3 rounded-lg p-2 text-left transition-colors hover:bg-blue-50"
      title={`点击复制${label}`}
    >
      <span className="flex-1 text-sm text-[var(--text-dark)]">{text}</span>
      {copied ? (
        <Check className="h-4 w-4 shrink-0 text-green-500" />
      ) : (
        <Copy className="h-4 w-4 shrink-0 text-gray-300 opacity-0 transition-opacity group-hover:opacity-100" />
      )}
    </button>
  );
}

export default function ContactInfo() {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-[var(--shadow-card)]">
      <h3 className="font-[family-name:var(--font-heading)] text-xl font-bold text-[var(--text-dark)]">
        联系方式
      </h3>

      <div className="mt-6 space-y-4">
        <div className="flex items-start gap-3">
          <Mail className="mt-1 h-5 w-5 shrink-0 text-[var(--accent)]" />
          <div>
            <p className="text-xs text-[var(--text-muted)]">邮箱</p>
            <CopyableText text="sales@tensorplus.cn" label="邮箱" />
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Phone className="mt-1 h-5 w-5 shrink-0 text-[var(--accent)]" />
          <div>
            <p className="text-xs text-[var(--text-muted)]">电话</p>
            <p className="text-sm text-[var(--text-muted)]">张先生：<span className="font-medium text-[var(--text-dark)]">18616718989</span></p>
            <p className="text-sm text-[var(--text-muted)]">杨先生：<span className="font-medium text-[var(--text-dark)]">18611406172</span></p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <MapPin className="mt-1 h-5 w-5 shrink-0 text-[var(--accent)]" />
          <div>
            <p className="text-xs text-[var(--text-muted)]">地址</p>
            <p className="text-sm text-[var(--text-dark)]">
              北京市海淀区成府路45号
              <br />
              中关村智造大街G座2层206
            </p>
          </div>
        </div>
      </div>

      {/* 微信公众号 & 视频号 */}
      <div className="mt-8 grid grid-cols-2 gap-4">
        <div className="text-center">
          <p className="mb-3 text-xs text-[var(--text-muted)]">微信公众号</p>
          <div className="mx-auto flex h-32 w-32 items-center justify-center rounded-xl bg-gray-100">
            <img
              src="/wechat-oa.jpg"
              alt="TensorPlus微信公众号二维码"
              className="h-full w-full rounded-xl object-contain"
            />
          </div>
        </div>
        <div className="text-center">
          <p className="mb-3 text-xs text-[var(--text-muted)]">微信视频号</p>
          <div className="mx-auto flex h-32 w-32 items-center justify-center rounded-xl bg-white">
            <img
              src="/wechat-video.jpg"
              alt="TensorPlus微信视频号二维码"
              className="h-full w-full rounded-xl object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
