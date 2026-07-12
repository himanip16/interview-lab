import { NextResponse } from "next/server";

import { InterviewRepository } from "@/src/modules/interview/repositories/InterviewRepository";
import { EvaluationService } from "@/src/modules/interview/services/evaluation/EvaluationService";
import logger from "@/src/shared/logger/logger";
import { InterviewStatus } from "@prisma/client";


export async function POST(
  req: Request
) {
  try {
    const body = await req.json();

    const { interviewId } = body;


    if (!interviewId) {
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
      await repository.exists(interviewId);


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
      interviewId,
      {
        status: InterviewStatus.COMPLETED,
      }
    );


    const evaluationService =
      new EvaluationService();


    const evaluation =
      await evaluationService.evaluateInterview(
        interviewId
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