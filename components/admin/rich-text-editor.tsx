"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import ImageExtension from "@tiptap/extension-image";
import LinkExtension from "@tiptap/extension-link";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import { Highlight } from "@tiptap/extension-highlight";
import { FontFamily } from "@tiptap/extension-font-family";
import { Underline as UnderlineExt } from "@tiptap/extension-underline";
import { Table, TableRow, TableCell, TableHeader } from "@tiptap/extension-table";
import { Extension } from "@tiptap/core";

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
              // 拆分回独立样式
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
  Palette,
  Highlighter,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Underline,
} from "lucide-react";
import { useCallback, useState } from "react";

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
}

/** 从 RTF 剪贴板数据中提取图片（Word 图片通过 VML+RTF 方式粘贴时用） */
function extractImagesFromRtf(rtf: string, debug?: (msg: string) => void): File[] {
  const files: File[] = [];

  // 手动解析 {\pict ...} 块（处理嵌套 + 大量 hex 数据）
  let idx = 0;
  let blockCount = 0;
  const MAX_BLOCKS = 20; // 保护：最多处理20个块
  while (idx < rtf.length && blockCount < MAX_BLOCKS) {
    const pictStart = rtf.indexOf("{\\pict", idx);
    if (pictStart < 0) break;
    idx = pictStart + 1;
    blockCount++;

    // 平衡括号找到块结束
    let depth = 0;
    let end = pictStart;
    for (let i = pictStart + 1; i < rtf.length; i++) {
      if (rtf[i] === "{") depth++;
      else if (rtf[i] === "}") {
        if (depth === 0) { end = i; break; }
        depth--;
      }
    }
    if (end <= pictStart) { debug?.(`Pict#${blockCount}: 未找到闭合括号`); continue; }

    const block = rtf.substring(pictStart, end + 1);
    debug?.(`Pict#${blockCount}: pos=${pictStart} len=${block.length}`);

    // 检测格式
    let fmt = "pngblip";
    if (/\\jpegblip/.test(block)) fmt = "jpegblip";
    else if (/\\wmetafile\d+/.test(block)) fmt = "wmetafile";
    else if (/\\emfblip/.test(block)) fmt = "emfblip";
    debug?.(`Pict#${blockCount}: fmt=${fmt}`);

    // 提取 hex 数据
    // 方法1: \picwgoalN\pichgoalN 之后
    let hexMatch = block.match(/\\(?:picwgoal|pichgoal)\d+\s*([\da-fA-F\r\n\s]{50,})\}/);
    // 方法2: 最后一个 } 之前的大量hex
    if (!hexMatch) {
      hexMatch = block.match(/([\da-fA-F\r\n\s]{200,})\}/);
    }
    if (!hexMatch) {
      debug?.(`Pict#${blockCount}: hex未匹配`);
      continue;
    }

    const hexData = hexMatch[1].replace(/[\r\n\s\\]/g, "");
    debug?.(`Pict#${blockCount}: hex=${hexData.length}字符`);
    if (hexData.length < 100) continue;

    try {
      // 快速 hex 解码：查找表替代 parseInt
      const hexLookup = new Uint8Array(256);
      for (let i = 0; i < 16; i++) {
        const c = i.toString(16);
        hexLookup[c.charCodeAt(0)] = i;
        hexLookup[c.toUpperCase().charCodeAt(0)] = i;
      }
      const len = hexData.length >> 1;
      const bytes = new Uint8Array(len);
      let bi = 0;
      for (let i = 0; i + 1 < hexData.length; i += 2) {
        const hi = hexLookup[hexData.charCodeAt(i)];
        const lo = hexLookup[hexData.charCodeAt(i + 1)];
        if (hi === undefined || lo === undefined) continue;
        bytes[bi++] = (hi << 4) | lo;
      }
      // 如果有跳过的无效字符，裁剪数组
      const finalBytes = bi === len ? bytes : bytes.slice(0, bi);
      debug?.(`Pict#${blockCount}: 解码=${finalBytes.length}字节`);

      let mimeType = "image/png";
      let ext = "png";
      if (fmt === "jpegblip") { mimeType = "image/jpeg"; ext = "jpg"; }
      else if (fmt === "wmetafile") { mimeType = "image/wmf"; ext = "wmf"; }
      else if (fmt === "emfblip") { mimeType = "image/emf"; ext = "emf"; }

      files.push(new File([finalBytes], `rtf-img-${files.length + 1}.${ext}`, { type: mimeType }));
    } catch (e: any) {
      debug?.(`Pict#${blockCount}: 解码失败 ${e?.message || e}`);
    }
  }

  return files;
}

