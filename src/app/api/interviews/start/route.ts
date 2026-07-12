import { NextResponse } from "next/server";
import {
  Difficulty,
  InterviewType,
} from "@prisma/client";

import { createInterview } from "@/src/modules/interview/services/interview/InterviewFactory";
import { InterviewRepository } from "@/src/modules/interview/repositories/InterviewRepository";
import { TranscriptService } from "@/src/modules/interview/services/TranscriptService";

const interviewTypeMap: Record<string, InterviewType> = {
  hld: InterviewType.HLD,
  lld: InterviewType.LLD,
};

const difficultyMap: Record<string, Difficulty> = {
  Easy: Difficulty.EASY,
  Medium: Difficulty.MEDIUM,
  Hard: Difficulty.HARD,
};

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      type,
      difficulty,
      duration,
      company,
    } = body;

    if (!type || !difficulty || !duration || !company) {
      return NextResponse.json(
        {
          error: "Missing required fields.",
        },
        {
          status: 400,
        }
      );
    }

    const interviewType = interviewTypeMap[type];
    const interviewDifficulty = difficultyMap[difficulty];

    if (!interviewType) {
      return NextResponse.json(
        {
          error: "Invalid interview type.",
        },
        {
          status: 400,
        }
      );
    }

    if (!interviewDifficulty) {
      return NextResponse.json(
        {
          error: "Invalid difficulty.",
        },
        {
          status: 400,
        }
      );
    }

    const interview = createInterview({
  
      type: interviewType,
      difficulty: interviewDifficulty,
      duration,
      company,
    });

    const repository = new InterviewRepository();

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
  } catch (error) {
    console.error(error);

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