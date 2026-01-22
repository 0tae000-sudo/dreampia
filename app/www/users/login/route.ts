import { NextRequest, NextResponse } from "next/server";

import {
  PASSWORD_MIN_LENGTH,
  PASSWORD_REGEX,
  PASSWORD_REGEX_ERROR,
} from "@/lib/constants";
import { z } from "zod";

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
});

// 1. 모든 응답에 공통으로 사용할 CORS 헤더
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// 2. 앱 빌드(output: export) 시 에러 방지를 위한 설정
// 이 API는 빌드 시점에 정적으로 생성될 것이라고 선언하여 충돌을 피합니다.
export const dynamic = "force-static";

// 3. 브라우저/앱의 사전 검사(Preflight) 요청 처리
export async function OPTIONS() {
  return NextResponse.json({}, { status: 204, headers: corsHeaders });
}

export async function GET(request: NextRequest) {
  console.log("GET Request received");
  return NextResponse.json(
    { ok: true },
    { headers: corsHeaders } // 헤더 추가
  );
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    const result = formSchema.safeParse(data);
    if (!result.success) {
      const flattenedError = z.flattenError(result.error);
      return NextResponse.json(
        { success: false, error: flattenedError.fieldErrors },
        { status: 400, headers: corsHeaders }
      );
    }
    return NextResponse.json(
      { success: true, data: result.data },
      { headers: corsHeaders } // 헤더 추가
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Invalid JSON" },
      { status: 400, headers: corsHeaders }
    );
  }
}
