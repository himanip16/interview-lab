import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { InterviewService, StartInterviewSchema } from "@/features/interview/InterviewService";
import logger from "@/shared/logger/logger";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate input with Zod schema
    const validatedInput = StartInterviewSchema.parse(body);

    const interviewService = new InterviewService();
    const interviewId = await interviewService.startInterview(validatedInput);

    return NextResponse.json({ id: interviewId }, { status: 201 });
  } 

catch (error) {
  if (error instanceof ZodError) {
    logger.error(error.issues);

    return NextResponse.json(
      {
        error: "Invalid request body",
        issues: error.issues,
      },
      {
        status: 400,
      }
    );
  }

  logger.error(error);

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