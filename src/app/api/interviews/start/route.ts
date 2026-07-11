import { NextResponse } from "next/server";

import { createInterview } from "@/src/modules/interview/services/InterviewFactory";
import { InterviewRepository } from "@/src/modules/interview/repositories/InterviewRepository";
import { TranscriptService } from "@/src/modules/interview/services/TranscriptService";
import logger from "@/lib/logger";


export async function POST(
  request: Request
) {
  try {

    const body = await request.json();

    const {
      userId,
      type,
      difficulty,
      duration,
      company,
    } = body;


    if (
      !userId ||
      !type ||
      !difficulty ||
      !duration ||
      !company
    ) {
      return NextResponse.json(
        {
          error: "Missing required fields.",
        },
        {
          status: 400,
        }
      );
    }


    const interview =
      createInterview({
        userId,
        type,
        difficulty,
        duration,
        company,
      });


    const repository =
      new InterviewRepository();


    const savedInterview =
      await repository.create(interview);


    const transcriptService =
      new TranscriptService();


    await transcriptService.addAssistantMessage(
      savedInterview.id,
      "Welcome! Today we'll design a URL Shortener. Start by asking clarifying questions."
    );


    return NextResponse.json(
      {
        id: savedInterview.id,
      },
      {
        status: 201,
      }
    );


  } catch(error) {

    logger.error(
      {
        error,
      },
      "Failed to start interview"
    );


    return NextResponse.json(
      {
        error: "Failed to start interview.",
      },
      {
        status:500,
      }
    );
  }
}