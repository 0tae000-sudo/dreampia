import { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  console.log(request);
  return NextResponse.json({
    ok: true,
  });
}

export async function POST(request: NextRequest) {
  const data = await request.json();
  console.log("log the user in!!!");
  //   return Response.json(data);
  return NextResponse.json({
    success: true,
  });
}
