import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  PASSWORD_MIN_LENGTH,
  PASSWORD_REGEX,
  PASSWORD_REGEX_ERROR,
} from "@/lib/constants";
import validator from "validator";
import { getCorsHeaders } from "@/lib/api-utils";
import db from "@/lib/db";
import bcrypt from "bcrypt";
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";

export async function OPTIONS(request: NextRequest) {
  return NextResponse.json(
    {},
    { status: 204, headers: getCorsHeaders(request.headers.get("origin")) },
  );
}

// 이 API는 빌드 시점에 정적으로 생성될 것이라고 선언하여 충돌을 피합니다.
// export const dynamic = "force-static";

const checkPassword = ({
  password, passwordConfirm
}: {password: string, passwordConfirm: string}) => password === passwordConfirm;

const checkUniqueEmail = async (email: string) => {
  const user = await db.user.findUnique({
    where: {
      email,
    },
    select:{
      id: true,
    }
  });
  return Boolean(user) === false; 
};

const checkUniquePhone = async (phone: string) => {
  const user = await db.user.findUnique({
    where: {
      phone,
    },
    select:{
      id: true,
    }
  });
  return Boolean(user) === false; 
};

export async function GET(request: NextRequest) {
  console.log("GET Request received");
  return NextResponse.json(
    { ok: true },
    { headers: getCorsHeaders(request.headers.get("origin")) } // 헤더 추가
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
      })
      .refine(checkUniqueEmail, {
        message: "이미 사용 중인 이메일입니다.",
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
  })
  .superRefine(async ({phone1, phone2, phone3}, ctx)=>{
    const phone = `${phone1}${phone2}${phone3}`;
    if (!(await checkUniquePhone(phone))) {
      ctx.addIssue({
        code: "custom",
        message: "이미 사용 중인 전화번호입니다.",
        path: ["phone1"],
      });
    }
  })
  ;

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    const result = await schema.safeParseAsync(data);
    if (!result.success) {
      const flattenedError = z.flattenError(result.error);
      return NextResponse.json(
        { success: false, error: flattenedError.fieldErrors },
        { status: 400, headers: getCorsHeaders(request.headers.get("origin")) }
      );
    }else{
      const hashedPassword = await bcrypt.hash(data.password, 12);
      const user = await db.user.create({
        data: {
          email: data.email,
          password: hashedPassword,
          name: data.teacherName,
          phone: data.phone1 + data.phone2 + data.phone3,
        },
        select:{
          id: true,
        }
      });
      console.log("session", user)
      const session = await getIronSession(await cookies(), {
        cookieName: "dreampia",
        password: process.env.COOKIE_PASSWORD!,
        cookieOptions: {
          sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
          secure: process.env.NODE_ENV === "production",
          httpOnly: true,
        },
      });
      // @ts-ignore
      session.id = user.id;
      await session.save();
      return NextResponse.json(
        { success: true, data: user.id },
        { headers: getCorsHeaders(request.headers.get("origin")) } // 헤더 추가
      );
    }
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { success: false, error: "Invalid JSON" },
      { status: 400, headers: getCorsHeaders(request.headers.get("origin")) }
    );
  }
}
