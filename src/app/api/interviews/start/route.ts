import { NextResponse } from "next/server";

import { InterviewType, Difficulty } from "@prisma/client";
import { MessageRole } from "@prisma/client";


import { prisma } from "@/shared/prisma/client";

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
      problemId,
    } = body;

    if (
      !type ||
      !difficulty ||
      !duration ||
      !company ||
      !problemId
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

    const problem = await prisma.problem.findUnique({
      where: {
        id: problemId,
      },
    });

    if (!problem) {
      return NextResponse.json(
        {
          error: "Problem not found.",
        },
        {
          status: 404,
        }
      );
    }

    const interview = createInterview({
      type: interviewType,
      difficulty: interviewDifficulty,
      duration,
      company,
      problemId: problem.id,
    });

    const repository = new InterviewRepository();

    const savedInterview =
      await repository.create(interview);

    await prisma.problem.update({
      where: {
        id: problem.id,
      },
      data: {
        interviewCount: {
          increment: 1,
        },
      },
    });

    const transcriptService =
      new TranscriptService();

    await transcriptService.addAssistantMessage(
      savedInterview.id,
      `Welcome! Today we'll design "${problem.title}". Start by asking clarifying questions before proposing your design.`
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
            : "Internal server error",
      },
      {
        status: 500,
      }
    );
  }
}