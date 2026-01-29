import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getCorsHeaders } from "@/lib/api-utils";

export async function OPTIONS(request: NextRequest) {
  return NextResponse.json(
    {},
    { status: 204, headers: getCorsHeaders(request.headers.get("origin")) },
  );
}

// 이 API는 빌드 시점에 정적으로 생성될 것이라고 선언하여 충돌을 피합니다.
export const dynamic = "force-static";

const phone1Schema = z
  .string({
    error: (issue) =>
      issue.input === undefined
        ? "전화번호 첫째 자리는 3자리 이하로 입력해주세요."
        : undefined,
  })
  .trim()
  .min(1, { message: "전화번호 첫째 자리는 3자리 이하로 입력해주세요." })
  .max(3, { message: "전화번호 첫째 자리는 3자리 이하로 입력해주세요." })
  .regex(/^[0-9]+$/, { message: "전화번호 첫째 자리는 숫자로 입력해주세요." });

const phone2Schema = z
  .string({
    error: (issue) =>
      issue.input === undefined
        ? "전화번호 둘째 자리는 4자리 이하로 입력해주세요."
        : undefined,
  })
  .trim()
  .min(1, { message: "전화번호 둘째 자리는 4자리 이하로 입력해주세요." })
  .max(4, { message: "전화번호 둘째 자리는 4자리 이하로 입력해주세요." })
  .regex(/^[0-9]+$/, { message: "전화번호 둘째 자리는 숫자로 입력해주세요." });

const phone3Schema = z
  .string({
    error: (issue) =>
      issue.input === undefined
        ? "전화번호 셋째 자리는 4자리 이하로 입력해주세요."
        : undefined,
  })
  .trim()
  .min(1, { message: "전화번호 셋째 자리는 4자리 이하로 입력해주세요." })
  .max(4, { message: "전화번호 셋째 자리는 4자리 이하로 입력해주세요." })
  .regex(/^[0-9]+$/, { message: "전화번호 셋째 자리는 숫자로 입력해주세요." });

const tokenSchema = z.coerce.number().min(100000).max(999999);

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    const phone = data.phone1 + data.phone2 + data.phone3;
    const token = data.token;

    if (
      // 전화번호 토큰이 들어왔을 경우
      phone1Schema.safeParse(data.phone1) &&
      phone2Schema.safeParse(data.phone2) &&
      phone3Schema.safeParse(data.phone3) &&
      tokenSchema.safeParse(data.token)
    ) {
      return NextResponse.json(
        { success: true, error: null },
        { headers: getCorsHeaders(request.headers.get("origin")) }
      );
    } else if (
      phone1Schema.safeParse(data.phone1) &&
      phone2Schema.safeParse(data.phone2) &&
      phone3Schema.safeParse(data.phone3) &&
      !tokenSchema.safeParse(data.token)
    ) {
      // 토큰이 들어왔지 않을 경우 인증번호 발송
      return NextResponse.json(
        { success: true, data: { phone: phone, token: token } },
        { headers: getCorsHeaders(request.headers.get("origin")) }
      );
    } else {
      return NextResponse.json(
        { success: false, error: "Invalid JSON" },
        { status: 400, headers: getCorsHeaders(request.headers.get("origin")) }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Invalid JSON" },
      { status: 400, headers: getCorsHeaders(request.headers.get("origin")) }
    );
  }
}
