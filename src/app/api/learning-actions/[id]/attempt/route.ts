import { NextResponse } from "next/server";

import { prisma } from "@/shared/prisma/client";
import { ensureGuestUser } from "@/src/modules/auth/getCurrentUserId";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { response } = body;

    if (response === undefined) {
      return NextResponse.json(
        { error: "Missing required field: response." },
        { status: 400 }
      );
    }

    const action = await prisma.learningAction.findUnique({
      where: { id: params.id },
      include: { segment: true },
    });

    if (!action) {
      return NextResponse.json(
        { error: "Learning action not found." },
        { status: 404 }
      );
    }

    if (!action.isActive) {
      return NextResponse.json(
        { error: "Learning action is not active." },
        { status: 400 }
      );
    }

    const userId = await ensureGuestUser();

    const attempt = await prisma.userLearningAttempt.create({
      data: {
        user: { connect: { id: userId } },
        action: { connect: { id: action.id } },
        status: "STARTED",
        response,
      },
    });

    return NextResponse.json({ id: attempt.id }, { status: 201 });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Internal server error",
      },
      { status: 500 }
    );
  }
}
