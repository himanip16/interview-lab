// src/app/api/interviews/route.ts

import { NextResponse } from "next/server";
import { InterviewService, StartInterviewSchema } from "@/features/interview";
import logger from "@/shared/logger/logger";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate input with Zod schema
    const validatedInput = StartInterviewSchema.parse(body);

    const service = new InterviewService();
    const interviewId = await service.startInterview(validatedInput);

    return NextResponse.json({ id: interviewId }, { status: 201 });

  } catch (error) {
    if (error instanceof Error) {
      logger.error(
        "Failed to create interview",
        {
          err: error,
          message: error.message,
          stack: error.stack,
        }
      );
    } else {
      logger.error(
        "Failed to create interview",
        { error }
      );
    }

    return NextResponse.json(
      {
        error: "Internal server error",
      },
      {
        status: 500,
      }
    );
  }
}
