import { NextResponse } from "next/server";

import logger from "@/shared/logger/logger";

import { InterviewMessageService } from "@/modules/interview/services/interview/InterviewMessageService";

export async function POST(
  req: Request,
  {
    params,
  }: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  try {
    const { id } = await params;

    const body = await req.json();

    const message =
      typeof body.message === "string"
        ? body.message.trim()
        : "";

    if (!id || !message) {
      return NextResponse.json(
        {
          error: "Invalid request.",
        },
        {
          status: 400,
        }
      );
    }

    const service =
      new InterviewMessageService();

    const result =
      await service.processMessage(
        id,
        message
      );
      // POST /api/interviews/[id]/message
Request body:
{
  text: string;
  phase: string;
}

Response:
{
  messageId: string;
  response: string;           // AI interviewer's response
  timestamp: Date;
  summary?: string[];         // Updated design summary (optional)
  status: "success" | "error";
  error?: string;
}

    return NextResponse.json(
      result,
      {
        status: 200,
      }
    );
  } catch (error) {
    
  console.error("ACTUAL INTERVIEW ERROR:", error);

  return NextResponse.json(
    {
      error:
        error instanceof Error
          ? error.message
          : String(error),
    },
    {
      status: 500,
    }
  );
}
}