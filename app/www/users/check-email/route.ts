import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import validator from "validator";

import db from "@/lib/db";
import { getCorsHeaders } from "@/lib/api-utils";

export async function OPTIONS(request: NextRequest) {
  return NextResponse.json(
    {},
    { status: 204, headers: getCorsHeaders(request.headers.get("origin")) },
  );
}

// 이 API는 빌드 시점에 정적으로 생성될 것이라고 선언하여 충돌을 피합니다.
export const dynamic = "force-static";

const schema = z.object({
  email: z
    .string({
      error: (issue) =>
        issue.input === undefined ? "이메일은 필수 입력 항목입니다." : undefined,
    })
    .trim()
    .min(1, { message: "이메일은 필수 입력 항목입니다." })
    .toLowerCase()
    .refine((email) => validator.isEmail(email), {
      message: "이메일 형식이 올바르지 않습니다.",
    }),
});

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const result = schema.safeParse(data);
    if (!result.success) {
      const flattenedError = z.flattenError(result.error);
      return NextResponse.json(
        { success: false, error: flattenedError.fieldErrors },
        { status: 400, headers: getCorsHeaders(request.headers.get("origin")) }
      );
    }

    const { email } = result.data;
    const user = await db.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
      },
    });

    if (user) {
      return NextResponse.json(
        { success: false, error: { email: ["이미 사용 중인 이메일입니다."] } },
        { status: 409, headers: getCorsHeaders(request.headers.get("origin")) }
      );
    }

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

