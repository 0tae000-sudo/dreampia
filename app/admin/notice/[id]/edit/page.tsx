"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import Input from "@/components/input";
import {
  RichTextEditor,
  type RichTextEditorHandle,
} from "@/components/admin/rich-text-editor";
import { getNotice, updateNotice, type Notice } from "@/lib/admin/api";
import { useToast } from "@/components/toast-provider";
import {
  isHtmlContentEmpty,
  normalizeNoticeHtml,
} from "@/lib/admin/notice-html";

export default function AdminNoticeEditPage() {
  const params = useParams();
  const router = useRouter();
  const { showToast } = useToast();
  const contentRef = useRef<RichTextEditorHandle>(null);
  const id = typeof params.id === "string" ? parseInt(params.id, 10) : NaN;

  const [notice, setNotice] = useState<Notice | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  useEffect(() => {
    if (Number.isNaN(id)) {
      setError("유효하지 않은 공지 ID입니다.");
      setIsLoading(false);
      return;
    }
    let isMounted = true;
    const fetchNotice = async () => {
      try {
        const res = await getNotice(id);
        if (isMounted) setNotice(res.data);
      } catch (e) {
        if (isMounted) {
          setError(
            typeof e === "object" && e !== null && "message" in e
              ? String((e as { message: string }).message)
              : "공지를 불러오는데 실패했습니다.",
          );
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    fetchNotice();
    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (Number.isNaN(id) || !notice) return;
    setFieldErrors({});
    const content = (contentRef.current?.getHtml() ?? "").trim();
    if (isHtmlContentEmpty(content)) {
      setFieldErrors({ content: ["본문을 입력해 주세요."] });
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const payload = {
      title: String(formData.get("title") ?? "").trim(),
      content,
      author: String(formData.get("author") ?? "").trim(),
      category: String(formData.get("category") ?? "").trim() || undefined,
    };

    try {
      await updateNotice(id, payload);
      showToast("공지사항이 수정되었습니다.", "success");
      router.push("/admin/notice/");
      router.refresh();
    } catch (err) {
      const e = err as { message?: string; fieldErrors?: Record<string, string[]> };
      if (e.fieldErrors) setFieldErrors(e.fieldErrors);
      showToast(e.message ?? "공지사항 수정에 실패했습니다.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-4xl px-4 py-10">
          <div className="flex items-center justify-center py-24">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#1e4a85] border-t-transparent" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !notice) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-4xl px-4 py-10">
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-6 text-center text-red-700">
            <p>{error ?? "공지를 찾을 수 없습니다."}</p>
            <Link
              href="/admin/notice"
              className="mt-4 inline-block text-sm font-medium text-[#1e4a85] hover:underline"
            >
              목록으로
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const initialHtml = normalizeNoticeHtml(notice.content);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl px-4 py-10">
        <div className="mb-6">
          <Link
            href="/admin/notice"
            className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            ← 목록으로
          </Link>
          <h1 className="mt-2 text-2xl font-bold text-gray-900">
            공지사항 수정
          </h1>
          <p className="mt-1 text-sm text-gray-500">공지사항을 수정합니다.</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm md:p-8"
        >
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              제목 <span className="text-red-500">*</span>
            </label>
            <Input
              name="title"
              type="text"
              placeholder="제목을 입력하세요"
              required
              maxLength={200}
              containerClassName="mb-0"
              errors={fieldErrors.title}
              defaultValue={notice.title}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              카테고리
            </label>
            <Input
              name="category"
              type="text"
              placeholder="예: 교사, 일반 (선택)"
              containerClassName="mb-0"
              errors={fieldErrors.category}
              defaultValue={notice.category ?? ""}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              작성자 <span className="text-red-500">*</span>
            </label>
            <Input
              name="author"
              type="text"
              placeholder="예: 마스"
              required
              containerClassName="mb-0"
              errors={fieldErrors.author}
              defaultValue={notice.author}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              본문 <span className="text-red-500">*</span>
            </label>
            <p className="mb-2 text-xs text-gray-500">
              Editor / HTML / TEXT 탭으로 편집 방식을 바꿀 수 있습니다.
            </p>
            {fieldErrors.content && (
              <p className="mb-2 text-sm text-red-500">{fieldErrors.content[0]}</p>
            )}
            <RichTextEditor
              ref={contentRef}
              key={notice.id}
              initialHtml={initialHtml}
              embedded
              defaultHeight={380}
              placeholder="공지사항 내용을 입력하세요…"
              showResizeHint
            />
          </div>

          <div className="flex flex-col gap-3 border-t border-gray-100 pt-6 sm:flex-row sm:justify-end">
            <Link
              href="/admin/notice"
              className="order-2 flex justify-center rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 sm:order-1"
            >
              취소
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="order-1 rounded-lg bg-[#1e4a85] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#163a6b] disabled:opacity-50 sm:order-2"
            >
              {isSubmitting ? "수정 중..." : "수정"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
