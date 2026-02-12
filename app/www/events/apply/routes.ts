import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import validator from "validator";

import { getCorsHeaders } from "@/lib/api-utils";

export async function OPTIONS(request: NextRequest) {
  return NextResponse.json(
    {},
    { status: 204, headers: getCorsHeaders(request.headers.get("origin")) },
  );
}

const SCHOOL_LEVELS = ["ELEMENTARY", "MIDDLE", "HIGH", "INSTITUTE"] as const;
const PROGRAM_TYPES = [
  "JOB_LECTURE",
  "JOB_EXPERIENCE",
  "STUDY_CONCERT",
  "JOB_FAIR",
  "CAREER_CAMP",
  "NEW_INDUSTRY",
  "JUNGRANG_ONE_DAY",
  "CAREER_CONCERT",
  "CAREER_PLAY",
  "DIGITAL_CAMP",
] as const;
const STUDENT_CHANGE_TYPES = ["CHANGE_PER_PERIOD", "NO_CHANGE"] as const;
const PROVIDED_ITEMS = ["데스크탑", "노트북", "전자칠판"] as const;

const timeSlotSchema = z.object({
  period: z.coerce.number().int().min(1).max(9),
  startHour: z.coerce.number().int().min(1).max(23),
  startMinute: z.coerce
    .number()
    .int()
    .min(0)
    .max(55)
    .refine((value) => value % 5 === 0, {
      message: "시작(분)은 5분 단위로 입력해주세요.",
    }),
  endHour: z.coerce.number().int().min(1).max(23),
  endMinute: z.coerce
    .number()
    .int()
    .min(0)
    .max(55)
    .refine((value) => value % 5 === 0, {
      message: "종료(분)은 5분 단위로 입력해주세요.",
    }),
});

const schema = z.object({
  schoolName: z
    .string()
    .trim()
    .min(1, { message: "학교(기관)명은 필수입니다." }),
  schoolLevel: z
    .string()
    .trim()
    .refine((value) => SCHOOL_LEVELS.includes(value as any), {
      message: "학교급을 선택해주세요.",
    }),
  postcode: z.string().trim().min(1, { message: "우편번호는 필수입니다." }),
  address: z.string().trim().min(1, { message: "주소는 필수입니다." }),
  detailAddress: z
    .string()
    .trim()
    .min(1, { message: "상세주소는 필수입니다." }),
  managerName: z
    .string()
    .trim()
    .min(1, { message: "담당자 이름은 필수입니다." }),
  managerPosition: z
    .string()
    .trim()
    .min(1, { message: "담당자 직위는 필수입니다." }),
  managerPhone: z
    .string()
    .trim()
    .min(1, { message: "담당자 연락처는 필수입니다." }),
  managerEmail: z
    .string()
    .trim()
    .min(1, { message: "담당자 이메일은 필수입니다." })
    .refine((value) => validator.isEmail(value), {
      message: "담당자 이메일 형식이 올바르지 않습니다.",
    }),
  adminName: z.string().trim().min(1, { message: "행정실 이름은 필수입니다." }),
  adminPosition: z
    .string()
    .trim()
    .min(1, { message: "행정실 직위는 필수입니다." }),
  adminPhone: z
    .string()
    .trim()
    .min(1, { message: "행정실 연락처는 필수입니다." }),
  adminEmail: z
    .string()
    .trim()
    .min(1, { message: "행정실 이메일은 필수입니다." })
    .refine((value) => validator.isEmail(value), {
      message: "행정실 이메일 형식이 올바르지 않습니다.",
    }),
  eventName: z.string().trim().min(1, { message: "행사명은 필수입니다." }),
  programType: z
    .string()
    .trim()
    .refine((value) => PROGRAM_TYPES.includes(value as any), {
      message: "프로그램 종류를 선택해주세요.",
    }),
  eventDate: z
    .string()
    .trim()
    .min(1, { message: "행사일은 필수입니다." })
    .refine((value) => !Number.isNaN(Date.parse(value)), {
      message: "행사일 형식이 올바르지 않습니다.",
    }),
  targetGrades: z
    .array(z.coerce.number().int().min(1).max(6))
    .min(1, { message: "대상학년을 선택해주세요." }),
  totalStudents: z.coerce
    .number()
    .int()
    .min(1, { message: "총참여학생수를 입력해주세요." }),
  studentChangeType: z
    .string()
    .trim()
    .refine((value) => STUDENT_CHANGE_TYPES.includes(value as any), {
      message: "차시당 학생변경 여부를 선택해주세요.",
    }),
  timeSlots: z.array(timeSlotSchema).min(1, {
    message: "행사 시간을 최소 1개 입력해주세요.",
  }),
  mentorRequestCount: z.coerce
    .number()
    .int()
    .min(1, { message: "요청 멘토 수를 입력해주세요." }),
  mentorPreference: z.string().trim().optional(),
  providedItems: z.array(z.enum(PROVIDED_ITEMS)).optional().default([]),
  expectedQuote: z.string().trim().optional(),
  inquiry: z.string().trim().optional(),
});

export async function POST(request: NextRequest) {
  console.log("POST Request received");
  try {
    const data = await request.json();
    console.log(data);
    const result = schema.safeParse(data);
    if (!result.success) {
      const flattenedError = z.flattenError(result.error);
      return NextResponse.json(
        { success: false, error: flattenedError.fieldErrors },
        { status: 400, headers: getCorsHeaders(request.headers.get("origin")) },
      );
    }

    return NextResponse.json(
      { success: true, data: result.data },
      { headers: getCorsHeaders(request.headers.get("origin")) },
    );
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid JSON" },
      { status: 400, headers: getCorsHeaders(request.headers.get("origin")) },
    );
  }
}
