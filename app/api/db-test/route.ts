import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET() {
  // const suffix = Date.now().toString();

  try {
    const smsToken = await db.sMSToken.findUnique({
      where: {
        id: 1,
      },
    });
    console.log(smsToken);

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: (error as Error).message },
      { status: 500 },
    );
  }
}

