import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { z } from "zod";
import getSession from "@/lib/session";
import db from "@/lib/db";

export const dynamic = "force-dynamic";

const DATA_DIR = path.join(process.cwd(), "data");
const SERVICE_PATH = path.join(DATA_DIR, "terms-service.txt");
const PRIVACY_PATH = path.join(DATA_DIR, "terms-privacy.txt");

const DEFAULT_SERVICE = `제1조 (목적)
본 약관은 달꿈(이하 "회사")이 운영하는 웹사이트(www.dalkkum.com)에서 제공하는 서비스 이용과 관련하여 회사와 회원 간의 권리·의무 및 책임사항을 규정함을 목적으로 합니다.

제2조 (정의)
1. "회원"이란 본 약관에 동의하고 회사와 서비스 이용계약을 체결한 자를 말합니다.
2. "아이디(ID)"란 회원 식별과 서비스 이용을 위해 회원이 설정하고 회사가 승인한 문자와 숫자의 조합을 말합니다.

(아래에 약관 본문을 이어서 작성하세요.)`;

const DEFAULT_PRIVACY = `달꿈(www.dalkkum.com)은 이용자의 개인정보를 중요시하며, 관련 법령에 따라 개인정보를 보호하고 있습니다.

1. 수집하는 개인정보 항목
2. 개인정보의 수집·이용 목적
3. 개인정보의 보유 및 이용 기간
4. 개인정보의 파기 절차 및 방법
5. 이용자의 권리와 행사 방법

(아래에 개인정보취급방침 본문을 이어서 작성하세요.)`;

async function ensureAdmin() {
  const session = await getSession();
  if (!session?.id) {
    return { ok: false as const, status: 401, message: "로그인이 필요합니다." };
  }
  const user = await db.user.findUnique({
    where: { id: session.id },
    select: { isAdmin: true },
  });
  if (!user?.isAdmin) {
    return { ok: false as const, status: 403, message: "관리자 권한이 필요합니다." };
  }
  return { ok: true as const };
}

async function readFileOrDefault(filePath: string, fallback: string) {
  try {
    return await fs.readFile(filePath, "utf8");
  } catch {
    return fallback;
  }
}

export async function GET() {
  const auth = await ensureAdmin();
  if (!auth.ok) {
    return NextResponse.json(
      { success: false, error: auth.message },
      { status: auth.status },
    );
  }
  const [serviceTerms, privacyPolicy] = await Promise.all([
    readFileOrDefault(SERVICE_PATH, DEFAULT_SERVICE),
    readFileOrDefault(PRIVACY_PATH, DEFAULT_PRIVACY),
  ]);
  return NextResponse.json({ success: true, serviceTerms, privacyPolicy });
}

const postSchema = z.discriminatedUnion("section", [
  z.object({
    section: z.literal("service"),
    content: z.string().max(2_000_000, "본문이 너무 깁니다."),
  }),
  z.object({
    section: z.literal("privacy"),
    content: z.string().max(2_000_000, "본문이 너무 깁니다."),
  }),
]);

export async function POST(request: NextRequest) {
  const auth = await ensureAdmin();
  if (!auth.ok) {
    return NextResponse.json(
      { success: false, error: auth.message },
      { status: auth.status },
    );
  }
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "잘못된 요청입니다." },
      { status: 400 },
    );
  }
  const parsed = postSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: "유효하지 않은 요청입니다." },
      { status: 400 },
    );
  }
  const targetPath =
    parsed.data.section === "service" ? SERVICE_PATH : PRIVACY_PATH;
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(targetPath, parsed.data.content, "utf8");
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { success: false, error: "저장에 실패했습니다." },
      { status: 500 },
    );
  }
}
