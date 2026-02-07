import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET() {
  try {
    const jobs = await db.job.findMany({
      select: { name: true },
      orderBy: { name: "asc" },
    });
    return NextResponse.json({ jobs: jobs.map((job) => job.name) });
  } catch (error) {
    return NextResponse.json(
      { jobs: [], error: (error as Error).message },
      { status: 500 },
    );
  }
}


