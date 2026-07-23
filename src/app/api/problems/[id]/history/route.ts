import { NextResponse } from "next/server";
import { InterviewStatus } from "@prisma/client";

import { prisma } from "shared/prisma/client";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const interviews = await prisma.interview.findMany({
      where: {
        userId,
        problemId: id,
        status: InterviewStatus.COMPLETED,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    const history = {
      completed: interviews.length > 0,
      timesCompleted: interviews.length,
      lastCompletedAt: interviews.length > 0 ? interviews[0].updatedAt : null,
    };

    return NextResponse.json({ history }, { status: 200 });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
