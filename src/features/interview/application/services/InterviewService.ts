import { Difficulty, InterviewMode } from "@prisma/client";

import { prisma } from "shared/prisma/client";
import { createInterview } from "./interview/InterviewFactory";
import { TranscriptService } from "./TranscriptService";
import { pickPersona } from "../reverse/CandidatePersonas";
import logger from "@/shared/logger/logger";
import { StartInterviewSchema, type StartInterviewInput } from "@/shared/schemas/interviewSchemas";

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

    const problem = await prisma.problem.findUnique({
      where: { id: problemId },
    });

    if (!problem) {
      throw new Error("Problem not found.");
    }

    const userId = await this.ensureGuestUser();

    logger.info("Starting interview", { userId, problemId, difficulty });

    const interviewMode =
      mode === "REVERSE" ? InterviewMode.REVERSE : InterviewMode.CANDIDATE;

    const interviewData = createInterview({
      templateId: template.id,
      difficulty,
      duration,
      company,
      problemId: problem.id,
      mode: interviewMode,
      topic,
    });

    const persona =
      interviewMode === InterviewMode.REVERSE
        ? pickPersona(difficulty)
        : null;

    // Check for existing active interview before transaction to prevent race condition
    const existingInterview = await prisma.interview.findFirst({
      where: {
        userId,
        problemId: problem.id,
        status: { not: "COMPLETED" },
      },
    });

    if (existingInterview) {
      return existingInterview.id;
    }

    // Use transaction to ensure atomicity and handle race conditions
    const savedInterview = await prisma.$transaction(async (tx) => {
      try {
        logger.info("Creating interview in transaction", { userId, templateId: template.id, problemId: problem.id });
        
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

  async getInterview(id: string) {
    const { InterviewRepository } = await import("@/features/interview/infrastructure/repositories/InterviewRepository");
    const repository = new InterviewRepository();
    return await repository.getById(id);
  }

  async finishInterview(id: string) {
    const { InterviewRepository } = await import("@/features/interview/infrastructure/repositories/InterviewRepository");
    const { EvaluationOrchestrator } = await import("@/features/interview/application/services/evaluation/EvaluationOrchestrator");
    const { InterviewStatus } = await import("@prisma/client");

    const repository = new InterviewRepository();
    const evaluationOrchestrator = new EvaluationOrchestrator();

    const exists = await repository.exists(id);
    if (!exists) {
      throw new Error("Interview not found");
    }

    await repository.updateProgress(id, {
      status: InterviewStatus.COMPLETED,
      completedAt: new Date(),
    });

    evaluationOrchestrator.requestEvaluation(id, { background: true }).catch((error) => {
      logger.error("Background evaluation failed after interview completion", {
        err: error,
        interviewId: id,
      });
    });

    return {
      success: true,
      message: "Interview completed. Evaluation is running in background.",
      status: "EVALUATION_IN_PROGRESS",
    };
  }

  private async ensureGuestUser(): Promise<string> {
    const { cookies } = await import("next/headers");
    const { randomUUID } = await import("crypto");
    const GUEST_COOKIE = "guest_user_id";
    const GUEST_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 30; // 30 days

    const { auth } = await import("@/features/auth/auth");
    const session = await auth();

    if (session?.user?.id) {
      logger.info("Using authenticated user", { userId: session.user.id });
      return session.user.id;
    }

    const cookieStore = await cookies();
    const existingGuestId = cookieStore.get(GUEST_COOKIE)?.value;

    if (existingGuestId) {
      const guest = await prisma.user.findUnique({
        where: { id: existingGuestId },
      });

      if (guest) {
        logger.info("Using existing guest user", { userId: guest.id });
        return guest.id;
      }
      
      // Clear stale cookie if user doesn't exist
      logger.warn("Clearing stale guest cookie", { guestId: existingGuestId });
      cookieStore.delete(GUEST_COOKIE);
    }

    let guest;
    try {
      guest = await prisma.user.create({
        data: {
          email: `guest-${randomUUID()}@guest.local`,
          isGuest: true,
        },
      });
      logger.info("Created new guest user", { userId: guest.id });
    } catch (error) {
      logger.error("Failed to create guest user", { error });
      throw new Error("Failed to create guest user");
    }

    cookieStore.set(GUEST_COOKIE, guest.id, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: GUEST_COOKIE_MAX_AGE_SECONDS,
      path: "/",
    });

    return guest.id;
  }
}
