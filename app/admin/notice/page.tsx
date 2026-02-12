"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getNotices, type Notice } from "@/lib/admin/api";
import { Pencil, Plus, ChevronLeft, ChevronRight } from "lucide-react";

const PAGE_SIZE = 15;

export default function AdminNoticePage() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchNotices = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await getNotices(page, PAGE_SIZE);
        if (isMounted) {
          setNotices(res.data);
          setTotal(res.total);
          setTotalPages(res.totalPages);
        }
      } catch (e) {
        if (isMounted) {
          setError(
            typeof e === "object" && e !== null && "message" in e
              ? String((e as { message: string }).message)
              : "공지사항 목록을 불러오는데 실패했습니다.",
          );
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    fetchNotices();
    return () => {
      isMounted = false;
    };
  }, [page]);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toISOString().slice(0, 10);
  };

  const startNo = total - (page - 1) * PAGE_SIZE;

  const getPageNumbers = () => {
    const maxVisible = 5;
    let start = Math.max(1, page - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl px-4 py-10">
        {/* 헤더 */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">공지사항 관리</h1>
            <p className="mt-1 text-sm text-gray-500">
              공지사항을 작성하고 수정할 수 있습니다.
            </p>
          </div>
          <Link
            href="/admin/notice/new"
            className="inline-flex items-center gap-2 rounded-lg bg-[#1e4a85] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#163a6b]"
          >
            <Plus size={18} />
            작성
          </Link>
        </div>

        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* 게시판 테이블 */}
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-[#1e4a85]">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-white">
                    No
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-white">
                    제목
                  </th>
                  <th className="hidden px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-white sm:table-cell">
                    카테고리
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-white">
                    작성자
                  </th>
                  <th className="hidden px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-white md:table-cell">
                    조회수
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-white">
                    작성일
                  </th>
                  <th className="w-20 px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-white">
                    수정
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {isLoading ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-4 py-12 text-center text-gray-500"
                    >
                      로딩 중...
                    </td>
                  </tr>
                ) : notices.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-4 py-12 text-center text-gray-500"
                    >
                      등록된 공지사항이 없습니다.
                    </td>
                  </tr>
                ) : (
                  notices.map((notice, index) => (
                    <tr
                      key={notice.id}
                      className="transition-colors hover:bg-gray-50"
                    >
                      <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">
                        {startNo - index}
                      </td>
                      <td className="px-4 py-3">
                        <span className="line-clamp-2 font-medium text-gray-900">
                          {notice.title}
                        </span>
                      </td>
                      <td className="hidden whitespace-nowrap px-4 py-3 text-sm text-gray-600 sm:table-cell">
                        {notice.category ?? "-"}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">
                        {notice.author}
                      </td>
                      <td className="hidden whitespace-nowrap px-4 py-3 text-sm text-gray-600 md:table-cell">
                        {notice.views}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">
                        {formatDate(notice.created_at)}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-right">
                        <Link
                          href={`/admin/notice/${notice.id}/edit`}
                          className="inline-flex items-center gap-1 rounded border border-gray-300 px-2 py-1 text-xs font-medium text-gray-700 hover:bg-gray-100"
                        >
                          <Pencil size={14} />
                          수정
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* 페이지네이션 */}
        {!isLoading && totalPages > 0 && (
          <div className="mt-4 flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
            <p className="text-sm text-gray-500">
              전체 {total}건 ({page}/{totalPages}페이지)
            </p>
            <nav className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="rounded border border-gray-300 p-2 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-transparent"
                aria-label="이전 페이지"
              >
                <ChevronLeft size={18} />
              </button>
              {getPageNumbers().map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPage(p)}
                  className={`min-w-9 rounded px-2 py-1.5 text-sm font-medium ${
                    p === page
                      ? "border border-[#1e4a85] bg-[#1e4a85] text-white"
                      : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="rounded border border-gray-300 p-2 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-transparent"
                aria-label="다음 페이지"
              >
                <ChevronRight size={18} />
              </button>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
}
