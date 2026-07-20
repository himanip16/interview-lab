import { NextResponse } from "next/server";

import { InterviewRepository } from "@/features/interview/repositories/InterviewRepository";
import { EvaluationOrchestrator } from "@/features/interview/services/evaluation/EvaluationOrchestrator";
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

    const evaluationOrchestrator =
      new EvaluationOrchestrator();

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

    // Mark interview as COMPLETED first - this is the synchronous part
    await repository.updateProgress(
      id,
      {
        status: InterviewStatus.COMPLETED,
        completedAt: new Date(),
      }
    );

    // Trigger evaluation in background - this won't block the response
    evaluationOrchestrator.requestEvaluation(id, { background: true }).catch((error) => {
      logger.error(
        "Background evaluation failed after interview completion",
        {
          err: error,
          interviewId: id,
        }
      );
    });

    // Return immediately with 202 Accepted
    return NextResponse.json(
      {
        success: true,
        message: "Interview completed. Evaluation is running in background.",
        status: "EVALUATION_IN_PROGRESS",
      },
      {
        status: 202,
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