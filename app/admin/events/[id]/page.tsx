import Link from "next/link";
import { notFound } from "next/navigation";
import db from "@/lib/db";
import { programTypeLabel } from "@/lib/admin/program-type-labels";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function AdminEventApplicationDetailPage({ params }: Props) {
  const { id } = await params;
  const numericId = Number(id);
  if (!Number.isFinite(numericId)) notFound();

  const application = await db.eventApplication.findUnique({
    where: { id: numericId },
  });
  if (!application) notFound();

  const dateStr = application.eventDate.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin"
          className="text-sm font-medium text-[#4e73df] hover:underline"
        >
          ← 대시보드
        </Link>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h1 className="text-xl font-bold text-gray-900">행사 요청 상세</h1>
        <p className="mt-1 text-sm text-gray-500">신청 ID #{application.id}</p>

        <dl className="mt-6 grid gap-4 text-sm sm:grid-cols-2">
          <div>
            <dt className="font-semibold text-gray-700">학교명</dt>
            <dd className="mt-1 text-gray-900">{application.schoolName}</dd>
          </div>
          <div>
            <dt className="font-semibold text-gray-700">일자</dt>
            <dd className="mt-1 text-gray-900">{dateStr}</dd>
          </div>
          <div>
            <dt className="font-semibold text-gray-700">프로그램명</dt>
            <dd className="mt-1 text-gray-900">
              {programTypeLabel(application.programType)}
            </dd>
          </div>
          <div>
            <dt className="font-semibold text-gray-700">행사명</dt>
            <dd className="mt-1 text-gray-900">{application.eventName}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="font-semibold text-gray-700">예산(견적)</dt>
            <dd className="mt-1 text-gray-900">
              {application.expectedQuote?.trim() || "—"}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