/** 将 base64 data URI 转换为 Blob */
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

/** 清理从 Word 粘贴的 HTML：去掉 mso-* 垃圾，保留格式和图片 */
function cleanWordHtml(html: string): string {
  return (
    html
      // 先提取 [if !vml] 块中的 <img> 和 <v:imagedata>，防止被后续清理误删
      .replace(
        /<!--\[if gte vml 1\]>([\s\S]*?)<v:imagedata[^>]+src\s*=\s*["']([^"']+)["'][^>]*\/?>[\s\S]*?<!\[endif\]-->/gi,
        (_, _vmlContent: string, src: string) => `<img src="${src}" class="rounded-lg max-w-full my-4">`
      )
      .replace(
        /<!--\[if \!vml\]-->[\s]*<img[^>]+src\s*=\s*["']([^"']+)["'][^>]*>[\s]*<!\[endif\]-->/gi,
        '<img src="$1" class="rounded-lg max-w-full my-4">'
      )
      // 处理不在条件注释内的独立 VML imagedata
      .replace(
        /<v:imagedata[^>]+src\s*=\s*["']([^"']+)["'][^>]*\/?>/gi,
        '<img src="$1" class="rounded-lg max-w-full my-4">'
      )
      .replace(
        /<v:imagedata[^>]+src\s*=\s*["']([^"']+)["'][^>]*>[\s\S]*?<\/v:imagedata>/gi,
        '<img src="$1" class="rounded-lg max-w-full my-4">'
      )
      // 去掉 Word 条件注释（此时图片已提取，可安全删除）
      .replace(/<!--\[if [^\]]*\]>[\s\S]*?<!\[endif\]-->/gi, "")
      // 去掉残留的 VML / Office 形状标记
      .replace(/<v:[^>]+>[\s\S]*?<\/v:[^>]+>/gi, "")
      .replace(/<v:[^>]+\/>/gi, "")
      .replace(/<o:[^>]+>[\s\S]*?<\/o:[^>]+>/gi, "")
      // 去掉所有 mso-* CSS 属性（保留非 mso 的 style）
      .replace(
        /(style\s*=\s*")([^"]*)(")/gi,
        (_m: string, p1: string, s: string, p3: string) => {
          const cleaned = s
            .replace(/[^;]*mso-[^;]*;?/gi, "")
            .replace(/text-underline:\s*[^;]*;?/gi, "")
            .replace(/\s*;\s*/g, ";")
            .replace(/^;+|;+$/g, "");
          return cleaned ? `${p1}${cleaned}${p3}` : "";
        }
      )
      // 去掉 mso-* class
      .replace(/class\s*=\s*"[^"]*Mso[^"]*"/gi, "")
      .replace(/class\s*=\s*"[^"]*mso[^"]*"/gi, "")
      // 去掉 Word XML 命名空间
      .replace(/\s*xmlns:[a-z]+\s*=\s*"[^"]*"/gi, "")
      // 去掉多余空格
      .replace(/\s{2,}/g, " ")
  );
}

