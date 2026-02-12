"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getNotices, type Notice } from "@/lib/admin/api";
import { Pencil, Plus } from "lucide-react";

export default function AdminNoticePage() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchNotices = async () => {
      try {
        const res = await getNotices();
        if (isMounted) setNotices(res.data);
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
  }, []);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toISOString().slice(0, 10);
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
                        {notices.length - index}
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

        {/* 페이지네이션 placeholder */}
        {!isLoading && notices.length > 0 && (
          <div className="mt-4 flex justify-center">
            <nav className="flex items-center gap-1">
              <span className="rounded border border-[#1e4a85] bg-[#1e4a85] px-3 py-1.5 text-sm font-medium text-white">
                1
              </span>
              {/* 차후 페이지 추가 시 확장 */}
            </nav>
          </div>
        )}
      </div>
    </div>
  );
}
