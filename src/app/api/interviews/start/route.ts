// src/app/api/interviews/start/route.ts
import { NextResponse } from "next/server";
import { ZodError } from "zod";
import logger from "@/shared/logger/logger";

// CLEAN IMPORTS:
import { InterviewService } from "@/features/interview";
import { StartInterviewSchema } from "@/shared/schemas/interviewSchemas";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate input with Zod schema
    const validatedInput = StartInterviewSchema.parse(body);

    const interviewService = new InterviewService();
    const interviewId = await interviewService.startInterview(validatedInput);

    return NextResponse.json({ id: interviewId }, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      logger.error("Validation Error", { issues: error.issues });
      return NextResponse.json(
        { error: "Invalid request body", issues: error.issues },
        { status: 400 }
      );
    }

    logger.error("Failed to start interview", { error });
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}