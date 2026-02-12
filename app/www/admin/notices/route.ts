import { NextRequest, NextResponse } from "next/server";
import { getCorsHeaders } from "@/lib/api-utils";
import getSession from "@/lib/session";
import db from "@/lib/db";
import { z } from "zod";

export const dynamic = "force-dynamic";

const createNoticeSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "제목을 입력해 주세요.")
    .max(200, "제목은 200자 이하여야 합니다."),
  content: z.string().trim().min(1, "본문을 입력해 주세요."),
  author: z.string().trim().min(1, "작성자를 입력해 주세요."),
  category: z.string().trim().optional(),
});

export async function OPTIONS(request: NextRequest) {
  return NextResponse.json(
    {},
    { status: 204, headers: getCorsHeaders(request.headers.get("origin")) },
  );
}

const DEFAULT_LIMIT = 15;

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.id) {
      return NextResponse.json(
        { success: false, error: "로그인이 필요합니다." },
        { status: 401, headers: getCorsHeaders(request.headers.get("origin")) },
      );
    }

    const user = await db.user.findUnique({
      where: { id: session.id },
      select: { isAdmin: true },
    });

    if (!user?.isAdmin) {
      return NextResponse.json(
        { success: false, error: "관리자 권한이 필요합니다." },
        { status: 403, headers: getCorsHeaders(request.headers.get("origin")) },
      );
    }

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") ?? String(DEFAULT_LIMIT), 10)));
    const skip = (page - 1) * limit;

    const [notices, total] = await Promise.all([
      db.notice.findMany({
        orderBy: { created_at: "desc" },
        skip,
        take: limit,
      }),
      db.notice.count(),
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json(
      { success: true, data: notices, total, totalPages, page, limit },
      { headers: getCorsHeaders(request.headers.get("origin")) },
    );
  } catch (error) {
    console.error("공지사항 목록 API 오류:", error);
    return NextResponse.json(
      { success: false, error: "공지사항 목록을 불러오는데 실패했습니다." },
      { status: 500, headers: getCorsHeaders(request.headers.get("origin")) },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.id) {
      return NextResponse.json(
        { success: false, error: "로그인이 필요합니다." },
        { status: 401, headers: getCorsHeaders(request.headers.get("origin")) },
      );
    }

    const user = await db.user.findUnique({
      where: { id: session.id },
      select: { isAdmin: true },
    });

    if (!user?.isAdmin) {
      return NextResponse.json(
        { success: false, error: "관리자 권한이 필요합니다." },
        { status: 403, headers: getCorsHeaders(request.headers.get("origin")) },
      );
    }

    const body = await request.json();
    const result = await createNoticeSchema.safeParseAsync(body);

    if (!result.success) {
      const fieldErrors: Record<string, string[]> = {};
      result.error.issues.forEach((err: any) => {
        const path = err.path.join(".");
        if (!fieldErrors[path]) fieldErrors[path] = [];
        fieldErrors[path].push(err.message);
      });
      return NextResponse.json(
        { success: false, error: fieldErrors },
        { status: 400, headers: getCorsHeaders(request.headers.get("origin")) },
      );
    }

    const { title, content, author, category } = result.data;

    const notice = await db.notice.create({
      data: {
        title,
        content,
        author,
        category: category || null,
      },
    });

    return NextResponse.json(
      { success: true, data: notice },
      { headers: getCorsHeaders(request.headers.get("origin")) },
    );
  } catch (error) {
    console.error("공지사항 작성 API 오류:", error);
    return NextResponse.json(
      { success: false, error: "공지사항 등록에 실패했습니다." },
      { status: 500, headers: getCorsHeaders(request.headers.get("origin")) },
    );
  }
}
