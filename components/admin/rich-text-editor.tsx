"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { TextStyleKit } from "@tiptap/extension-text-style/text-style-kit";
import TextAlign from "@tiptap/extension-text-align";
import Image from "@tiptap/extension-image";
import { TableKit } from "@tiptap/extension-table";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import Placeholder from "@tiptap/extension-placeholder";
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  Camera,
  Italic,
  Link2,
  List,
  ListOrdered,
  Minus,
  Quote,
  Redo2,
  Strikethrough,
  Subscript as SubIcon,
  Superscript as SuperIcon,
  Table as TableIcon,
  Underline,
  Undo2,
} from "lucide-react";

export type RichTextEditorHandle = {
  /** 현재 탭(Editor/HTML/TEXT) 기준 전체 HTML */
  getHtml: () => string;
};

type ViewTab = "editor" | "html" | "text";

const FONT_OPTIONS = [
  { label: "돋움", value: 'Dotum, "Apple SD Gothic Neo", sans-serif' },
  { label: "굴림", value: "Gulim, AppleGothic, sans-serif" },
  { label: "맑은 고딕", value: '"Malgun Gothic", sans-serif' },
  { label: "Arial", value: "Arial, Helvetica, sans-serif" },
];

const SIZE_OPTIONS = ["8pt", "9pt", "10pt", "11pt", "12pt", "14pt", "16pt", "18pt", "24pt"];

