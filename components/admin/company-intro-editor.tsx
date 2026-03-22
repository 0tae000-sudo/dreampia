"use client";

import { useEffect, useRef, useState } from "react";
import {
  RichTextEditor,
  type RichTextEditorHandle,
} from "@/components/admin/rich-text-editor";

export function CompanyIntroEditor() {
  const [loadedHtml, setLoadedHtml] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const editorRef = useRef<RichTextEditorHandle>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/admin/company-intro", {
          credentials: "include",
        });
        const data = (await res.json()) as {
          success?: boolean;
          html?: string;
          error?: string;
        };
        if (!res.ok || !data.success) {
          throw new Error(data.error ?? "불러오기 실패");
        }
        if (!cancelled && data.html != null) {
          setLoadedHtml(data.html);
        }
      } catch (e) {
        if (!cancelled) {
          setLoadError(e instanceof Error ? e.message : "불러오기 실패");
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSave = async () => {
    const html = editorRef.current?.getHtml() ?? "";
    setSaveMessage(null);
    setSaving(true);
    try {
      const res = await fetch("/api/admin/company-intro", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ html }),
      });
      const data = (await res.json()) as { success?: boolean; error?: string };
      if (!res.ok || !data.success) {
        throw new Error(data.error ?? "저장 실패");
      }
      setSaveMessage("저장되었습니다.");
    } catch (e) {
      setSaveMessage(e instanceof Error ? e.message : "저장 실패");
    } finally {
      setSaving(false);
    }
  };

  if (loadError) {
    return (
      <p className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-800">
        {loadError}
      </p>
    );
  }

  if (loadedHtml === null) {
    return (
      <div className="flex items-center justify-center py-20 text-gray-500">
        불러오는 중…
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
      <div className="flex items-center justify-between gap-4 border-b border-gray-200 px-4 py-3 sm:px-6">
        <h1 className="text-xl font-bold text-gray-900">회사소개</h1>
        <div className="flex items-center gap-3">
          {saveMessage && (
            <span
              className={`text-sm ${saveMessage.includes("실패") || saveMessage.includes("권한") ? "text-red-600" : "text-emerald-600"}`}
            >
              {saveMessage}
            </span>
          )}
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="rounded-md bg-[#4e73df] px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#3d5fc7] disabled:opacity-50"
          >
            {saving ? "저장 중…" : "저장"}
          </button>
        </div>
      </div>
      <RichTextEditor
        ref={editorRef}
        initialHtml={loadedHtml}
        embedded
        defaultHeight={420}
        showResizeHint
      />
    </div>
  );
}
