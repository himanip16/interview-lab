// src/app/api/interviews/[id]/whiteboard/route.ts

import { NextResponse } from "next/server";

import { InterviewRepository } from "@/features/interview/infrastructure/repositories/InterviewRepository";
import { WhiteboardInterpreter } from "@/features/interview/application/services/whiteboard/WhiteboardInterpreter";
import logger from "@/shared/logger/logger";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export async function PUT(request: Request, { params }: Props) {
  const { id } = await params;

  try {
    if (!id) {
      return NextResponse.json(
        { error: "Missing interview id" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { whiteboardState } = body;

    if (whiteboardState === undefined) {
      return NextResponse.json(
        { error: "Missing whiteboardState" },
        { status: 400 }
      );
    }

    const repository = new InterviewRepository();
    const interpreter = new WhiteboardInterpreter();

    const interview = await repository.getById(id);

    if (!interview) {
      return NextResponse.json(
        { error: "Interview not found" },
        { status: 404 }
      );
    }

    const whiteboardDescription = interpreter.interpret(whiteboardState);

    await repository.updateWhiteboardState(id, whiteboardState);
    await repository.updateWhiteboardDescription(id, whiteboardDescription);

    return NextResponse.json(
      { success: true, whiteboardState },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error) {
      logger.error(
        "Failed to update whiteboard state",
        {
          interviewId: id,
          error: error.message,
          stack: error.stack,
        }
      );
    } else {
      logger.error(
        "Failed to update whiteboard state",
        {
          interviewId: id,
          error,
        }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}