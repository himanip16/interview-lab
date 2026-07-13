import { NextResponse } from "next/server";

import { prisma } from "@/shared/prisma/client";

export async function GET(request: Request) {
  try {
    const problems = await prisma.problem.findMany({
      orderBy: {
        interviewCount: "desc",
      },
    });

    return NextResponse.json({ problems }, { status: 200 });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
