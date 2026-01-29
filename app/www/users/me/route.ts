import { NextRequest, NextResponse } from "next/server";
import { getCorsHeaders } from "@/lib/api-utils";
import getSession from "@/lib/session";
import db from "@/lib/db";

// 세션 쿠키를 확인해야 하므로 동적 처리로 강제합니다.
export const dynamic = "force-dynamic";

export async function OPTIONS(request: NextRequest) {
  return NextResponse.json(
    {},
    { status: 204, headers: getCorsHeaders(request.headers.get("origin")) },
  );
}

export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session.id) {
    return NextResponse.json(
      { success: false, error: "로그인이 필요합니다." },
      { status: 401, headers: getCorsHeaders(request.headers.get("origin")) },
    );
  }

  const user = await db.user.findUnique({
    where: { id: session.id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isTeacher: true,
      isMentor: true,
    },
  });

  if (!user) {
    return NextResponse.json(
      { success: false, error: "사용자를 찾을 수 없습니다." },
      { status: 404, headers: getCorsHeaders(request.headers.get("origin")) },
    );
  }

  return NextResponse.json(
    { success: true, data: user },
    { headers: getCorsHeaders(request.headers.get("origin")) },
  );
}

