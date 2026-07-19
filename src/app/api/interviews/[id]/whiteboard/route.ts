import { NextResponse } from "next/server";

import { InterviewRepository } from "@/modules/interview/repositories/InterviewRepository";
import { WhiteboardInterpreter } from "@/modules/interview/services/whiteboard/WhiteboardInterpreter";
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
    
    // Verify interview exists
    const interview = await repository.getById(id);
    if (!interview) {
      return NextResponse.json(
        { error: "Interview not found" },
        { status: 404 }
      );
    }

    // Generate textual description from whiteboard state
    const whiteboardDescription = interpreter.interpret(whiteboardState);

    // Update whiteboard state and description
    await repository.updateWhiteboardState(id, whiteboardState);
    await repository.updateWhiteboardDescription(id, whiteboardDescription);

    return NextResponse.json(
      { success: true, whiteboardState },
      { status: 200 }
    );

  } catch (error) {
    if (error instanceof Error) {
      logger.error(
        {
          err: error,
          message: error.message,
          stack: error.stack,
        },
        "Failed to update whiteboard state"
      );
    } else {
      logger.error(
        { error },
        "Failed to update whiteboard state"
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
