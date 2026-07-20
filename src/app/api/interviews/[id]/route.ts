import { NextResponse } from "next/server";
import { InterviewService } from "@/features/interview";
import logger from "@/shared/logger/logger";

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

    const service = new InterviewService();
    const interview = await service.getInterview(id);

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

    return NextResponse.json(
      {
        id: interview.id,
        problem: interview.problem,
        status: interview.status,
        template: interview.template,
        difficulty: interview.difficulty,
        duration: interview.duration,
        company: interview.company,
        transcript: interview.transcript,
        evaluation: interview.evaluation,
        summary: interview.summary,
        currentPhase: interview.currentPhase,
        createdAt: interview.createdAt,
        updatedAt: interview.updatedAt,
      },
      {
        status: 200,
      }
    );

  } catch (error) {
    if (error instanceof Error) {
      logger.error(
        "Failed to get interview",
        {
          err: error,
          message: error.message,
          stack: error.stack,
        }
      );
    } else {
      logger.error(
        "Failed to get interview",
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