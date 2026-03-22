import Link from "next/link";
import { MentorRequestReviewForm } from "@/components/admin/mentor-request-review-form";
import type { MentorRequestReviewDefaults } from "@/components/admin/mentor-request-review-form";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

/** DB 연동 전: 기획서·목업과 동일한 샘플 데이터 (추후 id별 조회로 교체) */
function getMentorRequestDefaults(_id: string): MentorRequestReviewDefaults {
  void _id;
  return {
    name: "한효주",
    phone: "01011111111",
    address: "경기도 안산시 단원구 신각길 18",
    job1: "탤런트",
    job2: "영화배우",
    job3: "",
    email: "abellee@changjaeso.com",
    birthDate: "20160813",
    existingProfileZipName: "한효주.ZIP",
    modifiedProfileZipName: "한효쥬.ZIP",
    modificationMessage:
      "~~에서 ~~로 회사를 이직하여, 프로필을 수정하였습니다.",
  };
}

export default async function AdminMentorRequestPage({ params }: Props) {
  const { id } = await params;
  const defaults = getMentorRequestDefaults(id);

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex flex-wrap items-center gap-4">
        <Link
          href="/admin"
          className="text-sm font-medium text-[#4e73df] hover:underline"
        >
          ← 대시보드
        </Link>
        <span className="text-gray-300">|</span>
        <Link
          href="/admin/mentors"
          className="text-sm font-medium text-gray-600 hover:text-gray-900"
        >
          멘토 관리
        </Link>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          멘토 가입·정보 수정 요청
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          요청을 검토한 뒤 수락 또는 반려할 수 있습니다.
        </p>
      </div>

      <MentorRequestReviewForm requestId={id} defaults={defaults} />
    </div>
  );
}
