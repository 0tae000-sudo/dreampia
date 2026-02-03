import { NextRequest, NextResponse } from "next/server";
import { getCorsHeaders } from "@/lib/api-utils";
import {
  PASSWORD_MIN_LENGTH,
  PASSWORD_REGEX,
  PASSWORD_REGEX_ERROR,
} from "@/lib/constants";
import { z } from "zod";
import bcrypt from "bcrypt";
import getSession, { SESSION_MAX_AGE, sessionOptions } from "@/lib/session";
import db from "@/lib/db";

export async function OPTIONS(request: NextRequest) {
  return NextResponse.json(
    {},
    { status: 204, headers: getCorsHeaders(request.headers.get("origin")) },
  );
}

// 로그인 시 세션 쿠키를 수정해야 하므로 동적 처리로 강제합니다.
export const dynamic = "force-dynamic";

const formSchema = z.object({
  email: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "이메일은 필수 입력 항목입니다."
          : undefined,
    })
    .trim()
    .min(1, { message: "이메일은 필수 입력 항목입니다." }),
  password: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "비밀번호는 필수 입력 항목입니다."
          : undefined,
    })
    .trim()
    .min(1, { message: "비밀번호는 필수 입력 항목입니다." })
    .min(PASSWORD_MIN_LENGTH, {
      message: PASSWORD_REGEX_ERROR,
    })
    .regex(PASSWORD_REGEX, {
      message: PASSWORD_REGEX_ERROR,
    }),
  rememberMe: z.boolean().optional().default(false),
});

export async function GET(request: NextRequest) {
  console.log("GET Request received");
  return NextResponse.json(
    { ok: true },
    { headers: getCorsHeaders(request.headers.get("origin")) } // 헤더 추가
  );
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const result = await formSchema.safeParseAsync(data);
    if (!result.success) {
      const flattenedError = z.flattenError(result.error);
      return NextResponse.json(
        { success: false, error: flattenedError.fieldErrors },
        { status: 400, headers: getCorsHeaders(request.headers.get("origin")) }
      );
    }
    const user = await db.user.findUnique({
      where: { email: data.email },
      select: {
        id: true,
        password: true,
      },
    });
    const isPasswordValid = user
      ? await bcrypt.compare(data.password, user.password)
      : false;
    if (!user || !isPasswordValid) {
      return NextResponse.json(
        { success: false, error: "이메일 또는 비밀번호가 올바르지 않습니다." },
        { status: 400, headers: getCorsHeaders(request.headers.get("origin")) }
      );
    }
    const session = await getSession();
    session.id = user.id;
    session.rememberMe = result.data.rememberMe;
    if (result.data.rememberMe) {
      session.updateConfig({
        ...sessionOptions,
        ttl: SESSION_MAX_AGE,
        cookieOptions: {
          ...sessionOptions.cookieOptions,
          maxAge: SESSION_MAX_AGE,
        },
      });
    } else {
      session.updateConfig({
        ...sessionOptions,
        cookieOptions: {
          ...sessionOptions.cookieOptions,
          maxAge: undefined,
        },
      });
    }
    await session.save();
    console.log("session", session);
    const response = NextResponse.json(
      { success: true, data: user.id },
      { headers: getCorsHeaders(request.headers.get("origin")) } // 헤더 추가
    );
    response.cookies.set("dreampia_session", "1", {
      path: "/",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: SESSION_MAX_AGE,
    });
    return response;
  } catch (error) {
    console.log("error", error);
    return NextResponse.json(
      { success: false, error: "Invalid JSON" },
      { status: 400, headers: getCorsHeaders(request.headers.get("origin")) }
    );
  }
}
