"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Input from "@/components/input";
import { createNotice } from "@/lib/admin/api";
import { useToast } from "@/components/toast-provider";

export default function AdminNoticeNewPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFieldErrors({});
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const payload = {
      title: String(formData.get("title") ?? "").trim(),
      content: String(formData.get("content") ?? "").trim(),
      author: String(formData.get("author") ?? "").trim(),
      category: String(formData.get("category") ?? "").trim() || undefined,
    };

    try {
      await createNotice(payload);
      showToast("공지사항이 등록되었습니다.", "success");
      router.push("/admin/notice/");
      router.refresh();
    } catch (error) {
      const err = error as { message?: string; fieldErrors?: Record<string, string[]> };
      if (err.fieldErrors) {
        setFieldErrors(err.fieldErrors);
      }
      showToast(err.message ?? "공지사항 등록에 실패했습니다.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl px-4 py-10">
        {/* 헤더 */}
        <div className="mb-6">
          <Link
            href="/admin/notice"
            className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            ← 목록으로
          </Link>
          <h1 className="mt-2 text-2xl font-bold text-gray-900">
            공지사항 작성
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            새로운 공지사항을 등록합니다.
          </p>
        </div>

        {/* 폼 */}
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
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              본문 <span className="text-red-500">*</span>
            </label>
            {fieldErrors.content && (
              <p className="mb-2 text-sm text-red-500">{fieldErrors.content[0]}</p>
            )}
            <textarea
              name="content"
              required
              rows={12}
              placeholder="공지사항 내용을 입력하세요"
              className="w-full rounded-md border border-gray-200 px-3 py-2 text-base placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#1e4a85]/40"
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
              {isSubmitting ? "등록 중..." : "등록"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
