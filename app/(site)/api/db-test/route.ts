import { NextResponse } from "next/server";

export const dynamic = "force-static";

export async function GET() {
  try {
    const isApp = process.env.NEXT_PUBLIC_IS_APP === "true";
    if (!isApp) {
      const { default: db } = await import("@/lib/db");
      const smsToken = await db.sMSToken.findUnique({
        where: {
          id: 1,
        },
      });
      console.log(smsToken);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: (error as Error).message },
      { status: 500 },
    );
  }
}

