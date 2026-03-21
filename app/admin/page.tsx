import Link from "next/link";
import db from "@/lib/db";
import { programTypeLabel } from "@/lib/admin/program-type-labels";

export const dynamic = "force-dynamic";

/** 기획서 플레이스홀더: 나의 업무 */
const MY_TASKS_PLACEHOLDER = [
  {
    id: "1",
    title: "행사 접수등",
    type: "디자인",
    note: "완료되면 수정",
  },
];

/** 기획서 플레이스홀더: 멘토 가입 */
const MENTOR_SIGNUP_PLACEHOLDER = [
  {
    id: "1",
    title: "멘토 가입",
    type: "디자인",
    note: "완료되면 수정",
  },
];

function SectionCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-lg border border-gray-200 bg-white shadow-sm">
      <h2 className="border-b border-gray-100 px-4 py-3 text-lg font-bold text-gray-900">
        {title}
      </h2>
      <div className="overflow-x-auto p-4 pt-0">{children}</div>
    </section>
  );
}

export default async function AdminPage() {
  const eventRequests = await db.eventApplication.findMany({
    orderBy: { created_at: "desc" },
    take: 20,
    select: {
      id: true,
      schoolName: true,
      eventDate: true,
      programType: true,
      expectedQuote: true,
    },
  });

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">대시보드</h1>
        <p className="mt-1 text-sm text-gray-600">
          행사 요청·업무·멘토 가입 현황을 한눈에 확인합니다.
        </p>
      </div>

      {/* 1. 행사요청 */}
      <SectionCard title="행사요청">
        <table className="mt-4 w-full min-w-[640px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50 text-gray-700">
              <th className="px-3 py-2.5 font-semibold">학교명</th>
              <th className="px-3 py-2.5 font-semibold">일자</th>
              <th className="px-3 py-2.5 font-semibold">프로그램명</th>
              <th className="px-3 py-2.5 font-semibold">예산</th>
              <th className="w-24 px-3 py-2.5 text-center font-semibold">
                {/* 기획서 우측 액션 컬럼 */}
              </th>
            </tr>
          </thead>
          <tbody>
            {eventRequests.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-3 py-8 text-center text-gray-500"
                >
                  등록된 행사 요청이 없습니다.
                </td>
              </tr>
            ) : (
              eventRequests.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-gray-100 hover:bg-gray-50/80"
                >
                  <td className="px-3 py-3 font-medium text-gray-900">
                    {row.schoolName}
                  </td>
                  <td className="px-3 py-3 text-gray-700">
                    {row.eventDate.toLocaleDateString("ko-KR", {
                      month: "numeric",
                      day: "numeric",
                    })}
                  </td>
                  <td className="px-3 py-3 text-gray-700">
                    {programTypeLabel(row.programType)}
                  </td>
                  <td className="px-3 py-3 text-gray-700">
                    {row.expectedQuote?.trim() || "—"}
                  </td>
                  <td className="px-3 py-3 text-center">
                    <Link
                      href={`/admin/events/${row.id}`}
                      className="font-medium text-[#4e73df] hover:text-[#224abe] hover:underline"
                    >
                      보기
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </SectionCard>

      {/* 2. 나의 업무 */}
      <SectionCard title="나의 업무">
        <table className="mt-4 w-full min-w-[560px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50 text-gray-700">
              <th className="px-3 py-2.5 font-semibold">업무명</th>
              <th className="px-3 py-2.5 font-semibold">유형</th>
              <th className="px-3 py-2.5 font-semibold">비고</th>
              <th className="w-24 px-3 py-2.5 text-center font-semibold" />
            </tr>
          </thead>
          <tbody>
            {MY_TASKS_PLACEHOLDER.map((row) => (
              <tr
                key={row.id}
                className="border-b border-gray-100 hover:bg-gray-50/80"
              >
                <td className="px-3 py-3 font-medium text-gray-900">
                  {row.title}
                </td>
                <td className="px-3 py-3 text-gray-700">{row.type}</td>
                <td className="px-3 py-3 text-gray-700">{row.note}</td>
                <td className="px-3 py-3 text-center">
                  <Link
                    href="/admin/todos"
                    className="font-medium text-[#4e73df] hover:text-[#224abe] hover:underline"
                  >
                    보기
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </SectionCard>

      {/* 3. 멘토 가입 */}
      <SectionCard title="멘토 가입">
        <table className="mt-4 w-full min-w-[560px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50 text-gray-700">
              <th className="px-3 py-2.5 font-semibold">구분</th>
              <th className="px-3 py-2.5 font-semibold">유형</th>
              <th className="px-3 py-2.5 font-semibold">비고</th>
              <th className="w-24 px-3 py-2.5 text-center font-semibold" />
            </tr>
          </thead>
          <tbody>
            {MENTOR_SIGNUP_PLACEHOLDER.map((row) => (
              <tr
                key={row.id}
                className="border-b border-gray-100 hover:bg-gray-50/80"
              >
                <td className="px-3 py-3 font-medium text-gray-900">
                  {row.title}
                </td>
                <td className="px-3 py-3 text-gray-700">{row.type}</td>
                <td className="px-3 py-3 text-gray-700">{row.note}</td>
                <td className="px-3 py-3 text-center">
                  <Link
                    href="/admin/mentors"
                    className="font-medium text-[#4e73df] hover:text-[#224abe] hover:underline"
                  >
                    보기
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </SectionCard>
    </div>
  );
}
