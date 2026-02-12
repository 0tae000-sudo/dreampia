import { NextRequest, NextResponse } from "next/server";
import { getCorsHeaders } from "@/lib/api-utils";
import getSession from "@/lib/session";
import db from "@/lib/db";
import { z } from "zod";

export const dynamic = "force-dynamic";

const updateNoticeSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "제목을 입력해 주세요.")
    .max(200, "제목은 200자 이하여야 합니다."),
  content: z.string().trim().min(1, "본문을 입력해 주세요."),
  author: z.string().trim().min(1, "작성자를 입력해 주세요."),
  category: z.string().trim().optional(),
});

async function checkAdmin() {
  const session = await getSession();
  if (!session?.id) {
    return { error: "로그인이 필요합니다.", status: 401 as const };
  }
  const user = await db.user.findUnique({
    where: { id: session.id },
    select: { isAdmin: true },
  });
  if (!user?.isAdmin) {
    return { error: "관리자 권한이 필요합니다.", status: 403 as const };
  }
  return null;
}

export async function OPTIONS(request: NextRequest) {
  return NextResponse.json(
    {},
    { status: 204, headers: getCorsHeaders(request.headers.get("origin")) },
  );
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const authError = await checkAdmin();
    if (authError) {
      return NextResponse.json(
        { success: false, error: authError.error },
        {
          status: authError.status,
          headers: getCorsHeaders(request.headers.get("origin")),
        },
      );
    }

    const { id } = await params;
    const noticeId = parseInt(id, 10);
    if (Number.isNaN(noticeId)) {
      return NextResponse.json(
        { success: false, error: "유효하지 않은 공지 ID입니다." },
        { status: 400, headers: getCorsHeaders(request.headers.get("origin")) },
      );
    }

    const notice = await db.notice.findUnique({
      where: { id: noticeId },
    });

    if (!notice) {
      return NextResponse.json(
        { success: false, error: "공지를 찾을 수 없습니다." },
        { status: 404, headers: getCorsHeaders(request.headers.get("origin")) },
      );
    }

    return NextResponse.json(
      { success: true, data: notice },
      { headers: getCorsHeaders(request.headers.get("origin")) },
    );
  } catch (error) {
    console.error("공지 조회 API 오류:", error);
    return NextResponse.json(
      { success: false, error: "공지를 불러오는데 실패했습니다." },
      { status: 500, headers: getCorsHeaders(request.headers.get("origin")) },
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const authError = await checkAdmin();
    if (authError) {
      return NextResponse.json(
        { success: false, error: authError.error },
        {
          status: authError.status,
          headers: getCorsHeaders(request.headers.get("origin")),
        },
      );
    }

    const { id } = await params;
    const noticeId = parseInt(id, 10);
    if (Number.isNaN(noticeId)) {
      return NextResponse.json(
        { success: false, error: "유효하지 않은 공지 ID입니다." },
        { status: 400, headers: getCorsHeaders(request.headers.get("origin")) },
      );
    }

    const body = await request.json();
    const result = await updateNoticeSchema.safeParseAsync(body);

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

    const notice = await db.notice.findUnique({ where: { id: noticeId } });
    if (!notice) {
      return NextResponse.json(
        { success: false, error: "공지를 찾을 수 없습니다." },
        { status: 404, headers: getCorsHeaders(request.headers.get("origin")) },
      );
    }

    const { title, content, author, category } = result.data;

    const updated = await db.notice.update({
      where: { id: noticeId },
      data: {
        title,
        content,
        author,
        category: category || null,
      },
    });

    return NextResponse.json(
      { success: true, data: updated },
      { headers: getCorsHeaders(request.headers.get("origin")) },
    );
  } catch (error) {
    console.error("공지사항 수정 API 오류:", error);
    return NextResponse.json(
      { success: false, error: "공지사항 수정에 실패했습니다." },
      { status: 500, headers: getCorsHeaders(request.headers.get("origin")) },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const authError = await checkAdmin();
    if (authError) {
      return NextResponse.json(
        { success: false, error: authError.error },
        {
          status: authError.status,
          headers: getCorsHeaders(request.headers.get("origin")),
        },
      );
    }

    const { id } = await params;
    const noticeId = parseInt(id, 10);
    if (Number.isNaN(noticeId)) {
      return NextResponse.json(
        { success: false, error: "유효하지 않은 공지 ID입니다." },
        { status: 400, headers: getCorsHeaders(request.headers.get("origin")) },
      );
    }

    const notice = await db.notice.findUnique({ where: { id: noticeId } });
    if (!notice) {
      return NextResponse.json(
        { success: false, error: "공지를 찾을 수 없습니다." },
        { status: 404, headers: getCorsHeaders(request.headers.get("origin")) },
      );
    }

    await db.notice.delete({
      where: { id: noticeId },
    });

    return NextResponse.json(
      { success: true },
      { headers: getCorsHeaders(request.headers.get("origin")) },
    );
  } catch (error) {
    console.error("공지사항 삭제 API 오류:", error);
    return NextResponse.json(
      { success: false, error: "공지사항 삭제에 실패했습니다." },
      { status: 500, headers: getCorsHeaders(request.headers.get("origin")) },
    );
  }
}
