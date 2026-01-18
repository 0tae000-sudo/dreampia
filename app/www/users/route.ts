import { NextRequest, NextResponse } from "next/server";

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

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    console.log("Log the user in!!! Data:", data);

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
