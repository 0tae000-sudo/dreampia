import { NextRequest, NextResponse } from "next/server";
import { getCorsHeaders } from "@/lib/api-utils";
import { z } from "zod";

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
    console.log("findId!!", data);

    const result =
      phone1Schema.safeParse(data.phone1) &&
      phone2Schema.safeParse(data.phone2) &&
      phone3Schema.safeParse(data.phone3) &&
      tokenSchema.safeParse(data.token);

    console.log("result", result);
    if (!result.success) {
      const flattenedError = z.flattenError(result.error);
      return NextResponse.json(
        { success: false, error: flattenedError.fieldErrors },
        { status: 400, headers: getCorsHeaders(request.headers.get("origin")) }
      );
    }
    return NextResponse.json(
      { success: true, data: result.data },
      { headers: getCorsHeaders(request.headers.get("origin")) } // 헤더 추가
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Invalid JSON" },
      { status: 400, headers: getCorsHeaders(request.headers.get("origin")) }
    );
  }
}
