import { NextResponse } from "next/server";

import { InterviewService, StartInterviewSchema } from "@/modules/interview/services/InterviewService";
import logger from "@/shared/logger/logger";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate input with Zod schema
    const validatedInput = StartInterviewSchema.parse(body);

    const interviewService = new InterviewService();
    const interviewId = await interviewService.startInterview(validatedInput);

    return NextResponse.json({ id: interviewId }, { status: 201 });
  } catch (error) {
    logger.error({
      error,
      message: error instanceof Error ? error.message : "Unknown error",
    }, "Failed to start interview");

    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    // Never expose internal error details to client
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}