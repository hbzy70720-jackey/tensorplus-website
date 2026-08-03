"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, Eye, ArrowLeft } from "lucide-react";
import RichTextEditor from "@/components/admin/rich-text-editor";
import ImageUpload from "@/components/admin/image-upload";

interface CaseFormData {
  title: string;
  description: string;
  content: string;
  coverImage: string;
  industry: string;
  customer: string;
  deliveryDate: string;
  tags: string;
  published: boolean;
}

interface CaseFormProps {
  initialData?: {
    id: number;
    title: string;
    slug: string;
    description: string | null;
    content: string;
    coverImage: string | null;
    industry: string | null;
    customer: string | null;
    deliveryDate: string | null;
    tags: string;
    published: boolean;
  };
}

export default function CaseForm({ initialData }: CaseFormProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState<CaseFormData>({
    title: initialData?.title || "",
    description: initialData?.description || "",
    content: initialData?.content || "",
    coverImage: initialData?.coverImage || "",
    industry: initialData?.industry || "",
    customer: initialData?.customer || "",
    deliveryDate: initialData?.deliveryDate || "",
    tags: initialData?.tags || "[]",
    published: initialData?.published ?? false,
  });

  const updateField = <K extends keyof CaseFormData>(
    key: K,
    value: CaseFormData[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (publishAfterSave = false) => {
    setSaving(true);
    setError("");

    const payload = { ...form, published: publishAfterSave ? true : form.published };

    try {
      const url = initialData
        ? `/api/admin/cases/${initialData.id}`
        : "/api/admin/cases";
      const method = initialData ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        router.push("/admin/cases");
      } else {
        setError(data.error || "保存失败");
      }
    } catch {
      setError("网络错误");
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-[var(--text-dark)] transition-colors focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]";
  const labelClass = "block mb-1.5 text-sm font-medium text-[var(--text-dark)]";

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/admin/cases")}
            className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-[var(--text-dark)]">
              {initialData ? "编辑案例" : "新建案例"}
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => handleSubmit(false)}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-[var(--text-dark)] transition-colors hover:bg-gray-50 disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            保存草稿
          </button>
          <button
            type="button"
            onClick={() => handleSubmit(true)}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                保存中...
              </>
            ) : (
              <>
                <Eye className="h-4 w-4" />
                发布
              </>
            )}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Form */}
      <div className="space-y-6">
        {/* 标题 */}
        <div>
          <label className={labelClass}>案例标题 *</label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => updateField("title", e.target.value)}
            className={inputClass}
            placeholder="输入案例标题"
          />
        </div>

        {/* 摘要 */}
        <div>
          <label className={labelClass}>摘要</label>
          <textarea
            value={form.description}
            onChange={(e) => updateField("description", e.target.value)}
            rows={3}
            className={inputClass}
            placeholder="简短摘要，在案例列表页展示"
          />
        </div>

        {/* 正文（TipTap） */}
        <div>
          <label className={labelClass}>正文内容 *</label>
          <RichTextEditor
            content={form.content}
            onChange={(html) => updateField("content", html)}
          />
        </div>

        {/* 封面图 + 元信息 2 列布局 */}
        <div className="grid gap-6 sm:grid-cols-2">
          {/* 封面图 */}
          <div>
            <label className={labelClass}>封面图</label>
            <ImageUpload
              value={form.coverImage}
              onChange={(url) => updateField("coverImage", url)}
            />
          </div>

          {/* 右侧信息 */}
          <div className="space-y-4">
            {/* 客户名称 */}
            <div>
              <label className={labelClass}>客户名称</label>
              <input
                type="text"
                value={form.customer}
                onChange={(e) => updateField("customer", e.target.value)}
                className={inputClass}
                placeholder="例如：XX能源集团"
              />
            </div>

            {/* 行业 */}
            <div>
              <label className={labelClass}>所属行业</label>
              <select
                value={form.industry}
                onChange={(e) => updateField("industry", e.target.value)}
                className={inputClass}
              >
                <option value="">不指定</option>
                <option value="光伏">光伏</option>
                <option value="林业">林业</option>
                <option value="石油">石油</option>
                <option value="电力">电力</option>
              </select>
            </div>

            {/* 交付时间 */}
            <div>
              <label className={labelClass}>交付时间</label>
              <input
                type="month"
                value={form.deliveryDate}
                onChange={(e) => updateField("deliveryDate", e.target.value)}
                className={inputClass}
              />
            </div>

            {/* 标签 */}
            <div>
              <label className={labelClass}>标签（逗号分隔）</label>
              <input
                type="text"
                value={
                  (() => {
                    try {
                      return JSON.parse(form.tags).join("，");
                    } catch {
                      return "";
                    }
                  })()
                }
                onChange={(e) => {
                  const tags = e.target.value
                    .split(/[,，]/)
                    .map((t) => t.trim())
                    .filter(Boolean);
                  updateField("tags", JSON.stringify(tags));
                }}
                className={inputClass}
                placeholder="例如：机器人安装，3D测量，自动化"
              />
            </div>

            {/* 发布状态 */}
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-[var(--text-dark)]">
                已发布
              </label>
              <button
                type="button"
                onClick={() => updateField("published", !form.published)}
                className={`relative h-6 w-11 rounded-full transition-colors ${
                  form.published ? "bg-[var(--accent)]" : "bg-gray-300"
                }`}
              >
                <span
                  className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                    form.published ? "left-[22px]" : "left-0.5"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