export default function RichTextEditor({ content, onChange }: RichTextEditorProps) {
  const [uploading, setUploading] = useState(false);
  const [pasteDebug, setPasteDebug] = useState<string[]>([]);

  const addDebug = (msg: string) => {
    setPasteDebug((prev) => [...prev.slice(-19), msg]);
    console.log("[PasteDebug]", msg);
  };

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      // 段落级样式保留（行高、缩进）
      ParagraphStyle,
      // 文本样式 — 这些是保留 Word 格式的关键扩展
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      FontFamily,
      UnderlineExt,
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableCell,
      TableHeader,
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
      // 在 ProseMirror 解析 HTML 之前，先清理 Word 格式
      transformPastedHTML: (html: string) => {
        return cleanWordHtml(html);
      },
      handlePaste: (view, event) => {
        const clipboardData = event.clipboardData;
        if (!clipboardData) return false;

        const items = Array.from(clipboardData.items);
        const rawHtml = clipboardData.getData("text/html");

        // 诊断信息
        addDebug(`剪贴板: items=${items.length} files=${clipboardData.files?.length || 0} HTML=${rawHtml.length}字节`);
        const itemTypes = items.map((i) => i.type).join(", ");
        addDebug(`item types: ${itemTypes}`);
        if (clipboardData.files?.length) {
          const fNames = Array.from(clipboardData.files).map((f) => `${f.name}(${f.type})`).join(", ");
          addDebug(`files: ${fNames}`);
        }
        const imgTagCount = (rawHtml.match(/<img[^>]*>/gi) || []).length;
        const vmlCount = (rawHtml.match(/<v:imagedata/gi) || []).length;
        addDebug(`HTML中: img=${imgTagCount} vml=${vmlCount}`);

        // 保存 HTML 到服务器供分析
        fetch("/api/admin/save-rtf", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ rtf: rawHtml.substring(0, 500000), tag: "html" }),
        }).catch(() => {});

        const html = rawHtml;
        // 收集剪贴板中的图片文件（items + files 两个来源都要查）
        const imageFiles: File[] = [];
        for (const item of items) {
          if (item.type.startsWith("image/")) {
            const file = item.getAsFile();
            if (file) imageFiles.push(file);
          }
        }
        if (clipboardData.files && clipboardData.files.length > 0) {
          for (const file of Array.from(clipboardData.files)) {
            if (file.type.startsWith("image/")) {
              imageFiles.push(file);
            }
          }
        }
        // 若没有图片文件，尝试从 RTF 中提取（Word VML 方式粘贴）
        if (imageFiles.length === 0) {
          const rtf = clipboardData.getData("text/rtf");
          if (rtf) {
            // 诊断：显示 RTF 中图片相关片段
            const pictIdx = rtf.indexOf("\\pict");
            if (pictIdx >= 0) {
              addDebug(`RTF含\\pict在${pictIdx}，片段: ${rtf.substring(pictIdx, Math.min(pictIdx + 300, rtf.length)).replace(/[\r\n]/g, " ")}`);
            } else {
              addDebug(`RTF无\\pict，大小${rtf.length}B，首200字: ${rtf.substring(0, 200).replace(/[\r\n]/g, " ")}`);
            }
            // 保存 RTF 到服务器供分析
            fetch("/api/admin/save-rtf", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ rtf: rtf.substring(0, 500000) }),
            }).catch(() => {});
            // 尝试多种匹配
            const rtfImages = extractImagesFromRtf(rtf, addDebug);
            if (rtfImages.length > 0) {
              // PNG 优先 → WMF 在后（浏览器无法渲染 WMF）
              const pngs = rtfImages.filter((f) => f.type === "image/png");
              const others = rtfImages.filter((f) => f.type !== "image/png");
              imageFiles.push(...pngs, ...others);
              addDebug(`RTF图片: ${rtfImages.length}张(PNG:${pngs.length}), 总数: ${imageFiles.length}张`);
            }
          }
        }

        addDebug(`图片文件: ${imageFiles.length}个`);

        // 是否来自 Word
        const isWordHtml = /mso-/i.test(html) || /<!--\[if gte/i.test(html) || /<v:imagedata/i.test(html);

        // 构建文件名→File 的映射，用于匹配 Word 图片
        const fileByName: Record<string, File> = {};
        for (const f of imageFiles) {
          fileByName[f.name.toLowerCase()] = f;
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
              } catch { /* skip */ }
            }
            setUploading(false);
          })();
          return true;
        }

        // 含 <img> 的粘贴，或 Word 拷贝 → 拦截处理
        if (/<img[^>]*>/i.test(html) || isWordHtml) {
          event.preventDefault();
          setUploading(true);
          (async () => {
            try {
              // 先用原始 HTML 统计 VML 占位符并上传（cleanWordHtml 会删掉 VML）
              const rawImgTags = html.match(/<img[^>]*src\s*=\s*["'](?:data:image\/|file:\/\/|http)/gi) || [];
              const vmlPlaceholders = html.match(/<v:imagedata[^>]*\/?>/gi) || [];
              const totalPlaceholders = Math.max(rawImgTags.length, vmlPlaceholders.length);
              addDebug(`占位符: img=${rawImgTags.length} vml=${vmlPlaceholders.length} 总=${totalPlaceholders}`);

              const uploadedUrls: string[] = [];

              // 上传所有图片（RTF提取的或剪贴板的）
              if (imageFiles.length > 0 && totalPlaceholders > 0) {
                addDebug(`开始上传${imageFiles.length}张→${totalPlaceholders}个占位符`);
                for (const file of imageFiles) {
                  try {
                    const url = await uploadImage(file);
                    if (url) uploadedUrls.push(url);
                  } catch { /* skip */ }
                }
                addDebug(`上传: ${uploadedUrls.length}成功`);
              }

              // 如果没图片文件，检查 base64 img
              if (uploadedUrls.length === 0 && rawImgTags.length > 0) {
                for (const tag of rawImgTags) {
                  const srcMatch = tag.match(/src\s*=\s*["']([^"']*)["']/i);
                  const src = srcMatch ? srcMatch[1] : "";
                  if (src.startsWith("data:image/")) {
                    try {
                      const blob = dataUriToBlob(src);
                      const file = new File([blob], "img.png", { type: blob.type });
                      const url = await uploadImage(file);
                      if (url) uploadedUrls.push(url);
                    } catch { /* skip */ }
                  }
                }
              }

              // ***** 替换所有 VML 块为 <img>，防止 cleanWordHtml 误删 *****
              let processedHtml = html;
              if (vmlPlaceholders.length > 0 && uploadedUrls.length > 0) {
                let urlIdx = 0;
                const replaceWithImg = () => {
                  if (urlIdx < uploadedUrls.length) {
                    return `<img src="${uploadedUrls[urlIdx++]}" class="rounded-lg max-w-full my-4">`;
                  }
                  return "";
                };
                // 1. <v:shape ...><v:imagedata .../></v:shape> → <img>
                processedHtml = processedHtml.replace(
                  /<v:shape[^>]*>[\s]*<v:imagedata[^>]*\/?>[\s]*<\/v:shape>/gi,
                  replaceWithImg
                );
                // 2. <!--[if gte vml 1]-->...[if !supportInlineShapes]...<v:imagedata/>...<![endif]--> → <img>
                processedHtml = processedHtml.replace(
                  /<!--\[if[^\]]*vml[^\]]*\]>[\s\S]*?<v:imagedata[^>]*\/?>[\s\S]*?<!\[endif\]-->/gi,
                  replaceWithImg
                );
                // 3. 独立的 <v:imagedata .../> → <img>
                processedHtml = processedHtml.replace(
                  /<v:imagedata[^>]*\/?>/gi,
                  replaceWithImg
                );
                addDebug(`VML→IMG: ${urlIdx}个`);
              }

              // 现在清理 Word HTML
              processedHtml = cleanWordHtml(processedHtml);

              addDebug(`处理后img: ${(processedHtml.match(/<img[^>]*>/gi) || []).length}个`);

              // 替换残留的 <img src="file:///"> 或 <img> 无 src 的标签
              const brokenImgs = processedHtml.match(/<img(?![^>]*src="(?:https?:)?\/\/)[^>]*>/gi) || [];
              if (brokenImgs.length > 0 && uploadedUrls.length > 0) {
                let idx = 0;
                processedHtml = processedHtml.replace(/<img(?![^>]*src="(?:https?:)?\/\/)[^>]*>/gi, () => {
                  if (idx < uploadedUrls.length) {
                    return `<img src="${uploadedUrls[idx++]}" class="rounded-lg max-w-full my-4">`;
                  }
                  return "";
                });
                addDebug(`修复残留img: ${idx}个`);
              }

              editor?.commands.insertContent(processedHtml);
            } catch { /* ignore */ }
            setUploading(false);
          })();
          return true;
        }

        // 网页粘贴 / 纯文本 → 默认处理
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

  const setColor = useCallback(() => {
    const color = window.prompt("请输入颜色值（如 #ff0000 或 red）", "#333333");
    if (color && editor) {
      editor.chain().focus().setColor(color).run();
    }
  }, [editor]);

  const setHighlight = useCallback(() => {
    const color = window.prompt("请输入高亮颜色（如 #ffff00）", "#ffff00");
    if (color && editor) {
      editor.chain().focus().toggleHighlight({ color }).run();
    }
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

  return (
    <div className="rounded-lg border border-gray-200 overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 border-b border-gray-200 bg-gray-50 px-3 py-2">
        {/* 文本格式 */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={btnClass(editor.isActive("bold"))}
          title="加粗"
        >
          <Bold className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={btnClass(editor.isActive("italic"))}
          title="斜体"
        >
          <Italic className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={btnClass(editor.isActive("underline"))}
          title="下划线"
        >
          <Underline className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={btnClass(editor.isActive("strike"))}
          title="删除线"
        >
          <Strikethrough className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCode().run()}
          className={btnClass(editor.isActive("code"))}
          title="行内代码"
        >
          <Code className="h-4 w-4" />
        </button>

        <div className="mx-1 h-5 w-px bg-gray-300" />

        {/* 文字颜色 & 高亮 */}
        <button type="button" onClick={setColor} className="rounded p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700" title="文字颜色">
          <Palette className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={setHighlight}
          className={btnClass(editor.isActive("highlight"))}
          title="高亮"
        >
          <Highlighter className="h-4 w-4" />
        </button>

        <div className="mx-1 h-5 w-px bg-gray-300" />

        {/* 对齐 */}
        <button
          type="button"
          onClick={() => applyAlign("left")}
          className={btnClass(
            (editor.getAttributes("paragraph").paraStyle || "").includes("text-align:left") ||
            !(editor.getAttributes("paragraph").paraStyle || "").includes("text-align:")
          )}
          title="左对齐"
        >
          <AlignLeft className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => applyAlign("center")}
          className={btnClass(
            (editor.getAttributes("paragraph").paraStyle || "").includes("text-align:center")
          )}
          title="居中"
        >
          <AlignCenter className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => applyAlign("right")}
          className={btnClass(
            (editor.getAttributes("paragraph").paraStyle || "").includes("text-align:right")
          )}
          title="右对齐"
        >
          <AlignRight className="h-4 w-4" />
        </button>

        <div className="mx-1 h-5 w-px bg-gray-300" />

        {/* 标题 */}
        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          className={btnClass(editor.isActive("heading", { level: 1 }))}
          title="一级标题"
        >
          <Heading1 className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={btnClass(editor.isActive("heading", { level: 2 }))}
          title="二级标题"
        >
          <Heading2 className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          className={btnClass(editor.isActive("heading", { level: 3 }))}
          title="三级标题"
        >
          <Heading3 className="h-4 w-4" />
        </button>

        <div className="mx-1 h-5 w-px bg-gray-300" />

        {/* 列表 */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={btnClass(editor.isActive("bulletList"))}
          title="无序列表"
        >
          <List className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={btnClass(editor.isActive("orderedList"))}
          title="有序列表"
        >
          <ListOrdered className="h-4 w-4" />
        </button>

        <div className="mx-1 h-5 w-px bg-gray-300" />

        {/* 图片 & 链接 */}
        <button type="button" onClick={addImageByFile} className="rounded p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700" title="上传图片">
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

        {/* 撤销/重做 */}
        <button type="button" onClick={() => editor.chain().focus().undo().run()} className="rounded p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700" title="撤销">
          <Undo className="h-4 w-4" />
        </button>
        <button type="button" onClick={() => editor.chain().focus().redo().run()} className="rounded p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700" title="重做">
          <Redo className="h-4 w-4" />
        </button>

        <div className="mx-1 h-5 w-px bg-gray-300" />

        {/* 测试：加载 Word 测试内容 */}
        <button
          type="button"
          onClick={async () => {
            setUploading(true);
            try {
              const res = await fetch("/api/admin/test-content", { credentials: "include" });
              const data = await res.json();
              if (data.html && editor) {
                editor.commands.setContent(data.html);
              }
            } catch { /* ignore */ }
            setUploading(false);
          }}
          className="rounded px-2 py-1 text-xs text-orange-500 hover:bg-orange-50"
          title="加载Word文档测试HTML"
        >
          加载测试
        </button>
      </div>

      {/* Editor Area */}
      <div className="prose prose-sm max-w-none p-4 min-h-[300px] focus:outline-none
        /* 表格样式 */
        [&_table]:w-full [&_table]:border-collapse [&_table]:my-4 [&_table]:text-sm
        [&_th]:border [&_th]:border-gray-300 [&_th]:bg-gray-50 [&_th]:px-3 [&_th]:py-2 [&_th]:text-left [&_th]:font-semibold
        [&_td]:border [&_td]:border-gray-300 [&_td]:px-3 [&_td]:py-2
        [&_tr:nth-child(even)_td]:bg-gray-50/50
        [&_.selectedCell]:bg-blue-50
        /* 基础排版 */
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
        /* Word 样式兼容 */
        [&_.MsoNormal]:my-0
        [&_span]:leading-relaxed
      ">
        <EditorContent editor={editor} />
      </div>

      {/* Paste Debug Panel */}
      {pasteDebug.length > 0 && (
        <div className="border-t border-gray-200 bg-gray-900 p-2 font-mono text-[10px] leading-relaxed text-green-400 max-h-40 overflow-y-auto">
          {pasteDebug.map((line, i) => (
            <div key={i}>
              <span className="text-gray-500">{i + 1}.</span> {line}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
