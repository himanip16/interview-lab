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

    // Extract dimension scores from the dynamic dimensionScores JSON
    const dimensionScores = interview.evaluation.dimensionScores as Array<{
      dimension: string;
      score: number;
      summary: string;
    }> || [];

    const getScoreByDimension = (dimension: string): number => {
      const found = dimensionScores.find((ds) => ds.dimension === dimension);
      return found?.score ?? 0;
    };

    return NextResponse.json(
      {
        id: interview.evaluation.id,
        interviewId: interview.evaluation.interviewId,
        overallScore: interview.evaluation.overallScore,
        communicationScore: getScoreByDimension("communication"),
        architectureScore: getScoreByDimension("architecture"),
        scalabilityScore: getScoreByDimension("scalability"),
        tradeoffScore: getScoreByDimension("tradeoff"),
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
