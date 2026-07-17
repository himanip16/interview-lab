import { NextResponse } from "next/server";

import { InterviewRepository } from "@/modules/interview/repositories/InterviewRepository";
import { createEvaluationService } from "@/modules/container";
import logger from "@/shared/logger/logger";
import { InterviewStatus } from "@prisma/client";


export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        {
          error: "Missing interview id",
        },
        {
          status: 400,
        }
      );
    }


    const repository =
      new InterviewRepository();


    const exists =
      await repository.exists(id);


    if (!exists) {
      return NextResponse.json(
        {
          error: "Interview not found",
        },
        {
          status: 404,
        }
      );
    }


    const evaluationService =
      createEvaluationService();

    let evaluation;
    try {
      evaluation = await evaluationService.evaluateInterview(id);
    } catch (error) {
      logger.error(
        "AI evaluation failed, keeping interview in progress",
        {
          err: error,
          interviewId: id,
        }
      );
      return NextResponse.json(
        {
          error: "Evaluation failed. Please try again.",
          retryable: true,
        },
        {
          status: 503,
        }
      );
    }

    // Only mark as COMPLETED after successful evaluation
    await repository.updateProgress(
      id,
      {
        status: InterviewStatus.COMPLETED,
        completedAt: new Date(),
      }
    );


    return NextResponse.json(
      {
        success: true,
        evaluationId: evaluation.id,
      },
      {
        status: 200,
      }
    );


  } catch(error) {

    if (error instanceof Error) {
  logger.error(
    "Failed to process interview message",
    {
      err: error,
      message: error.message,
      stack: error.stack,
    }
  );
} else {
  logger.error(
    "Failed to process interview message",
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