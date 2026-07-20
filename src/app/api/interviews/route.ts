import { NextResponse } from "next/server";

import { InterviewRepository } from "@/features/interview/repositories/InterviewRepository";
import { createInterview } from "@/features/interview/services/interview/InterviewFactory";
import { CreateInterviewInput } from "@/features/interview/types/CreateInterviewInput";
import { ensureGuestUser } from "@/features/auth/getCurrentUserId";
import logger from "@/shared/logger/logger";

export async function POST(request: Request) {
  try {
    const body: CreateInterviewInput = await request.json();

    if (!body.templateId || !body.difficulty || !body.duration || !body.company || !body.problemId) {
      return NextResponse.json(
        {
          error: "Missing required fields: templateId, difficulty, duration, company, problemId",
        },
        {
          status: 400,
        }
      );
    }

    const repository = new InterviewRepository();

    const interviewData = createInterview(body);

    const userId = await ensureGuestUser();

    const interview = await repository.create({
      difficulty: interviewData.difficulty,
      duration: interviewData.duration,
      company: interviewData.company,
      status: interviewData.status,
      problem: {
        connect: {
          id: interviewData.problemId,
        },
      },
      template: {
        connect: {
          id: interviewData.templateId,
        },
      },
      user: {
        connect: {
          id: userId,
        },
      },
      currentPhase: interviewData.currentPhase,
      summary: interviewData.summary,
      promptVersion: interviewData.promptVersion,
    });

    return NextResponse.json(
      {
        id: interview.id,
        status: interview.status,
        templateId: interview.templateId,
        difficulty: interview.difficulty,
        duration: interview.duration,
        company: interview.company,
        problemId: interview.problemId,
        currentPhase: interview.currentPhase,
        summary: interview.summary,
        createdAt: interview.createdAt,
        updatedAt: interview.updatedAt,
      },
      {
        status: 201,
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
        "Failed to create interview"
      );
    } else {
      logger.error(
        { error },
        "Failed to create interview"
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
