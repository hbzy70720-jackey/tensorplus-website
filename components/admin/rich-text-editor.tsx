"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import { BubbleMenu, FloatingMenu } from "@tiptap/react/menus";
import StarterKit from "@tiptap/starter-kit";
import ImageExtension from "@tiptap/extension-image";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import { Highlight } from "@tiptap/extension-highlight";
import { FontFamily } from "@tiptap/extension-font-family";
import { Table, TableRow, TableCell, TableHeader } from "@tiptap/extension-table";
import { Extension } from "@tiptap/core";
import {
  Bold,
  Italic,
  Underline,
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
  Palette,
  Highlighter,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  IndentIncrease,
  Minus,
  RemoveFormatting,
  Plus,
  Quote,
  Code2,
  Table2,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useCallback, useState } from "react";

/** 统一管理段落级样式（line-height / text-indent / text-align），
 *  避免多个扩展的 style 属性互相覆盖。 */
const ParagraphStyle = Extension.create({
  name: "paragraphStyle",
  addGlobalAttributes() {
    return [
      {
        types: ["paragraph", "heading"],
        attributes: {
          paraStyle: {
            default: null,
            parseHTML: (el) => {
              const parts: string[] = [];
              const lh = el.style.lineHeight;
              const ti = el.style.textIndent;
              const ta = el.style.textAlign;
              if (lh) parts.push(`line-height:${lh}`);
              if (ti) parts.push(`text-indent:${ti}`);
              if (ta && ta !== "left") parts.push(`text-align:${ta}`);
              return parts.length ? parts.join(";") : null;
            },
            renderHTML: (attrs) => {
              if (!attrs.paraStyle) return {};
              const styles: string[] = [];
              for (const part of (attrs.paraStyle as string).split(";")) {
                const [key, val] = part.split(":");
                if (key === "line-height") styles.push(`line-height:${val}`);
                if (key === "text-indent") styles.push(`text-indent:${val}`);
                if (key === "text-align") styles.push(`text-align:${val}`);
              }
              return styles.length ? { style: styles.join(";") } : {};
            },
          },
        },
      },
    ];
  },
});

/** 字号扩展：给文本样式（textStyle）增加 font-size 属性，支持 Word 粘贴字号保留 */
const FontSize = Extension.create({
  name: "fontSize",
  addGlobalAttributes() {
    return [
      {
        types: ["textStyle"],
        attributes: {
          fontSize: {
            default: null,
            parseHTML: (el) => el.style.fontSize || null,
            renderHTML: (attrs) => {
              if (!attrs.fontSize) return {};
              return { style: `font-size:${attrs.fontSize}` };
            },
          },
        },
      },
    ];
  },
});

/** 文字颜色色板（参考微信的常用色） */
const TEXT_COLORS = [
  "#000000", "#333333", "#595959", "#808080", "#999999", "#bfbfbf",
  "#d32f2f", "#ff4d4f", "#ff7a45", "#fa8c16", "#fadb14", "#a0d911",
  "#52c41a", "#13c2c2", "#1890ff", "#2f54eb", "#722ed1", "#eb2f96",
];

/** 高亮（背景）色板 —— 浅色系 */
const HIGHLIGHT_COLORS = [
  "#ffff00", "#ffd591", "#ffadd2", "#ff9c6e", "#b7eb8f", "#87e8de",
  "#91d5ff", "#adc6ff", "#d3adf7", "#fff1b8", "#f4ffb8", "#e6fffb",
];

/** 字号档位（参考微信的 7 档） */
const FONT_SIZES = ["12px", "14px", "16px", "18px", "20px", "24px", "30px"];

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
}

/** 插入菜单可插入的块类型 */
type InsertBlockType =
  | "h1" | "h2" | "h3"
  | "bulletList" | "orderedList"
  | "blockquote" | "codeBlock" | "hr" | "table";