function escapeHtml(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function plainTextToHtml(text: string) {
  const lines = text.split("\n");
  if (lines.length === 1 && lines[0] === "") return "<p></p>";
  return lines.map((line) => `<p>${escapeHtml(line) || "<br>"}</p>`).join("");
}

function htmlToPlainText(html: string) {
  if (typeof document === "undefined") return html.replace(/<[^>]+>/g, "");
  const d = document.createElement("div");
  d.innerHTML = html;
  return d.textContent ?? "";
}

function createExtensions(placeholder: string) {
  return [
    StarterKit.configure({
      link: {
        openOnClick: false,
        autolink: true,
        HTMLAttributes: { class: "text-[#4e73df] underline" },
      },
    }),
    TextStyleKit,
    TextAlign.configure({ types: ["heading", "paragraph"] }),
    Image.configure({
      inline: true,
      allowBase64: true,
      HTMLAttributes: { class: "max-w-full h-auto rounded" },
    }),
    TableKit.configure({
      table: { HTMLAttributes: { class: "border-collapse border border-gray-300" } },
      tableHeader: {
        HTMLAttributes: { class: "border border-gray-300 bg-gray-100 px-2 py-1" },
      },
      tableCell: {
        HTMLAttributes: { class: "border border-gray-300 px-2 py-1" },
      },
    }),
    Subscript,
    Superscript,
    Placeholder.configure({ placeholder }),
  ];
}

function ToolbarButton({
  onClick,
  active,
  disabled,
  title,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={title}
      disabled={disabled}
      onClick={onClick}
      className={`rounded border p-1.5 transition-colors ${
        active
          ? "border-[#4e73df] bg-[#4e73df]/15 text-[#224abe]"
          : "border-transparent bg-white text-gray-700 hover:bg-gray-100"
      } ${disabled ? "cursor-not-allowed opacity-40" : ""}`}
    >
      {children}
    </button>
  );
}

export type RichTextEditorProps = {
  initialHtml: string;
  onHtmlChange?: (html: string) => void;
  placeholder?: string;
  defaultHeight?: number;
  /** 상단 리사이즈 안내 배너 */
  showResizeHint?: boolean;
  className?: string;
  /** 폼 안에 넣을 때 바깥 카드 테두리 생략 */
  embedded?: boolean;
};

export const RichTextEditor = forwardRef<RichTextEditorHandle, RichTextEditorProps>(
  function RichTextEditor(
    {
      initialHtml,
      onHtmlChange,
      placeholder = "내용을 입력하세요…",
      defaultHeight = 420,
      showResizeHint = true,
      className = "",
      embedded = false,
    },
    ref,
  ) {
    const [viewTab, setViewTab] = useState<ViewTab>("editor");
    const [htmlSource, setHtmlSource] = useState(initialHtml);
    const [textSource, setTextSource] = useState(() => htmlToPlainText(initialHtml));
    const [editorHeight, setEditorHeight] = useState(defaultHeight);
    const [showResizeHintState, setShowResizeHintState] = useState(showResizeHint);
    const resizeDrag = useRef<{ startY: number; startH: number } | null>(null);
    const imageInputRef = useRef<HTMLInputElement>(null);

    const extensions = useMemo(() => createExtensions(placeholder), [placeholder]);

    const editor = useEditor(
      {
        immediatelyRender: false,
        extensions,
        content: initialHtml,
        editorProps: {
          attributes: {
            class:
              "prose prose-sm max-w-none focus:outline-none min-h-[200px] px-3 py-2 text-gray-900 [&_p]:my-2 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6",
          },
        },
        onUpdate: ({ editor: ed }) => {
          onHtmlChange?.(ed.getHTML());
        },
      },
      [initialHtml, extensions],
    );

    useEffect(() => {
      setHtmlSource(initialHtml);
      setTextSource(htmlToPlainText(initialHtml));
    }, [initialHtml]);

    const getCurrentHtml = useCallback(() => {
      if (viewTab === "editor" && editor) return editor.getHTML();
      if (viewTab === "html") return htmlSource;
      return plainTextToHtml(textSource);
    }, [editor, viewTab, htmlSource, textSource]);

    useImperativeHandle(ref, () => ({ getHtml: getCurrentHtml }), [getCurrentHtml]);

    const switchTab = useCallback(
      (next: ViewTab) => {
        if (!editor) return;
        if (viewTab === "editor" && next === "html") {
          const h = editor.getHTML();
          setHtmlSource(h);
          onHtmlChange?.(h);
        } else if (viewTab === "editor" && next === "text") {
          const t = editor.getText();
          setTextSource(t);
          onHtmlChange?.(editor.getHTML());
        } else if (viewTab === "html" && next === "editor") {
          editor.commands.setContent(htmlSource || "<p></p>", { emitUpdate: false });
          onHtmlChange?.(editor.getHTML());
        } else if (viewTab === "text" && next === "editor") {
          const html = plainTextToHtml(textSource);
          editor.commands.setContent(html, { emitUpdate: false });
          onHtmlChange?.(editor.getHTML());
        } else if (viewTab === "html" && next === "text") {
          setTextSource(htmlToPlainText(htmlSource));
          onHtmlChange?.(htmlSource);
        } else if (viewTab === "text" && next === "html") {
          const h = plainTextToHtml(textSource);
          setHtmlSource(h);
          onHtmlChange?.(h);
        }
        setViewTab(next);
      },
      [editor, viewTab, htmlSource, textSource, onHtmlChange],
    );

    useEffect(() => {
      const onMove = (e: MouseEvent) => {
        if (!resizeDrag.current) return;
        const dy = e.clientY - resizeDrag.current.startY;
        const next = Math.max(200, Math.min(1200, resizeDrag.current.startH + dy));
        setEditorHeight(next);
      };
      const onUp = () => {
        resizeDrag.current = null;
      };
      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onUp);
      return () => {
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mouseup", onUp);
      };
    }, []);

    const onResizeMouseDown = (e: React.MouseEvent) => {
      e.preventDefault();
      resizeDrag.current = { startY: e.clientY, startH: editorHeight };
    };

    const onPickImage = () => imageInputRef.current?.click();

    const onImageFile: React.ChangeEventHandler<HTMLInputElement> = (e) => {
      const file = e.target.files?.[0];
      if (!file || !editor) return;
      const reader = new FileReader();
      reader.onload = () => {
        const src = reader.result as string;
        editor.chain().focus().setImage({ src }).run();
        onHtmlChange?.(editor.getHTML());
      };
      reader.readAsDataURL(file);
      e.target.value = "";
    };

    if (!editor) {
      return (
        <div className="flex items-center justify-center py-12 text-gray-500">
          에디터 준비 중…
        </div>
      );
    }

    const shell = embedded
      ? `flex flex-col bg-white ${className}`.trim()
      : `flex flex-col rounded-lg border border-gray-200 bg-white shadow-sm ${className}`.trim();

    return (
      <div className={shell}>
        {viewTab === "editor" && (
          <div className="flex flex-wrap items-center gap-1 border-b border-gray-200 bg-gray-50 px-2 py-2">
            <select
              className="h-9 rounded border border-gray-300 bg-white px-2 text-sm"
              onChange={(e) => {
                const v = e.target.value;
                if (v) editor.chain().focus().setFontFamily(v).run();
              }}
              defaultValue=""
              title="글꼴"
            >
              <option value="">글꼴</option>
              {FONT_OPTIONS.map((f) => (
                <option key={f.value} value={f.value}>
                  {f.label}
                </option>
              ))}
            </select>
            <select
              className="h-9 rounded border border-gray-300 bg-white px-2 text-sm"
              onChange={(e) => {
                const v = e.target.value;
                if (v) editor.chain().focus().setFontSize(v).run();
              }}
              defaultValue=""
              title="크기"
            >
              <option value="">크기</option>
              {SIZE_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>

            <span className="mx-1 h-6 w-px bg-gray-300" aria-hidden />

            <ToolbarButton
              title="굵게"
              active={editor.isActive("bold")}
              onClick={() => editor.chain().focus().toggleBold().run()}
            >
              <Bold className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
              title="기울임"
              active={editor.isActive("italic")}
              onClick={() => editor.chain().focus().toggleItalic().run()}
            >
              <Italic className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
              title="밑줄"
              active={editor.isActive("underline")}
              onClick={() => editor.chain().focus().toggleUnderline().run()}
            >
              <Underline className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
              title="취소선"
              active={editor.isActive("strike")}
              onClick={() => editor.chain().focus().toggleStrike().run()}
            >
              <Strikethrough className="h-4 w-4" />
            </ToolbarButton>

            <input
              type="color"
              title="글자 색"
              className="h-9 w-9 cursor-pointer rounded border border-gray-300"
              onInput={(e) =>
                editor.chain().focus().setColor((e.target as HTMLInputElement).value).run()
              }
            />
            <input
              type="color"
              title="배경 색"
              className="h-9 w-9 cursor-pointer rounded border border-gray-300"
              defaultValue="#ffff00"
              onInput={(e) =>
                editor
                  .chain()
                  .focus()
                  .setBackgroundColor((e.target as HTMLInputElement).value)
                  .run()
              }
            />

            <ToolbarButton
              title="위첨자"
              active={editor.isActive("superscript")}
              onClick={() => editor.chain().focus().toggleSuperscript().run()}
            >
              <SuperIcon className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
              title="아래첨자"
              active={editor.isActive("subscript")}
              onClick={() => editor.chain().focus().toggleSubscript().run()}
            >
              <SubIcon className="h-4 w-4" />
            </ToolbarButton>

            <span className="mx-1 h-6 w-px bg-gray-300" aria-hidden />

            <ToolbarButton
              title="왼쪽 정렬"
              active={editor.isActive({ textAlign: "left" })}
              onClick={() => editor.chain().focus().setTextAlign("left").run()}
            >
              <AlignLeft className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
              title="가운데"
              active={editor.isActive({ textAlign: "center" })}
              onClick={() => editor.chain().focus().setTextAlign("center").run()}
            >
              <AlignCenter className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
              title="오른쪽"
              active={editor.isActive({ textAlign: "right" })}
              onClick={() => editor.chain().focus().setTextAlign("right").run()}
            >
              <AlignRight className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
              title="양쪽"
              active={editor.isActive({ textAlign: "justify" })}
              onClick={() => editor.chain().focus().setTextAlign("justify").run()}
            >
              <AlignJustify className="h-4 w-4" />
            </ToolbarButton>

            <ToolbarButton
              title="글머리 기호"
              active={editor.isActive("bulletList")}
              onClick={() => editor.chain().focus().toggleBulletList().run()}
            >
              <List className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
              title="번호 목록"
              active={editor.isActive("orderedList")}
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
            >
              <ListOrdered className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
              title="인용"
              active={editor.isActive("blockquote")}
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
            >
              <Quote className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
              title="구분선"
              onClick={() => editor.chain().focus().setHorizontalRule().run()}
            >
              <Minus className="h-4 w-4" />
            </ToolbarButton>

            <ToolbarButton
              title="링크"
              active={editor.isActive("link")}
              onClick={() => {
                const prev = editor.getAttributes("link").href as string | undefined;
                const url = window.prompt("URL", prev ?? "https://");
                if (url === null) return;
                if (url === "") {
                  editor.chain().focus().unsetLink().run();
                  return;
                }
                editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
              }}
            >
              <Link2 className="h-4 w-4" />
            </ToolbarButton>

            <ToolbarButton
              title="표 삽입"
              onClick={() =>
                editor
                  .chain()
                  .focus()
                  .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
                  .run()
              }
            >
              <TableIcon className="h-4 w-4" />
            </ToolbarButton>

            <ToolbarButton title="실행 취소" onClick={() => editor.chain().focus().undo().run()}>
              <Undo2 className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton title="다시 실행" onClick={() => editor.chain().focus().redo().run()}>
              <Redo2 className="h-4 w-4" />
            </ToolbarButton>

            <span className="flex-1" />

            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={onImageFile}
            />
            <button
              type="button"
              onClick={onPickImage}
              className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-800 hover:bg-gray-100"
            >
              <Camera className="h-4 w-4" />
              사진
            </button>
          </div>
        )}

        <div className="relative">
          {viewTab === "editor" && (
            <div
              className="overflow-auto border-b border-gray-100 bg-white"
              style={{ height: editorHeight }}
            >
              <EditorContent editor={editor} className="h-full [&_.ProseMirror]:min-h-full" />
            </div>
          )}
          {viewTab === "html" && (
            <textarea
              value={htmlSource}
              onChange={(e) => {
                const v = e.target.value;
                setHtmlSource(v);
                onHtmlChange?.(v);
              }}
              className="w-full resize-y border-0 border-b border-gray-100 bg-white px-3 py-2 font-mono text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#4e73df]/30"
              style={{ height: editorHeight }}
              spellCheck={false}
            />
          )}
          {viewTab === "text" && (
            <textarea
              value={textSource}
              onChange={(e) => {
                const v = e.target.value;
                setTextSource(v);
                onHtmlChange?.(plainTextToHtml(v));
              }}
              className="w-full resize-y border-0 border-b border-gray-100 bg-white px-3 py-2 font-mono text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#4e73df]/30"
              style={{ height: editorHeight }}
            />
          )}
        </div>

        {showResizeHintState && (
          <div className="flex items-center justify-between gap-2 border-b border-gray-100 bg-amber-50/80 px-3 py-1.5 text-xs text-amber-900">
            <span>아래 영역을 드래그하여 입력창 크기를 조절할 수 있습니다.</span>
            <button
              type="button"
              onClick={() => setShowResizeHintState(false)}
              className="rounded px-2 py-0.5 font-bold hover:bg-amber-100"
              aria-label="닫기"
            >
              ✕
            </button>
          </div>
        )}

        <button
          type="button"
          onMouseDown={onResizeMouseDown}
          className="flex w-full cursor-row-resize items-center justify-center gap-2 border-b border-gray-200 bg-gray-100 py-2 text-xs font-medium text-gray-600 hover:bg-gray-200"
          aria-label="입력창 크기 조절"
        >
          <span className="select-none text-base leading-none">↕</span>
          입력창 크기 조절
        </button>

        <div className="flex justify-end gap-1 border-t border-gray-200 bg-gray-50 px-3 py-2">
          {(
            [
              { id: "editor" as const, label: "Editor" },
              { id: "html" as const, label: "HTML" },
              { id: "text" as const, label: "TEXT" },
            ] as const
          ).map(({ id, label }) => (
            <button
              key={id}
              type="button"
              onClick={() => switchTab(id)}
              className={`rounded border px-4 py-1.5 text-sm font-medium transition-colors ${
                viewTab === id
                  ? "border-[#4e73df] bg-white text-[#224abe] shadow-sm"
                  : "border-transparent bg-transparent text-gray-600 hover:bg-white/80"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    );
  },
);

RichTextEditor.displayName = "RichTextEditor";
