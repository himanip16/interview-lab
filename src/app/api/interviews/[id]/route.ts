import { NextResponse } from "next/server";

import { InterviewRepository } from "@/src/modules/interview/repositories/InterviewRepository";
import logger from "@/src/shared/logger/logger";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET({ params }: Props) {
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

    const interview =
      await repository.getById(id);

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
        status: interview.status,
        type: interview.type,
        difficulty: interview.difficulty,
        duration: interview.duration,
        company: interview.company,
        transcript: interview.transcript,
        evaluation: interview.evaluation,
        summary: interview.summary,
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