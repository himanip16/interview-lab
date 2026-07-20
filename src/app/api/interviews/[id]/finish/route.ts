import { NextResponse } from "next/server";
import { InterviewService } from "@/features/interview/application/services/InterviewService";
import logger from "@/shared/logger/logger";

type Props = {
  params: Promise<{ id: string }>;
};

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

    const service = new InterviewService();
    const result = await service.finishInterview(id);

    return NextResponse.json(result, {
      status: 202,
    });

  } catch (error) {
    if (error instanceof Error) {
      logger.error(
        "Failed to finish interview",
        {
          err: error,
          message: error.message,
          stack: error.stack,
        }
      );
    } else {
      logger.error(
        "Failed to finish interview",
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