import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

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
});

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const result = schema.safeParse(data);
    if (!result.success) {
      const flattenedError = z.flattenError(result.error);
      return NextResponse.json(
        { success: false, error: flattenedError.fieldErrors },
        { status: 400, headers: getCorsHeaders(request.headers.get("origin")) },
      );
    }

    const { phone1, phone2, phone3 } = result.data;
    const phone = `${phone1}${phone2}${phone3}`;
    const user = await db.user.findUnique({
      where: { phone },
      select: { id: true },
    });

    if (user) {
      return NextResponse.json(
        {
          success: false,
          error: { phone1: ["이미 사용 중인 전화번호입니다."] },
        },
        { status: 409, headers: getCorsHeaders(request.headers.get("origin")) },
      );
    }

    return NextResponse.json(
      { success: true },
      { headers: getCorsHeaders(request.headers.get("origin")) },
    );
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid JSON" },
      { status: 400, headers: getCorsHeaders(request.headers.get("origin")) },
    );
  }
}
