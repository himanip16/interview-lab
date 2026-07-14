import { NextResponse } from "next/server";
import { Difficulty, InterviewMode } from "@prisma/client";

import { prisma } from "@/shared/prisma/client";
import { ensureGuestUser } from "@/modules/auth/getCurrentUserId";
import { createInterview } from "@/modules/interview/services/interview/InterviewFactory";
import { InterviewRepository } from "@/modules/interview/repositories/InterviewRepository";
import { TranscriptService } from "@/modules/interview/services/TranscriptService";
import { pickPersona } from "@/modules/interview/reverse/CandidatePersonas";

const difficultyMap: Record<string, Difficulty> = {
  EASY: Difficulty.EASY,
  MEDIUM: Difficulty.MEDIUM,
  HARD: Difficulty.HARD,
};

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { type, difficulty, duration, company, problemId, mode, topic } = body;

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

    const userId = await ensureGuestUser();

    const interviewMode = mode === "REVERSE" ? InterviewMode.REVERSE : InterviewMode.CANDIDATE;

    const interviewData = createInterview({
      templateId: template.id,
      difficulty: interviewDifficulty,
      duration,
      company,
      problemId: problem.id,
      mode: interviewMode,
      topic,
    });

    const persona = interviewMode === InterviewMode.REVERSE ? pickPersona(interviewDifficulty) : null;

    const repository = new InterviewRepository();

    const savedInterview = await repository.create({
      difficulty: interviewData.difficulty,
      duration: interviewData.duration,
      company: interviewData.company,
      status: interviewData.status,
      currentPhase: interviewData.currentPhase,
      summary: interviewData.summary,
      promptVersion: interviewData.promptVersion,
      mode: interviewData.mode,
      candidatePersona: persona as any,
      user: { connect: { id: userId } },
      template: { connect: { id: template.id } },
      problem: { connect: { id: problem.id } },
    });

    await prisma.problem.update({
      where: { id: problem.id },
      data: { interviewCount: { increment: 1 } },
    });

    const transcriptService = new TranscriptService();

    const greeting = interviewMode === InterviewMode.REVERSE
      ? `Hi, I'm ${persona!.name}. Ready when you are — go ahead and start the interview.`
      : `Welcome! Today we'll design "${problem.title}". Start by asking clarifying questions before proposing your design.`;

    await transcriptService.addAssistantMessage(
      savedInterview.id,
      greeting
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