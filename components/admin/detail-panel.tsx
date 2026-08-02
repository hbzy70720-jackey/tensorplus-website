"use client";

import { useState, useEffect, useCallback } from "react";
import { X, Save, Clock } from "lucide-react";
import StatusBadge from "@/components/admin/status-badge";

interface NoteEntry {
  id: number;
  content: string;
  createdAt: string;
}

interface Submission {
  id: number;
  name: string;
  email: string;
  company: string | null;
  phone: string | null;
  message: string;
  source: string;
  status: string;
  notes: string | null;
  createdAt: string;
}

interface DetailPanelProps {
  submission: Submission | null;
  onSaveNotes: (id: number, notes: string) => void;
  onClose: () => void;
}

export default function DetailPanel({
  submission,
  onSaveNotes,
  onClose,
}: DetailPanelProps) {
  const [notes, setNotes] = useState("");
  const [noteHistory, setNoteHistory] = useState<NoteEntry[]>([]);
  const [saving, setSaving] = useState(false);

  // 加载备注历史
  const fetchNotes = useCallback(async (submissionId: number) => {
    try {
      const res = await fetch(
        `/api/admin/submissions/${submissionId}/notes`,
        { credentials: "include" }
      );
      if (res.ok) {
        const data = await res.json();
        setNoteHistory(data);
      }
    } catch {
      // 静默处理
    }
  }, []);

  useEffect(() => {
    if (submission) {
      setNotes("");
      fetchNotes(submission.id);
    }
  }, [submission, fetchNotes]);

  if (!submission) return null;

  const handleSave = async () => {
    if (!notes.trim()) return;
    setSaving(true);
    try {
      const res = await fetch(
        `/api/admin/submissions/${submission.id}/notes`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ content: notes.trim() }),
        }
      );
      if (res.ok) {
        setNotes("");
        fetchNotes(submission.id);
        // 同步更新 submission.notes
        onSaveNotes(submission.id, notes.trim());
      }
    } catch {
      // 静默处理
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-[family-name:var(--font-heading)] text-lg font-bold text-[var(--text-dark)]">
          提交详情
        </h3>
        <button
          onClick={onClose}
          className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Meta */}
      <div className="mb-6 grid gap-3 sm:grid-cols-2">
        <div>
          <p className="text-xs text-[var(--text-muted)]">姓名</p>
          <p className="text-sm font-medium text-[var(--text-dark)]">
            {submission.name}
          </p>
        </div>
        <div>
          <p className="text-xs text-[var(--text-muted)]">邮箱</p>
          {submission.email ? (
            <a
              href={`mailto:${submission.email}`}
              className="text-sm font-medium text-[var(--accent)] hover:underline"
            >
              {submission.email}
            </a>
          ) : (
            <p className="text-sm text-[var(--text-muted)]">-</p>
          )}
        </div>
        <div>
          <p className="text-xs text-[var(--text-muted)]">电话</p>
          <p className="text-sm text-[var(--text-dark)]">
            {submission.phone || "-"}
          </p>
        </div>
        <div>
          <p className="text-xs text-[var(--text-muted)]">公司</p>
          <p className="text-sm text-[var(--text-dark)]">
            {submission.company || "-"}
          </p>
        </div>
        <div>
          <p className="text-xs text-[var(--text-muted)]">状态</p>
          <StatusBadge
            status={submission.status as "new" | "processing" | "replied"}
          />
        </div>
      </div>

      {/* Message */}
      <div className="mb-6">
        <p className="mb-2 text-xs text-[var(--text-muted)]">需求描述</p>
        <div className="rounded-lg bg-gray-50 p-4">
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-[var(--text-dark)]">
            {submission.message}
          </p>
        </div>
      </div>

      {/* Notes History */}
      {noteHistory.length > 0 && (
        <div className="mb-6">
          <p className="mb-3 text-xs text-[var(--text-muted)]">
            备注历史（{noteHistory.length} 条）
          </p>
          <div className="max-h-64 space-y-2 overflow-y-auto rounded-lg border border-gray-100 p-3">
            {noteHistory.map((note) => (
              <div
                key={note.id}
                className="rounded-lg bg-gray-50 p-3"
              >
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-[var(--text-dark)]">
                  {note.content}
                </p>
                <p className="mt-1.5 flex items-center gap-1 text-xs text-[var(--text-muted)]">
                  <Clock className="h-3 w-3" />
                  {new Date(note.createdAt).toLocaleString("zh-CN", {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* New Note Form */}
      <div>
        <p className="mb-2 text-xs text-[var(--text-muted)]">添加备注</p>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm transition-colors focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
          placeholder="输入新的内部备注..."
        />
        <button
          onClick={handleSave}
          disabled={saving || !notes.trim()}
          className="mt-2 inline-flex items-center gap-2 rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white transition-all hover:bg-blue-700 disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          {saving ? "保存中..." : "添加备注"}
        </button>
      </div>
    </div>
  );
}
