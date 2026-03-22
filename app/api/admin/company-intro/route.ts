import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { z } from "zod";
import getSession from "@/lib/session";
import db from "@/lib/db";

export const dynamic = "force-dynamic";

const CONTENT_PATH = path.join(process.cwd(), "data", "company-intro.html");

const bodySchema = z.object({
  html: z.string().max(2_000_000, "본문이 너무 깁니다."),
});

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

const DEFAULT_HTML = `<p>회사 소개 내용을 입력하세요.</p>`;

export async function GET() {
  const auth = await ensureAdmin();
  if (!auth.ok) {
    return NextResponse.json(
      { success: false, error: auth.message },
      { status: auth.status },
    );
  }
  try {
    const html = await fs.readFile(CONTENT_PATH, "utf8");
    return NextResponse.json({ success: true, html });
  } catch {
    return NextResponse.json({ success: true, html: DEFAULT_HTML });
  }
}

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
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: parsed.error.flatten().fieldErrors.html?.[0] ?? "유효하지 않습니다." },
      { status: 400 },
    );
  }
  try {
    await fs.mkdir(path.dirname(CONTENT_PATH), { recursive: true });
    await fs.writeFile(CONTENT_PATH, parsed.data.html, "utf8");
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { success: false, error: "저장에 실패했습니다." },
      { status: 500 },
    );
  }
}