/** 插入菜单项 */
function InsertItem({
  icon: Icon,
  label,
  onClick,
}: {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm text-gray-700 hover:bg-gray-100"
    >
      <Icon className="h-4 w-4 shrink-0 text-gray-400" />
      {label}
    </button>
  );
}

/** 将 hex 字符串解码为字节数组（RTF 图片数据） */
function hexToBytes(hex: string): ArrayBuffer {
  const len = Math.floor(hex.length / 2);
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = parseInt(hex.substr(i * 2, 2), 16);
  }
  return bytes.buffer as ArrayBuffer;
}

/** 从 RTF 剪贴板数据中提取图片。
 *  Word 复制图文混排时，图片二进制以 {\pict ...} 块的形式内嵌在 RTF 里，
 *  而 HTML 里只有指向本地临时文件的 file:// 引用（浏览器读不到），
 *  所以 RTF 是拿到图片的唯一可靠来源。 */
function extractImagesFromRtf(rtf: string): File[] {
  const files: File[] = [];
  let idx = 0;
  let blockCount = 0;
  const MAX_BLOCKS = 30; // 保护：最多处理 30 个图片块

  while (idx < rtf.length && blockCount < MAX_BLOCKS) {
    const pictStart = rtf.indexOf("{\\pict", idx);
    if (pictStart < 0) break;
    blockCount++;

    // 平衡括号，找到图片块的闭合位置
    let depth = 0;
    let end = -1;
    for (let i = pictStart + 1; i < rtf.length; i++) {
      if (rtf[i] === "{") depth++;
      else if (rtf[i] === "}") {
        if (depth === 0) {
          end = i;
          break;
        }
        depth--;
      }
    }
    if (end < 0) break;

    const block = rtf.substring(pictStart, end + 1);

    // 只处理浏览器能渲染的 PNG / JPEG；WMF / EMF 无法用 <img> 显示，跳过
    let mime = "";
    if (/\\pngblip/.test(block)) mime = "image/png";
    else if (/\\jpegblip/.test(block)) mime = "image/jpeg";

    if (mime) {
      // 去掉所有 RTF 控制字，剩下的连续十六进制字符就是图片数据
      const hex = block
        .replace(/\\[a-zA-Z]+-?\d*\s?/g, "") // 控制字，如 \picwgoal1024
        .replace(/\\'[0-9a-fA-F]{2}/g, "") // 十六进制转义 \'xx
        .replace(/\\[^a-zA-Z]/g, "") // 其它转义，如 \*
        .replace(/[^0-9a-fA-F]/g, ""); // 只保留 hex

      // PNG 魔数 89504e47，JPEG 魔数 ffd8ff —— 校验确认提取完整
      const isPng = hex.startsWith("89504e47");
      const isJpeg = hex.startsWith("ffd8ff");
      if (hex.length >= 130 && (isPng || isJpeg)) {
        try {
          const bytes = hexToBytes(hex);
          const ext = isJpeg ? "jpg" : "png";
          files.push(
            new File([bytes], `paste-image-${files.length + 1}.${ext}`, {
              type: mime,
            })
          );
        } catch {
          /* 图片损坏则跳过 */
        }
      }
    }

    idx = end + 1;
  }

  return files;
}

/** 将 base64 data URI 转换为 Blob（网页复制图片时用） */
function dataUriToBlob(dataUri: string): Blob {
  const [header, base64] = dataUri.split(",");
  const mime = header.match(/:(.*?);/)?.[1] || "image/png";
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new Blob([bytes], { type: mime });
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

/** 把 HTML 里的所有图片占位符（VML / file:// / data: / 无 src）统一替换成
 *  带序号的标记 <img src="__PIC_n__">，保证后续按文档顺序填入真实图片 URL。 */
function replaceWordImagesWithPlaceholders(html: string): string {
  let counter = 0;
  const next = () => `<img src="__PIC_${counter++}__">`;

  return html
    // 1) VML 形状块（含嵌套 imagedata）整体替换
    .replace(/<v:shape[^>]*>[\s\S]*?<\/v:shape>/gi, next)
    // 2) 独立 imagedata
    .replace(/<v:imagedata[^>]*\/?>[\s\S]*?<\/v:imagedata>/gi, next)
    .replace(/<v:imagedata[^>]*\/?>/gi, next)
    // 3) file:// 本地路径图片
    .replace(/<img[^>]*src\s*=\s*["']file:\/\/[^"']*["'][^>]*>/gi, next)
    // 4) data: 内联图片
    .replace(/<img[^>]*src\s*=\s*["']data:image\/[^"']*["'][^>]*>/gi, next)
    // 5) 无 src 的 img
    .replace(/<img(?![^>]*\bsrc\s*=)[^>]*>/gi, next);
}

/** 把 __PIC_n__ 占位符按顺序替换为真实上传后的 URL；没有对应 URL 的占位符删除。 */
function fillImagePlaceholders(html: string, urls: string[]): string {
  let i = 0;
  return html.replace(
    /<img[^>]*src\s*=\s*["']__PIC_(\d+)__["'][^>]*>/g,
    () => {
      const url = urls[i++];
      return url
        ? `<img src="${url}" class="rounded-lg max-w-full my-4">`
        : "";
    }
  );
}

/** 清理 Word 粘贴产生的垃圾代码：去掉 mso-* 样式、VML 残留、命名空间、
 *  Office 属性、空标签，但保留字号/颜色/字体等有用格式。 */
function cleanWordHtml(html: string): string {
  return html
    // Word 条件注释
    .replace(/<!--\[if [^\]]*\]>[\s\S]*?<!\[endif\]-->/gi, "")
    // 残留 VML / Office 形状标签
    .replace(/<v:[^>]+>[\s\S]*?<\/v:[^>]+>/gi, "")
    .replace(/<v:[^>]+\/>/gi, "")
    .replace(/<o:[^>]+>[\s\S]*?<\/o:[^>]+>/gi, "")
    .replace(/<o:[^>]+\/>/gi, "")
    // style 里去掉 mso-* / theme-* / text-underline，保留 font-size、color 等
    .replace(/(style\s*=\s*")([^"]*)(")/gi, (_m, p1: string, s: string, p3: string) => {
      const cleaned = s
        .replace(/[^;]*mso-[^;]*;?/gi, "")
        .replace(/[^;]*theme[^;]*;?/gi, "")
        .replace(/text-underline:\s*[^;]*;?/gi, "")
        .replace(/\s*;\s*/g, ";")
        .replace(/^;+|;+$/g, "");
      return cleaned ? `${p1}${cleaned}${p3}` : "";
    })
    // mso-* class
    .replace(/class\s*=\s*"[^"]*Mso[^"]*"/gi, "")
    .replace(/class\s*=\s*"[^"]*mso[^"]*"/gi, "")
    // Word 命名空间与 Office/Word 属性
    .replace(/\s*xmlns:[a-z]+\s*=\s*"[^"]*"/gi, "")
    .replace(/\s+[ow]:[a-z-]+\s*=\s*"[^"]*"/gi, "")
    // 空 span 标签
    .replace(/<span[^>]*>\s*<\/span>/gi, "")
    // 多余空白
    .replace(/\s{2,}/g, " ");
}

export default function RichTextEditor({ content, onChange }: RichTextEditorProps) {
  const [uploading, setUploading] = useState(false);
  const [openPicker, setOpenPicker] = useState<null | "color" | "highlight">(null);
  const [openInsert, setOpenInsert] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        link: {
          openOnClick: false,
          HTMLAttributes: { class: "text-blue-500 underline" },
        },
        underline: {},
      }),
      ParagraphStyle,
      FontSize,
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      FontFamily,
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableCell,
      TableHeader,
      ImageExtension.configure({
        HTMLAttributes: { class: "rounded-lg max-w-full my-4" },
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      // 普通网页/文本粘贴走默认流程时，先清理 Word 格式
      transformPastedHTML: (html: string) => cleanWordHtml(html),
      handlePaste: (view, event) => {
        const clipboardData = event.clipboardData;
        if (!clipboardData) return false;

        const html = clipboardData.getData("text/html");

        // 收集剪贴板里的图片文件（items + files 两个来源）
        const imageFiles: File[] = [];
        for (const item of Array.from(clipboardData.items)) {
          if (item.type.startsWith("image/")) {
            const file = item.getAsFile();
            if (file) imageFiles.push(file);
          }
        }
        if (clipboardData.files?.length) {
          for (const f of Array.from(clipboardData.files)) {
            if (f.type.startsWith("image/")) imageFiles.push(f);
          }
        }

        // 纯图片粘贴（无 HTML，只有图片文件）
        if (imageFiles.length > 0 && !html) {
          event.preventDefault();
          setUploading(true);
          (async () => {
            for (const file of imageFiles) {
              try {
                const url = await uploadImage(file);
                editor?.chain().focus().setImage({ src: url }).run();
              } catch {
                /* 单张失败跳过 */
              }
            }
            setUploading(false);
          })();
          return true;
        }

        // 图文混排（含 HTML）
        if (html) {
          // 剪贴板没有独立图片文件时，从 RTF 提取（Word 内嵌图片的唯一来源）
          if (imageFiles.length === 0) {
            const rtf = clipboardData.getData("text/rtf");
            if (rtf) imageFiles.push(...extractImagesFromRtf(rtf));
          }

          // 网页粘贴的 data: 内联图片也转成文件统一上传
          const dataTags = html.match(/<img[^>]*src\s*=\s*["'](data:image\/[^"']+)["']/gi) || [];
          for (const tag of dataTags) {
            const m = tag.match(/src\s*=\s*["'](data:image\/[^"']+)["']/i);
            if (m) {
              try {
                const blob = dataUriToBlob(m[1]);
                imageFiles.push(
                  new File([blob], `pasted-${imageFiles.length}.png`, { type: blob.type })
                );
              } catch {
                /* 无法解析则跳过 */
              }
            }
          }

          const hasImage =
            /<img[^>]*>/i.test(html) || /<v:imagedata/i.test(html) || /<!--\[if/i.test(html);

          // 含图片或来自 Word → 拦截处理
          if (imageFiles.length > 0 || hasImage) {
            event.preventDefault();
            setUploading(true);
            (async () => {
              try {
                // 上传所有图片，得到真实 URL
                const urls: string[] = [];
                for (const file of imageFiles) {
                  try {
                    const url = await uploadImage(file);
                    if (url) urls.push(url);
                  } catch {
                    /* 单张失败跳过 */
                  }
                }

                // 占位符化 → 清理垃圾 → 填回真实 URL
                let processed = replaceWordImagesWithPlaceholders(html);
                processed = cleanWordHtml(processed);
                processed = fillImagePlaceholders(processed, urls);

                editor?.commands.insertContent(processed);
              } catch {
                /* 整体失败时忽略，保留默认粘贴 */
              }
              setUploading(false);
            })();
            return true;
          }
        }

        // 普通文本 / 网页粘贴 → 交给默认流程处理
        return false;
      },
      handleDrop: (view, event) => {
        const files = event.dataTransfer?.files;
        if (!files) return false;

        const imageFiles = Array.from(files).filter((f) =>
          f.type.startsWith("image/")
        );
        if (imageFiles.length === 0) return false;

        event.preventDefault();
        setUploading(true);
        (async () => {
          try {
            for (const file of imageFiles) {
              const url = await uploadImage(file);
              editor?.chain().focus().setImage({ src: url }).run();
            }
          } catch {
            /* ignore */
          }
          setUploading(false);
        })();
        return true;
      },
    },
  });

  const applyAlign = useCallback(
    (alignment: string) => {
      if (!editor) return;
      const attrs = editor.getAttributes("paragraph");
      const current = (attrs.paraStyle || "") as string;
      const parts = current
        .split(";")
        .filter((p: string) => p && !p.startsWith("text-align:"));
      if (alignment !== "left") {
        parts.push(`text-align:${alignment}`);
      }
      const newStyle = parts.join(";") || null;
      editor.chain().focus().updateAttributes("paragraph", { paraStyle: newStyle }).run();
    },
    [editor]
  );

  /** 首行缩进：段落开头空两格（中文排版常用） */
  const toggleIndent = useCallback(() => {
    if (!editor) return;
    const attrs = editor.getAttributes("paragraph");
    const current = (attrs.paraStyle || "") as string;
    const parts = current
      .split(";")
      .filter((p: string) => p && !p.startsWith("text-indent:"));
    if (!current.includes("text-indent:")) {
      parts.push("text-indent:2em");
    }
    editor.chain().focus().updateAttributes("paragraph", { paraStyle: parts.join(";") || null }).run();
  }, [editor]);

  /** 设置字号（合并保留其它文本样式，如颜色） */
  const setFontSize = useCallback(
    (fontSize: string) => {
      if (!editor) return;
      const current = editor.getAttributes("textStyle");
      editor
        .chain()
        .focus()
        .setMark("textStyle", { ...current, fontSize: fontSize || null })
        .run();
    },
    [editor]
  );

  /** 清除格式：去掉选中文字的加粗/颜色/字号等，恢复默认（保留标题、列表结构） */
  const clearFormatting = useCallback(() => {
    editor?.chain().focus().unsetAllMarks().run();
  }, [editor]);

  const applyColor = useCallback(
    (color: string) => {
      editor?.chain().focus().setColor(color).run();
      setOpenPicker(null);
    },
    [editor]
  );

  const unsetColor = useCallback(() => {
    editor?.chain().focus().unsetColor().run();
    setOpenPicker(null);
  }, [editor]);

  const applyHighlight = useCallback(
    (color: string) => {
      editor?.chain().focus().toggleHighlight({ color }).run();
      setOpenPicker(null);
    },
    [editor]
  );

  const unsetHighlight = useCallback(() => {
    editor?.chain().focus().unsetHighlight().run();
    setOpenPicker(null);
  }, [editor]);

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
        /* ignore */
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
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: url })
        .run();
    }
  }, [editor]);

  /** 插入块级内容（标题/列表/引用/代码块/分割线/表格），插入后关闭菜单 */
  const insertBlock = useCallback(
    (type: InsertBlockType) => {
      if (!editor) return;
      const chain = editor.chain().focus();
      switch (type) {
        case "h1": chain.toggleHeading({ level: 1 }).run(); break;
        case "h2": chain.toggleHeading({ level: 2 }).run(); break;
        case "h3": chain.toggleHeading({ level: 3 }).run(); break;
        case "bulletList": chain.toggleBulletList().run(); break;
        case "orderedList": chain.toggleOrderedList().run(); break;
        case "blockquote": chain.toggleBlockquote().run(); break;
        case "codeBlock": chain.toggleCodeBlock().run(); break;
        case "hr": chain.setHorizontalRule().run(); break;
        case "table": chain.insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run(); break;
      }
      setOpenInsert(false);
    },
    [editor]
  );

  if (!editor) {
    return (
      <div className="flex h-48 items-center justify-center rounded-lg border border-gray-200 bg-gray-50">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-200 border-t-[var(--accent)]" />
      </div>
    );
  }

  const btnClass = (active: boolean) =>
    `rounded p-1.5 transition-colors ${
      active
        ? "bg-blue-100 text-[var(--accent)]"
        : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
    }`;

  const menuBtnClass = (active: boolean) =>
    `rounded p-1.5 transition-colors ${
      active
        ? "bg-gray-100 text-[var(--accent)]"
        : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
    }`;

  const currentParaStyle = (editor.getAttributes("paragraph").paraStyle || "") as string;
  const currentFontSize = (editor.getAttributes("textStyle").fontSize as string) || "";
  const charCount = editor.getText().replace(/\s/g, "").length;

  return (
    <div className="relative rounded-xl border border-gray-200 bg-white shadow-sm">
      {/* 顶部精简工具栏 */}
      <div className="flex flex-wrap items-center gap-1 border-b border-gray-200 bg-gray-50/80 px-3 py-2">
        {/* 撤销/重做 */}
        <button type="button" onClick={() => editor.chain().focus().undo().run()} className="rounded p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700" title="撤销">
          <Undo className="h-4 w-4" />
        </button>
        <button type="button" onClick={() => editor.chain().focus().redo().run()} className="rounded p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700" title="重做">
          <Redo className="h-4 w-4" />
        </button>

        <div className="mx-1 h-5 w-px bg-gray-300" />

        {/* 字号 */}
        <select
          value={currentFontSize}
          onChange={(e) => setFontSize(e.target.value)}
          className="h-7 rounded border border-gray-200 bg-white px-1 text-xs text-gray-600 focus:outline-none"
          title="字号"
        >
          <option value="">字号</option>
          {FONT_SIZES.map((size) => (
            <option key={size} value={size}>
              {parseInt(size)}
            </option>
          ))}
        </select>

        <div className="mx-1 h-5 w-px bg-gray-300" />

        {/* 文本格式 */}
        <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={btnClass(editor.isActive("bold"))} title="加粗">
          <Bold className="h-4 w-4" />
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={btnClass(editor.isActive("italic"))} title="斜体">
          <Italic className="h-4 w-4" />
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleUnderline().run()} className={btnClass(editor.isActive("underline"))} title="下划线">
          <Underline className="h-4 w-4" />
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleStrike().run()} className={btnClass(editor.isActive("strike"))} title="删除线">
          <Strikethrough className="h-4 w-4" />
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleCode().run()} className={btnClass(editor.isActive("code"))} title="行内代码">
          <Code className="h-4 w-4" />
        </button>

        <div className="mx-1 h-5 w-px bg-gray-300" />

        {/* 文字颜色（色板） */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setOpenPicker(openPicker === "color" ? null : "color")}
            className={btnClass(editor.isActive("textStyle", { color: editor.getAttributes("textStyle").color }))}
            title="文字颜色"
          >
            <Palette className="h-4 w-4" />
          </button>
          {openPicker === "color" && (
            <div className="absolute left-0 top-full z-30 mt-1 w-[190px] rounded-lg border border-gray-200 bg-white p-2 shadow-lg">
              <div className="mb-1 flex items-center justify-between px-1">
                <span className="text-xs text-gray-500">文字颜色</span>
                <button type="button" onClick={unsetColor} className="rounded px-1.5 py-0.5 text-xs text-gray-400 hover:bg-gray-100">
                  默认
                </button>
              </div>
              <div className="grid grid-cols-6 gap-1">
                {TEXT_COLORS.map((c) => (
                  <button key={c} type="button" onClick={() => applyColor(c)} className="h-6 w-6 rounded border border-gray-100 hover:scale-110 transition-transform" style={{ backgroundColor: c }} title={c} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 高亮（色板） */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setOpenPicker(openPicker === "highlight" ? null : "highlight")}
            className={btnClass(editor.isActive("highlight"))}
            title="背景高亮"
          >
            <Highlighter className="h-4 w-4" />
          </button>
          {openPicker === "highlight" && (
            <div className="absolute left-0 top-full z-30 mt-1 w-[190px] rounded-lg border border-gray-200 bg-white p-2 shadow-lg">
              <div className="mb-1 flex items-center justify-between px-1">
                <span className="text-xs text-gray-500">背景高亮</span>
                <button type="button" onClick={unsetHighlight} className="rounded px-1.5 py-0.5 text-xs text-gray-400 hover:bg-gray-100">
                  默认
                </button>
              </div>
              <div className="grid grid-cols-6 gap-1">
                {HIGHLIGHT_COLORS.map((c) => (
                  <button key={c} type="button" onClick={() => applyHighlight(c)} className="h-6 w-6 rounded border border-gray-100 hover:scale-110 transition-transform" style={{ backgroundColor: c }} title={c} />
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="mx-1 h-5 w-px bg-gray-300" />

        {/* 对齐 & 缩进 */}
        <button type="button" onClick={() => applyAlign("left")} className={btnClass(currentParaStyle.includes("text-align:left") || !currentParaStyle.includes("text-align:"))} title="左对齐">
          <AlignLeft className="h-4 w-4" />
        </button>
        <button type="button" onClick={() => applyAlign("center")} className={btnClass(currentParaStyle.includes("text-align:center"))} title="居中">
          <AlignCenter className="h-4 w-4" />
        </button>
        <button type="button" onClick={() => applyAlign("right")} className={btnClass(currentParaStyle.includes("text-align:right"))} title="右对齐">
          <AlignRight className="h-4 w-4" />
        </button>
        <button type="button" onClick={() => applyAlign("justify")} className={btnClass(currentParaStyle.includes("text-align:justify"))} title="两端对齐">
          <AlignJustify className="h-4 w-4" />
        </button>
        <button type="button" onClick={toggleIndent} className={btnClass(currentParaStyle.includes("text-indent:"))} title="首行缩进">
          <IndentIncrease className="h-4 w-4" />
        </button>

        <div className="mx-1 h-5 w-px bg-gray-300" />

        {/* 图片 & 链接 */}
        <button type="button" onClick={addImageByFile} className="rounded p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700" title="上传图片">
          <ImageIcon className="h-4 w-4" />
        </button>
        <button type="button" onClick={addLink} className={btnClass(editor.isActive("link"))} title="插入链接">
          <LinkIcon className="h-4 w-4" />
        </button>

        <div className="mx-1 h-5 w-px bg-gray-300" />

        {/* 清除格式 */}
        <button type="button" onClick={clearFormatting} className="rounded p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700" title="清除格式">
          <RemoveFormatting className="h-4 w-4" />
        </button>
      </div>

      {/* 选中文字 → 气泡工具栏 */}
      <BubbleMenu
        editor={editor}
        shouldShow={({ editor }) =>
          !editor.state.selection.empty && !editor.isActive("codeBlock")
        }
        options={{ placement: "top", offset: 8 }}
      >
        <div className="flex items-center gap-0.5 rounded-lg border border-gray-200 bg-white p-1 shadow-lg">
          <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={menuBtnClass(editor.isActive("bold"))} title="加粗">
            <Bold className="h-4 w-4" />
          </button>
          <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={menuBtnClass(editor.isActive("italic"))} title="斜体">
            <Italic className="h-4 w-4" />
          </button>
          <button type="button" onClick={() => editor.chain().focus().toggleUnderline().run()} className={menuBtnClass(editor.isActive("underline"))} title="下划线">
            <Underline className="h-4 w-4" />
          </button>
          <button type="button" onClick={() => editor.chain().focus().toggleStrike().run()} className={menuBtnClass(editor.isActive("strike"))} title="删除线">
            <Strikethrough className="h-4 w-4" />
          </button>
          <button type="button" onClick={() => editor.chain().focus().toggleCode().run()} className={menuBtnClass(editor.isActive("code"))} title="行内代码">
            <Code className="h-4 w-4" />
          </button>
          <button type="button" onClick={addLink} className={menuBtnClass(editor.isActive("link"))} title="链接">
            <LinkIcon className="h-4 w-4" />
          </button>
          <div className="mx-1 h-4 w-px bg-gray-200" />
          <button type="button" onClick={clearFormatting} className="rounded p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700" title="清除格式">
            <RemoveFormatting className="h-4 w-4" />
          </button>
        </div>
      </BubbleMenu>

      {/* 空段落 → + 号插入菜单 */}
      <FloatingMenu
        editor={editor}
        shouldShow={({ editor }) => {
          if (editor.isActive("codeBlock")) return false;
          const { $from } = editor.state.selection;
          const node = $from.parent;
          return node.type.name === "paragraph" && node.content.size === 0;
        }}
        options={{ placement: "left-start", offset: 6 }}
      >
        <div className="relative">
          {openInsert ? (
            <div className="w-56 overflow-hidden rounded-lg border border-gray-200 bg-white p-1 shadow-xl">
              <div className="px-2 py-1 text-[11px] text-gray-400">标题</div>
              <InsertItem icon={Heading1} label="一级标题" onClick={() => insertBlock("h1")} />
              <InsertItem icon={Heading2} label="二级标题" onClick={() => insertBlock("h2")} />
              <InsertItem icon={Heading3} label="三级标题" onClick={() => insertBlock("h3")} />
              <div className="mx-2 my-1 border-t border-gray-100" />
              <div className="px-2 py-1 text-[11px] text-gray-400">列表与内容</div>
              <InsertItem icon={List} label="无序列表" onClick={() => insertBlock("bulletList")} />
              <InsertItem icon={ListOrdered} label="有序列表" onClick={() => insertBlock("orderedList")} />
              <InsertItem icon={Quote} label="引用" onClick={() => insertBlock("blockquote")} />
              <InsertItem icon={Code2} label="代码块" onClick={() => insertBlock("codeBlock")} />
              <InsertItem icon={Minus} label="分割线" onClick={() => insertBlock("hr")} />
              <div className="mx-2 my-1 border-t border-gray-100" />
              <InsertItem icon={ImageIcon} label="图片" onClick={addImageByFile} />
              <InsertItem icon={Table2} label="表格（3×3）" onClick={() => insertBlock("table")} />
            </div>
          ) : (
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => setOpenInsert(true)}
              className="flex h-6 w-6 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-500 shadow-sm hover:bg-gray-100 hover:text-gray-700"
              title="插入内容"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </FloatingMenu>

      {/* 编辑区（沉浸式居中） */}
      <div className="prose prose-sm mx-auto w-full max-w-[760px] min-h-[320px] p-5 focus:outline-none
        [&_table]:w-full [&_table]:border-collapse [&_table]:my-4 [&_table]:text-sm
        [&_th]:border [&_th]:border-gray-300 [&_th]:bg-gray-50 [&_th]:px-3 [&_th]:py-2 [&_th]:text-left [&_th]:font-semibold
        [&_td]:border [&_td]:border-gray-300 [&_td]:px-3 [&_td]:py-2
        [&_tr:nth-child(even)_td]:bg-gray-50/50
        [&_.selectedCell]:bg-blue-50
        [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mt-4 [&_h1]:mb-2
        [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mt-4 [&_h2]:mb-2
        [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:mt-3 [&_h3]:mb-1
        [&_p]:my-2
        [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:my-1
        [&_blockquote]:border-l-4 [&_blockquote]:border-gray-300 [&_blockquote]:pl-4 [&_blockquote]:text-gray-500
        [&_pre]:bg-gray-900 [&_pre]:text-gray-100 [&_pre]:rounded-lg [&_pre]:p-4 [&_pre]:overflow-x-auto
        [&_code]:bg-gray-100 [&_code]:rounded [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-sm
        [&_pre_code]:bg-transparent [&_pre_code]:p-0
        [&_img]:rounded-lg [&_img]:max-w-full
        [&_a]:text-blue-500 [&_a]:underline
        [&_hr]:border-t [&_hr]:border-gray-200 [&_hr]:my-6
      ">
        <EditorContent editor={editor} />
      </div>

      {/* 底部：字数统计 */}
      <div className="flex items-center justify-between border-t border-gray-100 px-4 py-2 text-xs text-gray-400">
        <span>段首「+」号可插入标题、列表、图片等</span>
        <span className="inline-flex items-center gap-1">
          {uploading ? (
            <>
              <Upload className="h-3 w-3 animate-pulse" />
              上传中...
            </>
          ) : (
            `约 ${charCount} 字`
          )}
        </span>
      </div>
    </div>
  );
}
