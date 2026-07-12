import { NextResponse } from "next/server";

import { InterviewRepository } from "@/src/modules/interview/repositories/InterviewRepository";
import logger from "@/src/shared/logger/logger";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(request: Request, { params }: Props) {
  const { id } = await params;

  try {
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

    const repository = new InterviewRepository();

    const interview = await repository.getById(id);

    if (!interview) {
      return NextResponse.json(
        {
          error: "Interview not found",
        },
        {
          status: 404,
        }
      );
    }

    if (!interview.evaluation) {
      return NextResponse.json(
        {
          error: "Evaluation not found",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(
      {
        id: interview.evaluation.id,
        interviewId: interview.evaluation.interviewId,
        overallScore: interview.evaluation.overallScore,
        communicationScore: interview.evaluation.communicationScore,
        architectureScore: interview.evaluation.architectureScore,
        scalabilityScore: interview.evaluation.scalabilityScore,
        tradeoffScore: interview.evaluation.tradeoffScore,
        feedback: interview.evaluation.feedback,
        metadata: interview.evaluation.metadata,
        createdAt: interview.evaluation.createdAt,
      },
      {
        status: 200,
      }
    );

  } catch (error) {
    if (error instanceof Error) {
      logger.error(
        {
          err: error,
          message: error.message,
          stack: error.stack,
        },
        "Failed to get interview report"
      );
    } else {
      logger.error(
        { error },
        "Failed to get interview report"
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
