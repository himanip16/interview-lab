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


    await repository.updateProgress(
      id,
      {
        status: InterviewStatus.COMPLETED,
        completedAt: new Date(),
      }
    );


    const evaluationService =
      createEvaluationService();


    const evaluation =
      await evaluationService.evaluateInterview(
        id
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
    {
      err: error,
      message: error.message,
      stack: error.stack,
    },
    "Failed to process interview message"
  );
} else {
  logger.error(
    { error },
    "Failed to process interview message"
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