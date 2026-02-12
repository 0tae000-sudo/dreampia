import Link from "next/link";

export default async function AdminNoticeEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="rounded-lg border border-gray-200 bg-white p-12 text-center">
        <p className="text-gray-500">
          공지사항 수정 페이지 (준비 중) - ID: {id}
        </p>
        <Link
          href="/admin/notice"
          className="mt-4 inline-block text-sm font-medium text-[#1e4a85] hover:underline"
        >
          목록으로
        </Link>
      </div>
    </div>
  );
}
