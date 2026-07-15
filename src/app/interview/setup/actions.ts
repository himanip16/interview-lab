// src/app/interview/setup/actions.ts
"use server";

import { redirect } from "next/navigation";
import { Difficulty, InterviewMode } from "@prisma/client";
import { prisma } from "@/shared/prisma/client";
import { ensureGuestUser } from "@/modules/auth/getCurrentUserId";
import { createInterview } from "@/modules/interview/services/interview/InterviewFactory";
import { TranscriptService } from "@/modules/interview/services/TranscriptService";

const difficultyMap: Record<string, Difficulty> = {
  Easy: Difficulty.EASY,
  Medium: Difficulty.MEDIUM,
  Hard: Difficulty.HARD,
};

export async function createInterviewSession(data: {
  problemId: string;
  difficulty: string;
  userId: string | null;
  type: string;
}) {
  const template = await prisma.interviewTemplate.findUnique({
    where: { slug: data.type },
  });
  if (!template) throw new Error(`Invalid interview type: ${data.type}`);

  const problem = await prisma.problem.findUnique({
    where: { id: data.problemId },
  });
  if (!problem) throw new Error("Problem not found");

  const interviewDifficulty = difficultyMap[data.difficulty];
  if (!interviewDifficulty) throw new Error(`Invalid difficulty: ${data.difficulty}`);

  const userId = data.userId ?? (await ensureGuestUser());

  const interviewData = createInterview({
    templateId: template.id,
    difficulty: interviewDifficulty,
    duration: 45,
    company: "General",
    problemId: problem.id,
    mode: InterviewMode.CANDIDATE,
  });

  const interview = await prisma.interview.create({
    data: {
      difficulty: interviewData.difficulty,
      duration: interviewData.duration,
      company: interviewData.company,
      status: interviewData.status,
      currentPhase: interviewData.currentPhase,
      summary: interviewData.summary,
      promptVersion: interviewData.promptVersion,
      mode: interviewData.mode,
      user: { connect: { id: userId } },
      template: { connect: { id: template.id } },
      problem: { connect: { id: problem.id } },
    },
  });

  await new TranscriptService().addAssistantMessage(
    interview.id,
    `Welcome! Today we'll design "${problem.title}". Start by asking clarifying questions before proposing your design.`
  );

  redirect(`/interview/live/${interview.id}`);
}