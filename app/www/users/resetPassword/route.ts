import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getCorsHeaders } from "@/lib/api-utils";
import db from "@/lib/db";
import bcrypt from "bcrypt";
import {
  PASSWORD_MIN_LENGTH,
  PASSWORD_REGEX,
  PASSWORD_REGEX_ERROR,
} from "@/lib/constants";

export async function OPTIONS(request: NextRequest) {
  return NextResponse.json(
    {},
    { status: 204, headers: getCorsHeaders(request.headers.get("origin")) },
  );
}

export const dynamic = "force-dynamic";

const phone1Schema = z
  .string()
  .trim()
  .min(1, { message: "전화번호 첫째 자리는 3자리 이하로 입력해주세요." })
  .max(3, { message: "전화번호 첫째 자리는 3자리 이하로 입력해주세요." })
  .regex(/^[0-9]+$/, { message: "전화번호 첫째 자리는 숫자로 입력해주세요." });

const phone2Schema = z
  .string()
  .trim()
  .min(1, { message: "전화번호 둘째 자리는 4자리 이하로 입력해주세요." })
  .max(4, { message: "전화번호 둘째 자리는 4자리 이하로 입력해주세요." })
  .regex(/^[0-9]+$/, { message: "전화번호 둘째 자리는 숫자로 입력해주세요." });

const phone3Schema = z
  .string()
  .trim()
  .min(1, { message: "전화번호 셋째 자리는 4자리 이하로 입력해주세요." })
  .max(4, { message: "전화번호 셋째 자리는 4자리 이하로 입력해주세요." })
  .regex(/^[0-9]+$/, { message: "전화번호 셋째 자리는 숫자로 입력해주세요." });

const tokenSchema = z
  .string()
  .trim()
  .regex(/^\d{4}$/, { message: "인증번호는 4자리 숫자입니다." });

const emailSchema = z
  .string({
    error: (issue) =>
      issue.input === undefined ? "이메일은 필수 입력 항목입니다." : undefined,
  })
  .trim()
  .email({ message: "이메일 형식이 올바르지 않습니다." });

const nameSchema = z
  .string({
    error: (issue) =>
      issue.input === undefined ? "이름은 필수 입력 항목입니다." : undefined,
  })
  .trim()
  .min(1, { message: "이름은 필수 입력 항목입니다." });

const passwordSchema = z
  .string()
  .min(PASSWORD_MIN_LENGTH, { message: PASSWORD_REGEX_ERROR })
  .regex(PASSWORD_REGEX, { message: PASSWORD_REGEX_ERROR });

const requestSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  phone1: phone1Schema,
  phone2: phone2Schema,
  phone3: phone3Schema,
  token: tokenSchema,
  password: passwordSchema,
});

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

    const { name, email, phone1, phone2, phone3, token, password } =
      parsed.data;
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

    const user = await db.user.findUnique({
      where: { email },
      select: { id: true, phone: true, name: true },
    });
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "일치하는 회원이 없습니다.",
          error: { email: ["일치하는 회원이 없습니다."] },
        },
        { status: 404, headers: getCorsHeaders(request.headers.get("origin")) }
      );
    }
    if (user.phone !== phone) {
      return NextResponse.json(
        {
          success: false,
          message: "일치하는 회원이 없습니다.",
          error: { phone1: ["일치하는 회원이 없습니다."] },
        },
        { status: 404, headers: getCorsHeaders(request.headers.get("origin")) }
      );
    }
    if (user.name !== name) {
      return NextResponse.json(
        {
          success: false,
          message: "일치하는 회원이 없습니다.",
          error: { name: ["일치하는 회원이 없습니다."] },
        },
        { status: 404, headers: getCorsHeaders(request.headers.get("origin")) }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await db.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });
    await db.phoneVerificationToken.deleteMany({ where: { phone } });

    return NextResponse.json(
      { success: true },
      { headers: getCorsHeaders(request.headers.get("origin")) }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Invalid JSON" },
      { status: 400, headers: getCorsHeaders(request.headers.get("origin")) }
    );
  }
}

