"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import ImageExtension from "@tiptap/extension-image";
import LinkExtension from "@tiptap/extension-link";
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  List,
  ListOrdered,
  Link as LinkIcon,
  Heading1,
  Heading2,
  Heading3,
  Undo,
  Redo,
  Image as ImageIcon,
  Upload,
} from "lucide-react";
import { useCallback, useState } from "react";

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
}

/** 上传单个图片文件，返回 URL */
async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch("/api/admin/upload", {
    method: "POST",
    credentials: "include",
    body: formData,
  });
  if (!res.ok) throw new Error("上传失败");
  const data = await res.json();
  return data.url;
}

export default function RichTextEditor({ content, onChange }: RichTextEditorProps) {
  const [uploading, setUploading] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      ImageExtension.configure({
        HTMLAttributes: { class: "rounded-lg max-w-full my-4" },
      }),
      LinkExtension.configure({
        openOnClick: false,
        HTMLAttributes: { class: "text-blue-500 underline" },
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      handlePaste: (view, event) => {
        const items = event.clipboardData?.items;
        if (!items) return false;

        // 检查剪贴板中是否有图片
        for (const item of Array.from(items)) {
          if (item.type.startsWith("image/")) {
            const file = item.getAsFile();
            if (file) {
              setUploading(true);
              uploadImage(file)
                .then((url) => {
                  editor?.chain().focus().setImage({ src: url }).run();
                  setUploading(false);
                })
                .catch(() => setUploading(false));
              return true; // 阻止默认粘贴行为
            }
          }
        }
        return false; // 让 TipTap 处理非图片内容
      },
      handleDrop: (view, event) => {
        const files = event.dataTransfer?.files;
        if (!files) return false;

        for (const file of Array.from(files)) {
          if (file.type.startsWith("image/")) {
            setUploading(true);
            uploadImage(file)
              .then((url) => {
                editor?.chain().focus().setImage({ src: url }).run();
                setUploading(false);
              })
              .catch(() => setUploading(false));
            return true;
          }
        }
        return false;
      },
    },
  });

  const addImageByFile = useCallback(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file || !editor) return;
      setUploading(true);
      try {
        const url = await uploadImage(file);
        editor.chain().focus().setImage({ src: url }).run();
      } catch {
        // 忽略
      } finally {
        setUploading(false);
      }
    };
    input.click();
  }, [editor]);

  const addLink = useCallback(() => {
    if (!editor) return;
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("请输入链接URL", previousUrl);
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
    } else {
      editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
    }
  }, [editor]);

  if (!editor) {
    return (
      <div className="flex h-48 items-center justify-center rounded-lg border border-gray-200 bg-gray-50">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-200 border-t-[var(--accent)]" />
      </div>
    );
  }

  const btnClass = (active: boolean) =>
    `rounded p-1.5 transition-colors ${
      active ? "bg-blue-100 text-[var(--accent)]" : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
    }`;

  return (
    <div className="rounded-lg border border-gray-200 overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 border-b border-gray-200 bg-gray-50 px-3 py-2">
        <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={btnClass(editor.isActive("bold"))} title="加粗">
          <Bold className="h-4 w-4" />
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={btnClass(editor.isActive("italic"))} title="斜体">
          <Italic className="h-4 w-4" />
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleStrike().run()} className={btnClass(editor.isActive("strike"))} title="删除线">
          <Strikethrough className="h-4 w-4" />
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleCode().run()} className={btnClass(editor.isActive("code"))} title="行内代码">
          <Code className="h-4 w-4" />
        </button>

        <div className="mx-1 h-5 w-px bg-gray-300" />

        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={btnClass(editor.isActive("heading", { level: 1 }))} title="一级标题">
          <Heading1 className="h-4 w-4" />
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={btnClass(editor.isActive("heading", { level: 2 }))} title="二级标题">
          <Heading2 className="h-4 w-4" />
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={btnClass(editor.isActive("heading", { level: 3 }))} title="三级标题">
          <Heading3 className="h-4 w-4" />
        </button>

        <div className="mx-1 h-5 w-px bg-gray-300" />

        <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={btnClass(editor.isActive("bulletList"))} title="无序列表">
          <List className="h-4 w-4" />
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={btnClass(editor.isActive("orderedList"))} title="有序列表">
          <ListOrdered className="h-4 w-4" />
        </button>

        <div className="mx-1 h-5 w-px bg-gray-300" />

        <button type="button" onClick={addImageByFile} className="rounded p-1.5 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700" title="上传图片">
          <ImageIcon className="h-4 w-4" />
        </button>
        <button type="button" onClick={addLink} className={btnClass(editor.isActive("link"))} title="插入链接">
          <LinkIcon className="h-4 w-4" />
        </button>

        {uploading && (
          <span className="ml-1 inline-flex items-center gap-1 text-xs text-[var(--accent)]">
            <Upload className="h-3 w-3 animate-pulse" />
            上传中...
          </span>
        )}

        <div className="mx-1 h-5 w-px bg-gray-300" />

        <button type="button" onClick={() => editor.chain().focus().undo().run()} className="rounded p-1.5 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700" title="撤销">
          <Undo className="h-4 w-4" />
        </button>
        <button type="button" onClick={() => editor.chain().focus().redo().run()} className="rounded p-1.5 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700" title="重做">
          <Redo className="h-4 w-4" />
        </button>
      </div>

      {/* Editor Area */}
      <div className="prose prose-sm max-w-none p-4 min-h-[300px] focus:outline-none [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mt-4 [&_h1]:mb-2 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mt-4 [&_h2]:mb-2 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:mt-3 [&_h3]:mb-1 [&_p]:my-2 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:my-1 [&_blockquote]:border-l-4 [&_blockquote]:border-gray-300 [&_blockquote]:pl-4 [&_blockquote]:text-gray-500 [&_pre]:bg-gray-900 [&_pre]:text-gray-100 [&_pre]:rounded-lg [&_pre]:p-4 [&_pre]:overflow-x-auto [&_code]:bg-gray-100 [&_code]:rounded [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-sm [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_img]:rounded-lg [&_img]:max-w-full [&_a]:text-blue-500 [&_a]:underline">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
