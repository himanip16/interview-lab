import { NextResponse } from "next/server";
import { Difficulty } from "@prisma/client";

import { prisma } from "@/shared/prisma/client";
import { getCurrentUserId } from "@/src/modules/auth/getCurrentUserId";
import { createInterview } from "@/src/modules/interview/services/interview/InterviewFactory";
import { InterviewRepository } from "@/src/modules/interview/repositories/InterviewRepository";
import { TranscriptService } from "@/src/modules/interview/services/TranscriptService";

const difficultyMap: Record<string, Difficulty> = {
  Easy: Difficulty.EASY,
  Medium: Difficulty.MEDIUM,
  Hard: Difficulty.HARD,
};

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { type, difficulty, duration, company, problemId } = body;

    if (!type || !difficulty || !duration || !company || !problemId) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }

    const template = await prisma.interviewTemplate.findUnique({
      where: { slug: type },
    });

    if (!template) {
      return NextResponse.json(
        { error: "Invalid interview type." },
        { status: 400 }
      );
    }

    const interviewDifficulty = difficultyMap[difficulty];

    if (!interviewDifficulty) {
      return NextResponse.json(
        { error: "Invalid difficulty." },
        { status: 400 }
      );
    }

    const problem = await prisma.problem.findUnique({
      where: { id: problemId },
    });

    if (!problem) {
      return NextResponse.json(
        { error: "Problem not found." },
        { status: 404 }
      );
    }

    const userId = await getCurrentUserId();

    const interviewData = createInterview({
      templateId: template.id,
      difficulty: interviewDifficulty,
      duration,
      company,
      problemId: problem.id,
    });

    const repository = new InterviewRepository();

    const savedInterview = await repository.create({
      difficulty: interviewData.difficulty,
      duration: interviewData.duration,
      company: interviewData.company,
      status: interviewData.status,
      currentPhase: interviewData.currentPhase,
      summary: interviewData.summary,
      promptVersion: interviewData.promptVersion,
      user: { connect: { id: userId } },
      template: { connect: { id: template.id } },
      problem: { connect: { id: problem.id } },
    });

    await prisma.problem.update({
      where: { id: problem.id },
      data: { interviewCount: { increment: 1 } },
    });

    const transcriptService = new TranscriptService();

    await transcriptService.addAssistantMessage(
      savedInterview.id,
      `Welcome! Today we'll design "${problem.title}". Start by asking clarifying questions before proposing your design.`
    );

    return NextResponse.json({ id: savedInterview.id }, { status: 201 });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Internal server error",
      },
      { status: 500 }
    );
  }
}