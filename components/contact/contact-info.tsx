"use client";

import { Mail, Phone, MapPin, Copy, Check } from "lucide-react";
import { useState } from "react";
import SmartImage from "@/components/ui/smart-image";
import { useDict } from "@/lib/i18n";

function CopyableText({ text, title }: { text: string; title: string }) {
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
      title={title}
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
  const t = useDict();

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-[var(--shadow-card)]">
      <h3 className="font-[family-name:var(--font-heading)] text-xl font-bold text-[var(--text-dark)]">
        {t.contact.infoCardTitle}
      </h3>

      <div className="mt-6 space-y-4">
        <div className="flex items-start gap-3">
          <Mail className="mt-1 h-5 w-5 shrink-0 text-[var(--accent)]" />
          <div>
            <p className="text-xs text-[var(--text-muted)]">{t.contact.email}</p>
            <CopyableText text="sales@tensorplus.cn" title={t.contact.copyEmail} />
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Phone className="mt-1 h-5 w-5 shrink-0 text-[var(--accent)]" />
          <div>
            <p className="text-xs text-[var(--text-muted)]">{t.contact.phone}</p>
            <p className="text-sm text-[var(--text-muted)]">{t.contact.zhangName}<span className="font-medium text-[var(--text-dark)]">18616718989</span></p>
            <p className="text-sm text-[var(--text-muted)]">{t.contact.yangName}<span className="font-medium text-[var(--text-dark)]">18611406172</span></p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <MapPin className="mt-1 h-5 w-5 shrink-0 text-[var(--accent)]" />
          <div>
            <p className="text-xs text-[var(--text-muted)]">{t.contact.address}</p>
            <p className="text-sm text-[var(--text-dark)]">
              {t.contact.addressLine1}
              <br />
              {t.contact.addressLine2}
            </p>
          </div>
        </div>
      </div>

      {/* 微信公众号 & 视频号 */}
      <div className="mt-8 grid grid-cols-2 gap-4">
        <div className="text-center">
          <p className="mb-3 text-xs text-[var(--text-muted)]">{t.contact.wechatOa}</p>
          <div className="mx-auto flex h-32 w-32 items-center justify-center rounded-xl bg-gray-100">
            <SmartImage
              src="/wechat-oa"
              alt={t.contact.wechatOaAlt}
              className="h-full w-full rounded-xl object-contain"
            />
          </div>
        </div>
        <div className="text-center">
          <p className="mb-3 text-xs text-[var(--text-muted)]">{t.contact.wechatVideo}</p>
          <div className="mx-auto flex h-32 w-32 items-center justify-center rounded-xl bg-white">
            <SmartImage
              src="/wechat-video"
              alt={t.contact.wechatVideoAlt}
              className="h-full w-full rounded-xl object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
