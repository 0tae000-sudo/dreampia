import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  PASSWORD_MIN_LENGTH,
  PASSWORD_REGEX,
  PASSWORD_REGEX_ERROR,
} from "@/lib/constants";
import validator from "validator";

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

const schema = z
  .object({
    schoolName: z
      .string({
        error: (issue) =>
          issue.input === undefined
            ? "학교(기관)명은 필수 입력 항목입니다."
            : undefined,
      })
      .trim()
      .min(1, { message: "학교(기관)명은 필수 입력 항목입니다." }),
    schoolLevel: z
      .string({
        error: (issue) =>
          issue.input === undefined
            ? "학교급은 필수 입력 항목입니다."
            : undefined,
      })
      .trim()
      .min(1, { message: "학교급은 필수 입력 항목입니다." }),
    postcode: z
      .string({
        error: (issue) =>
          issue.input === undefined
            ? "우편번호는 필수 입력 항목입니다."
            : undefined,
      })
      .trim()
      .min(1, { message: "우편번호는 필수 입력 항목입니다." }),
    address: z
      .string({
        error: (issue) =>
          issue.input === undefined
            ? "주소는 필수 입력 항목입니다."
            : undefined,
      })
      .trim()
      .min(1, { message: "주소는 필수 입력 항목입니다." }),
    detailAddress: z
      .string({
        error: (issue) =>
          issue.input === undefined
            ? "상세주소는 필수 입력 항목입니다."
            : undefined,
      })
      .trim()
      .min(1, { message: "상세주소는 필수 입력 항목입니다." }),
    teacherName: z
      .string({
        error: (issue) =>
          issue.input === undefined
            ? "교사(담당자)명은 필수 입력 항목입니다."
            : undefined,
      })
      .trim()
      .min(1, { message: "교사(담당자)명은 필수 입력 항목입니다." }),
    position: z
      .string({
        error: (issue) =>
          issue.input === undefined
            ? "직위는 필수 입력 항목입니다."
            : undefined,
      })
      .trim()
      .min(1, { message: "직위는 필수 입력 항목입니다." }),
    phone1: z
      .string({
        error: (issue) =>
          issue.input === undefined
            ? "전화번호는 필수 입력 항목입니다."
            : undefined,
      })
      .trim()
      .min(1, { message: "전화번호는 필수 입력 항목입니다." })
      .max(3, { message: "전화번호 첫째 자리는 3자리 이하로 입력해주세요." }),
    phone2: z
      .string({
        error: (issue) =>
          issue.input === undefined
            ? "전화번호는 필수 입력 항목입니다."
            : undefined,
      })
      .trim()
      .min(1, { message: "전화번호는 필수 입력 항목입니다." })
      .max(4, { message: "전화번호 둘째 자리는 4자리 이하로 입력해주세요." }),
    phone3: z
      .string({
        error: (issue) =>
          issue.input === undefined
            ? "전화번호는 필수 입력 항목입니다."
            : undefined,
      })
      .trim()
      .min(1, { message: "전화번호는 필수 입력 항목입니다." })
      .max(4, { message: "전화번호 셋째 자리는 4자리 이하로 입력해주세요." }),
    password: z
      .string()
      .min(PASSWORD_MIN_LENGTH, {
        message: PASSWORD_REGEX_ERROR,
      })
      .regex(PASSWORD_REGEX, {
        message: PASSWORD_REGEX_ERROR,
      }),
    passwordConfirm: z.string().min(PASSWORD_MIN_LENGTH, {
      message: PASSWORD_REGEX_ERROR,
    }),
    email: z
      .string({
        error: (issue) =>
          issue.input === undefined
            ? "이메일은 필수 입력 항목입니다."
            : undefined,
      })
      .trim()
      .min(1, { message: "이메일은 필수 입력 항목입니다." })
      .toLowerCase()
      .refine((email) => validator.isEmail(email), {
        message: "이메일 형식이 올바르지 않습니다.",
      }),
    domain: z
      .string({
        error: (issue) =>
          issue.input === undefined
            ? "도메인은 필수 입력 항목입니다."
            : undefined,
      })
      .trim()
      .min(1, { message: "도메인은 필수 입력 항목입니다." }),
  })
  .superRefine(({ password, passwordConfirm }, ctx) => {
    if (password !== passwordConfirm) {
      ctx.addIssue({
        code: "custom",
        message: "비밀번호가 일치하지 않습니다.",
        path: ["passwordConfirm"],
      });
    }
  });

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    console.log("Sign up the user!!! Data:", data);

    const result = schema.safeParse(data);
    if (!result.success) {
      const flattenedError = z.flattenError(result.error);
      return NextResponse.json(
        { success: false, error: flattenedError.fieldErrors },
        { status: 400, headers: corsHeaders }
      );
    }
    return NextResponse.json(
      { success: true },
      { headers: corsHeaders } // 헤더 추가
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Invalid JSON" },
      { status: 400, headers: corsHeaders }
    );
  }
}
