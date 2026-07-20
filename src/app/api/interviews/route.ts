import { NextResponse } from "next/server";
import { InterviewService } from "@/features/interview";
import { CreateInterviewInput } from "@/features/interview/types/CreateInterviewInput";
import logger from "@/shared/logger/logger";

export async function POST(request: Request) {
  try {
    const body: CreateInterviewInput = await request.json();

    if (!body.templateId || !body.difficulty || !body.duration || !body.company || !body.problemId) {
      return NextResponse.json(
        {
          error: "Missing required fields: templateId, difficulty, duration, company, problemId",
        },
        {
          status: 400,
        }
      );
    }

    const service = new InterviewService();
    const interviewId = await service.startInterview({
      ...body,
      type: body.templateId,
    });

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
