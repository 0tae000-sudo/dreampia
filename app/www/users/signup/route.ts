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
import getSession from "@/lib/session";

export async function OPTIONS(request: NextRequest) {
  return NextResponse.json(
    {},
    { status: 204, headers: getCorsHeaders(request.headers.get("origin")) },
  );
}

// 이 API는 빌드 시점에 정적으로 생성될 것이라고 선언하여 충돌을 피합니다.
// export const dynamic = "force-static";

const checkUniqueEmail = async (email: string) => {
  const user = await db.user.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
    },
  });
  return Boolean(user) === false;
};

const checkUniquePhone = async (phone: string) => {
  const user = await db.user.findUnique({
    where: {
      phone,
    },
    select: {
      id: true,
    },
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

const baseSchema = z.object({
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
  domain: z.string().trim().optional(),
  howcome: z.string().trim().optional(),
});

const withCommonRefinements = <T extends z.ZodTypeAny>(schema: T) =>
  schema
    .superRefine((data, ctx) => {
      const password = (data as any).password;
      const passwordConfirm = (data as any).passwordConfirm;
      if (password !== passwordConfirm) {
        ctx.addIssue({
          code: "custom",
          message: "비밀번호가 일치하지 않습니다.",
          path: ["passwordConfirm"],
        });
      }
    })
    .superRefine(async (data, ctx) => {
      const { phone1, phone2, phone3 } = data as { phone1?: string, phone2?: string, phone3?: string };
      const phone = `${phone1 ?? ""}${phone2 ?? ""}${phone3 ?? ""}`;
      if (phone1 && phone2 && phone3 && !(await checkUniquePhone(phone))) {
        ctx.addIssue({
          code: "custom",
          message: "이미 사용 중인 전화번호입니다.",
          path: ["phone1"],
        });
      }
    })
    .superRefine(async (data, ctx) => {
      const email = (data as { email?: string }).email;
      if (typeof email === "string" && !(await checkUniqueEmail(email))) {
        ctx.addIssue({
          code: "custom",
          message: "이미 사용 중인 이메일입니다.",
          path: ["email"],
          fatal: true,
        });
        return z.NEVER;
      }
    });

const teacherSchema = withCommonRefinements(
  baseSchema.extend({
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
  }),
);

const mentorSchema = withCommonRefinements(
  baseSchema.extend({
    name: z
      .string({
        error: (issue) =>
          issue.input === undefined ? "이름은 필수 입력 항목입니다." : undefined,
      })
      .trim()
      .min(1, { message: "이름은 필수 입력 항목입니다." }),
    graduationYear: z
      .string({
        error: (issue) =>
          issue.input === undefined
            ? "졸업연도는 필수 입력 항목입니다."
            : undefined,
      })
      .trim()
      .min(1, { message: "졸업연도는 필수 입력 항목입니다." }),
    schoolName: z
      .string({
        error: (issue) =>
          issue.input === undefined
            ? "학교명은 필수 입력 항목입니다."
            : undefined,
      })
      .trim()
      .min(1, { message: "학교명은 필수 입력 항목입니다." }),
    major: z
      .string({
        error: (issue) =>
          issue.input === undefined ? "전공은 필수 입력 항목입니다." : undefined,
      })
      .trim()
      .min(1, { message: "전공은 필수 입력 항목입니다." }),
    selfIntroduction: z
      .string({
        error: (issue) =>
          issue.input === undefined
            ? "한줄 자기소개는 필수 입력 항목입니다."
            : undefined,
      })
      .trim()
      .min(1, { message: "한줄 자기소개는 필수 입력 항목입니다." }),
  }),
);

const toNullableString = (value: unknown) => {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length ? trimmed : null;
};

const sanitizeLines = <T extends Record<string, unknown>>(
  lines: T[] | undefined,
) => {
  if (!lines?.length) return [];
  return lines
    .map((line) => {
      const cleaned = Object.fromEntries(
        Object.entries(line).map(([key, value]) => [key, toNullableString(value)]),
      );
      return cleaned as Record<string, string | null>;
    })
    .filter((line) => Object.values(line).some((value) => value));
};

const normalizeMentorJobs = (data: Record<string, any>) => {
  if (Array.isArray(data.jobs)) {
    return data.jobs;
  }
  if (Array.isArray(data.jobSelections) && Array.isArray(data.jobDetails)) {
    return data.jobSelections
      .map((title: unknown, index: number) => ({
        title,
        ...data.jobDetails[index],
      }))
      .filter((job: { title?: string }) => typeof job.title === "string");
  }
  const jobTitles = [data.job1, data.job2, data.job3];
  if (jobTitles.some((title) => typeof title === "string" && title.trim())) {
    return jobTitles
      .map((title) => ({ title }))
      .filter((job) => typeof job.title === "string");
  }
  return [];
};

export async function POST(request: NextRequest) {
  try {
    const data = (await request.json()) as Record<string, any>;
    const isTeacherSignup =
      typeof data.teacherName === "string" && data.teacherName.trim() !== "";
    const schema = isTeacherSignup ? teacherSchema : mentorSchema;
    const result = await schema.safeParseAsync(data);
    if (!result.success) {
      const fieldErrors = result.error.issues.reduce<Record<string, string[]>>(
        (acc, issue) => {
          const key = issue.path.join(".") || "formErrors";
          if (!acc[key]) acc[key] = [];
          acc[key].push(issue.message);
          return acc;
        },
        {},
      );
      console.log(fieldErrors);
      return NextResponse.json(
        { success: false, error: fieldErrors },
        { status: 400, headers: getCorsHeaders(request.headers.get("origin")) },
      );
    } else {
      const hashedPassword = await bcrypt.hash(data.password, 12);
      const phone = `${data.phone1}${data.phone2}${data.phone3}`;
      const mentorJobs = normalizeMentorJobs(data)
        .map((job: any, index: number) => ({
          title: typeof job.title === "string" ? job.title.trim() : "",
          order: index + 1,
          careers: sanitizeLines(job.career),
          certificates: sanitizeLines(job.certificates),
          awards: sanitizeLines(job.awards),
          lectures: sanitizeLines(job.lectures),
        }))
        .filter((job) => job.title);
      const user = await db.user.create({
        data: {
          email: data.email,
          password: hashedPassword,
          name: isTeacherSignup ? data.teacherName : data.name,
          phone,
          howcome: isTeacherSignup ? undefined : data.howcome,
          graduationYear: isTeacherSignup ? undefined : data.graduationYear,
          schoolName: data.schoolName,
          major: isTeacherSignup ? undefined : data.major,
          introduction: isTeacherSignup ? undefined : data.selfIntroduction,
          isTeacher: isTeacherSignup ? true : undefined,
          isMentor: isTeacherSignup ? undefined : true,
          mentorProfile: isTeacherSignup
            ? undefined
            : {
                create: {
                  ...(mentorJobs.length
                    ? {
                        jobs: {
                          create: mentorJobs.map((job) => ({
                            title: job.title,
                            order: job.order,
                            ...(job.careers.length
                              ? { careers: { create: job.careers } }
                              : {}),
                            ...(job.certificates.length
                              ? { certificates: { create: job.certificates } }
                              : {}),
                            ...(job.awards.length
                              ? { awards: { create: job.awards } }
                              : {}),
                            ...(job.lectures.length
                              ? { lectures: { create: job.lectures } }
                              : {}),
                          })),
                        },
                      }
                    : {}),
                },
              },
        },
        select: {
          id: true,
        },
      });
      const session = await getSession();
      session.id = user.id;
      await session.save();
      return NextResponse.json(
        { success: true, data: user.id },
        { headers: getCorsHeaders(request.headers.get("origin")) } // 헤더 추가
      );
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { success: false, error: "Invalid JSON" },
      { status: 400, headers: getCorsHeaders(request.headers.get("origin")) }
    );
  }
}
