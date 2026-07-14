import { NextResponse } from "next/server";

import { prisma } from "@/shared/prisma/client";
import { ensureGuestUser } from "@/modules/auth/getCurrentUserId";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { response, score, feedback } = body;

    if (response === undefined) {
      return NextResponse.json(
        { error: "Missing required field: response." },
        { status: 400 }
      );
    }

    const action = await prisma.learningAction.findUnique({
      where: { id },
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

    // Calculate score from response if not provided
    let calculatedScore = score;
    if (calculatedScore === undefined && typeof response === 'object' && response !== null) {
      // For judge/compare actions, derive score from isCorrect field
      if ('isCorrect' in response && typeof response.isCorrect === 'boolean') {
        calculatedScore = response.isCorrect ? 1.0 : 0.0;
      }
    }

    const attempt = await prisma.userLearningAttempt.create({
      data: {
        user: { connect: { id: userId } },
        action: { connect: { id: action.id } },
        status: "COMPLETED",
        response,
        score: calculatedScore,
        feedback,
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
