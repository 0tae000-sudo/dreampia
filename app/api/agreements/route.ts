import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

const ROLE_MAP = {
  teacher: "TEACHER",
  mentor: "MENTOR",
} as const;

export async function GET(request: NextRequest) {
  try {
    const roleParam = request.nextUrl.searchParams.get("role")?.toLowerCase();
    const role = roleParam ? ROLE_MAP[roleParam as keyof typeof ROLE_MAP] : null;

    const versions = await db.agreementVersion.findMany({
      where: {
        isActive: true,
        ...(role ? { role: { in: ["ALL", role] } } : {}),
      },
      include: {
        agreement: {
          select: {
            code: true,
          },
        },
      },
      orderBy: [{ agreementId: "asc" }, { version: "desc" }],
    });

    const agreements = versions.map((version) => ({
      id: version.agreement.code,
      title: version.title,
      body: version.body.replace(/\\n/g, "\n"),
      isRequired: version.isRequired,
      version: version.version,
    }));

    return NextResponse.json({ agreements });
  } catch (error) {
    return NextResponse.json(
      { agreements: [], error: (error as Error).message },
      { status: 500 },
    );
  }
}


