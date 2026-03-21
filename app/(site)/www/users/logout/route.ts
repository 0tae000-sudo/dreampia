import { NextRequest, NextResponse } from "next/server";
import { getCorsHeaders } from "@/lib/api-utils";
import getSession from "@/lib/session";

// 세션 쿠키를 수정해야 하므로 동적 처리로 강제합니다.
export const dynamic = "force-dynamic";

export async function OPTIONS(request: NextRequest) {
  return NextResponse.json(
    {},
    { status: 204, headers: getCorsHeaders(request.headers.get("origin")) },
  );
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  await session.destroy();
  const response = NextResponse.json(
    { success: true },
    { headers: getCorsHeaders(request.headers.get("origin")) },
  );
  response.cookies.set("dreampia_session", "", {
    path: "/",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 0,
  });
  return response;
}

