import { NextResponse } from "next/server";

import { InterviewRepository } from "@/src/modules/interview/repositories/InterviewRepository";
import logger from "@/src/shared/logger/logger";

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
    
    // Verify interview exists
    const interview = await repository.getById(id);
    if (!interview) {
      return NextResponse.json(
        { error: "Interview not found" },
        { status: 404 }
      );
    }

    // Update whiteboard state
    await repository.updateWhiteboardState(id, whiteboardState);

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
