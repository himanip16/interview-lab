import { Difficulty, InterviewMode } from "@prisma/client";
import { z } from "zod";

import { prisma } from "@/shared/prisma/client";
import { createInterview } from "./interview/InterviewFactory";
import { TranscriptService } from "./TranscriptService";
import { pickPersona } from "../reverse/CandidatePersonas";
import logger from "@/shared/logger/logger";

const difficultyMap: Record<string, Difficulty> = {
  EASY: Difficulty.EASY,
  MEDIUM: Difficulty.MEDIUM,
  HARD: Difficulty.HARD,
};

export const StartInterviewSchema = z.object({
  type: z.string(),
  difficulty: z.nativeEnum(Difficulty),
  duration: z.number().positive(),
  company: z.string(),
  problemId: z.string().uuid(),
  mode: z.nativeEnum(InterviewMode).optional(),
  topic: z.string().optional(),
});

export type StartInterviewInput = z.infer<typeof StartInterviewSchema>;

export class InterviewService {
  async startInterview(input: StartInterviewInput) {
    const { type, difficulty, duration, company, problemId, mode, topic } = input;

    // Find template with fallback
    let template = await prisma.interviewTemplate.findUnique({
      where: { slug: type },
    });

    if (!template) {
      template = await prisma.interviewTemplate.findUnique({
        where: { slug: "hld" },
      });
    }

    if (!template) {
      throw new Error("No valid interview templates found. Please run seed.");
    }

    const interviewDifficulty = difficultyMap[difficulty];

    if (!interviewDifficulty) {
      throw new Error("Invalid difficulty.");
    }

    const problem = await prisma.problem.findUnique({
      where: { id: problemId },
    });

    if (!problem) {
      throw new Error("Problem not found.");
    }

    const userId = await this.ensureGuestUser();

    const interviewMode =
      mode === "REVERSE" ? InterviewMode.REVERSE : InterviewMode.CANDIDATE;

    const interviewData = createInterview({
      templateId: template.id,
      difficulty: interviewDifficulty,
      duration,
      company,
      problemId: problem.id,
      mode: interviewMode,
      topic,
    });

    const persona =
      interviewMode === InterviewMode.REVERSE
        ? pickPersona(interviewDifficulty)
        : null;

    // Use transaction to ensure atomicity and handle race conditions
    const savedInterview = await prisma.$transaction(async (tx) => {
      try {
        const interview = await tx.interview.create({
          data: {
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
          },
        });

        await tx.problem.update({
          where: { id: problem.id },
          data: { interviewCount: { increment: 1 } },
        });

        return interview;
      } catch (error) {
        // Handle race condition: if interview already exists, return it
        if (error instanceof Error && 'code' in error && error.code === 'P2002') {
          const existing = await tx.interview.findFirst({
            where: {
              userId,
              problemId: problem.id,
              status: { not: "COMPLETED" },
            },
          });
          if (existing) return existing;
        }
        throw error;
      }
    });

    const transcriptService = new TranscriptService();

    const greeting = interviewMode === InterviewMode.REVERSE
      ? `Hi, I'm ${persona!.name}. Ready when you are — go ahead and start the interview.`
      : `Welcome! Today we'll design "${problem.title}". Start by asking clarifying questions before proposing your design.`;

    await transcriptService.addAssistantMessage(
      savedInterview.id,
      greeting
    );

    return savedInterview.id;
  }

  private async ensureGuestUser(): Promise<string> {
    const { cookies } = await import("next/headers");
    const { randomUUID } = await import("crypto");
    const GUEST_COOKIE = "guest_user_id";
    const GUEST_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 30; // 30 days

    const { auth } = await import("@/modules/auth/auth");
    const session = await auth();

    if (session?.user?.id) {
      return session.user.id;
    }

    const cookieStore = await cookies();
    const existingGuestId = cookieStore.get(GUEST_COOKIE)?.value;

    if (existingGuestId) {
      const guest = await prisma.user.findUnique({
        where: { id: existingGuestId },
      });

      if (guest) return guest.id;
    }

    const guest = await prisma.user.create({
      data: {
        email: `guest-${randomUUID()}@guest.local`,
        isGuest: true,
      },
    });

    cookieStore.set(GUEST_COOKIE, guest.id, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: GUEST_COOKIE_MAX_AGE_SECONDS,
      path: "/",
    });

    return guest.id;
  }
}
