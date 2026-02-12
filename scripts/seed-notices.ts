import "dotenv/config";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "@/lib/generated/prisma/client";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error("DATABASE_URL is not set");
}

const adapter = new PrismaBetterSqlite3({ url: databaseUrl });
const db = new PrismaClient({ adapter });

const noticeTemplates = [
  { title: "[교사] 회원가입 안내", category: "교사" },
  { title: "[멘토] 활동 가이드", category: "멘토" },
  { title: "[일반] MARS 서비스 소개", category: "일반" },
  { title: "[교사] 행사 신청 방법", category: "교사" },
  { title: "2025년 1분기 운영 안내", category: "일반" },
  { title: "[멘토] 프로필 등록 안내", category: "멘토" },
  { title: "[교사] 진로교육 프로그램 안내", category: "교사" },
  { title: "개인정보처리방침 개정 안내", category: "일반" },
  { title: "[교사] 멘토 매칭 신청", category: "교사" },
  { title: "[멘토] 활동 일정 공지", category: "멘토" },
  { title: "서비스 점검 안내", category: "일반" },
  { title: "[교사] 회원정보 수정 제한 안내", category: "교사" },
  { title: "[멘토] 수료 증명서 발급", category: "멘토" },
  { title: "이용약관 변경 안내", category: "일반" },
  { title: "[교사] 1:1 문의 방법", category: "교사" },
  { title: "[멘토] 멘토링 진행 가이드", category: "멘토" },
  { title: "MARS MAKE A REAL STORY 소개", category: "일반" },
  { title: "[교사] 행사 취소 및 환불 안내", category: "교사" },
  { title: "[멘토] 수당 정산 안내", category: "멘토" },
  { title: "공지사항 게시판 이용 안내", category: "일반" },
  { title: "[교사] 학교(기관) 연락처 변경", category: "교사" },
  { title: "[멘토] 자격 요건 안내", category: "멘토" },
  { title: "자주 묻는 질문(FAQ)", category: "일반" },
  { title: "[교사] 학생 인원 변경 신청", category: "교사" },
  { title: "[멘토] 활동 결과 제출", category: "멘토" },
  { title: "고객센터 운영시간 안내", category: "일반" },
  { title: "[교사] 교육 자료 다운로드", category: "교사" },
  { title: "[멘토] 온라인 멘토링 안내", category: "멘토" },
  { title: "2025년 연간 일정 안내", category: "일반" },
  { title: "[교사] 비밀번호 찾기 안내", category: "교사" },
  { title: "[멘토] 멘토링 사진 활용 동의", category: "멘토" },
];

const contentSample = `학생들에게 다양한 진로교육의 기회를 제공하고 싶으신가요?

MARS(달꿈의 멘토링 플랫폼)에서는 교사 회원가입을 통해 다양한 진로·직업 체험 프로그램에 참여하실 수 있습니다.

회원가입 후 행사 신청을 진행해 주시면, 담당자가 검토 후 연락드리겠습니다.
문의사항이 있으시면 고객센터(02-514-1110)로 연락 부탁드립니다.`;

const main = async () => {
  const author = "마스";

  for (let i = 0; i < noticeTemplates.length; i++) {
    const { title, category } = noticeTemplates[i];
    await db.notice.create({
      data: {
        title,
        content: contentSample,
        author,
        category,
        views: Math.floor(Math.random() * 50),
      },
    });
  }

  console.log(`공지사항 ${noticeTemplates.length}건 시드 완료.`);
};

main()
  .then(async () => {
    await db.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await db.$disconnect();
    process.exit(1);
  });
