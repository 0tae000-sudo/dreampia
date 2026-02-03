import { NextRequest, NextResponse } from "next/server";
import { getCorsHeaders } from "@/lib/api-utils";
import { z } from "zod";
import db from "@/lib/db";

export async function OPTIONS(request: NextRequest) {
  return NextResponse.json(
    {},
    { status: 204, headers: getCorsHeaders(request.headers.get("origin")) },
  );
}

// 토큰 검증 및 DB 조회가 필요하므로 동적으로 처리합니다.
export const dynamic = "force-dynamic";

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

const tokenSchema = z
  .string()
  .trim()
  .regex(/^\d{4}$/, { message: "인증번호는 4자리 숫자입니다." });

const nameSchema = z
  .string({
    error: (issue) =>
      issue.input === undefined ? "이름은 필수 입력 항목입니다." : undefined,
  })
  .trim()
  .min(1, { message: "이름은 필수 입력 항목입니다." });

const requestSchema = z.object({
  name: nameSchema,
  phone1: phone1Schema,
  phone2: phone2Schema,
  phone3: phone3Schema,
  token: tokenSchema,
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
    const parsed = requestSchema.safeParse(data);
    if (!parsed.success) {
      const flattenedError = z.flattenError(parsed.error);
      return NextResponse.json(
        {
          success: false,
          message: "입력값을 확인해주세요.",
          error: flattenedError.fieldErrors,
        },
        { status: 400, headers: getCorsHeaders(request.headers.get("origin")) }
      );
    }
    const { name, phone1, phone2, phone3, token } = parsed.data;
    const phone = `${phone1}${phone2}${phone3}`;

    const record = await db.phoneVerificationToken.findUnique({
      where: { phone },
    });
    if (!record || record.expiresAt.getTime() < Date.now()) {
      await db.phoneVerificationToken.deleteMany({ where: { phone } });
      return NextResponse.json(
        {
          success: false,
          message: "인증번호가 만료되었거나 유효하지 않습니다.",
          error: { token: ["인증번호가 만료되었거나 유효하지 않습니다."] },
        },
        { status: 400, headers: getCorsHeaders(request.headers.get("origin")) }
      );
    }
    if (record.token !== token) {
      return NextResponse.json(
        {
          success: false,
          message: "인증번호가 올바르지 않습니다.",
          error: { token: ["인증번호가 올바르지 않습니다."] },
        },
        { status: 400, headers: getCorsHeaders(request.headers.get("origin")) }
      );
    }

    await db.phoneVerificationToken.deleteMany({ where: { phone } });

    const user = await db.user.findFirst({
      where: { phone, name },
      select: { email: true },
    });
    if (!user?.email) {
      return NextResponse.json(
        {
          success: false,
          message: "일치하는 회원이 없습니다.",
          error: { name: ["일치하는 회원이 없습니다."] },
        },
        { status: 404, headers: getCorsHeaders(request.headers.get("origin")) }
      );
    }
    return NextResponse.json(
      { success: true, data: { email: user.email } },
      { headers: getCorsHeaders(request.headers.get("origin")) } // 헤더 추가
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Invalid JSON" },
      { status: 400, headers: getCorsHeaders(request.headers.get("origin")) }
    );
  }
}
