import {
  InterviewStatus,
  MessageRole,
  Prisma,
} from "@prisma/client";

import { prisma } from "@/shared/prisma/client";

export class InterviewRepository {
  async create(data: Prisma.InterviewCreateInput) {
    return prisma.interview.create({
      data: {
        ...data,
        status: InterviewStatus.SETUP,
      },
    });
  }

  async getById(id: string) {
    return prisma.interview.findUnique({
      where: {
        id,
      },
      include: {
        user: true,
        problem: true,
        template: true,
        transcript: {
          orderBy: {
            createdAt: "asc",
          },
        },
        evaluation: true,
      },
    });
  }

  /**
   * Get interview with recent transcript only (for request path optimization)
   * Fetches only the last N messages to reduce DB load
   */
  async getByIdWithRecentTranscript(id: string, limit: number = 10) {
    const interview = await prisma.interview.findUnique({
      where: {
        id,
      },
      include: {
        user: true,
        problem: true,
        template: true,
        transcript: {
          orderBy: {
            createdAt: "asc",
          },
          take: limit,
        },
        evaluation: true,
      },
    });

    // If we got fewer messages than the limit, we need to fetch from the end
    if (interview && interview.transcript.length < limit) {
      return interview;
    }

    // Otherwise, fetch the last N messages
    if (interview) {
      const totalCount = await prisma.message.count({
        where: { interviewId: id },
      });

      const recentTranscript = await prisma.message.findMany({
        where: { interviewId: id },
        orderBy: { createdAt: "asc" },
        skip: Math.max(0, totalCount - limit),
        take: limit,
      });

      interview.transcript = recentTranscript;
    }

    return interview;
  }

  async exists(id: string): Promise<boolean> {
    const interview = await prisma.interview.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
      },
    });

    return interview !== null;
  }

  async updateProgress(
    id: string,
    updates: {
      status?: InterviewStatus;
      currentPhase?: string;
      phaseStartedAt?: Date;
      completedAt?: Date;
    }
  ) {
    return prisma.interview.update({
      where: {
        id,
      },
      data: updates,
    });
  }

  async persistTurn(params: {
    interviewId: string;
    userMessage: string;
    assistantMessage: string;
    currentPhase: string;
    status?: InterviewStatus;
    assistantMetadata?: Prisma.InputJsonValue;
    elapsedSeconds: number;
    startedAt?: Date;
  }) {
    const {
      interviewId,
      userMessage,
      assistantMessage,
      currentPhase,
      status = InterviewStatus.IN_PROGRESS,
      assistantMetadata,
      elapsedSeconds,
      startedAt,
    } = params;

    return prisma.$transaction(async (tx) => {
      await tx.message.create({
        data: {
          interviewId,
          role: MessageRole.user,
          content: userMessage,
          elapsedSeconds,
          phase: currentPhase,
        },
      });

      await tx.message.create({
        data: {
          interviewId,
          role: MessageRole.assistant,
          content: assistantMessage,
          metadata: assistantMetadata,
          elapsedSeconds,
          phase: currentPhase,
        },
      });

      return tx.interview.update({
        where: {
          id: interviewId,
        },
        data: {
          currentPhase,
          status,
          ...(startedAt && { startedAt }),
        },
      });
    });
  }

  async addMessage(
    interviewId: string,
    role: MessageRole,
    content: string,
    metadata?: Prisma.InputJsonValue
  ) {
    return prisma.message.create({
      data: {
        interviewId,
        role,
        content,
        metadata,
      },
    });
  }

  async updateSummary(
    interviewId: string,
    summary: string
  ) {
    return prisma.interview.update({
      where: {
        id: interviewId,
      },
      data: {
        summary,
      },
    });
  }

  /**
   * Update summary with optimistic concurrency control.
   * Returns true if update succeeded, false if version conflict occurred.
   */
  async updateSummaryWithVersion(
    interviewId: string,
    summary: string,
    expectedVersion: number
  ): Promise<{ success: boolean; newVersion?: number }> {
    try {
      const result = await prisma.interview.update({
        where: {
          id: interviewId,
          summaryVersion: expectedVersion,
        },
        data: {
          summary,
          summaryVersion: { increment: 1 },
        },
        select: {
          summaryVersion: true,
        },
      });

      return { success: true, newVersion: result.summaryVersion };
    } catch (error) {
      // Prisma throws P2025 if record not found or version doesn't match
      if (error instanceof Error && 'code' in error && error.code === 'P2025') {
        return { success: false };
      }
      throw error;
    }
  }

  async updateMetadata(
    interviewId: string,
    metadata: Prisma.InputJsonValue
  ) {
    const interview = await prisma.interview.findUnique({
      where: { id: interviewId },
      select: { metadata: true },
    });

    const existingMetadata = (interview?.metadata as Prisma.JsonObject) || {};

    const mergedMetadata: Prisma.JsonObject = {
      ...existingMetadata,
      ...(metadata as Prisma.JsonObject),
    };

    return prisma.interview.update({
      where: {
        id: interviewId,
      },
      data: {
        metadata: mergedMetadata as Prisma.InputJsonValue,
      },
    });
  }

  async updateWhiteboardState(
    interviewId: string,
    whiteboardState: Prisma.InputJsonValue
  ) {
    return prisma.interview.update({
      where: {
        id: interviewId,
      },
      data: {
        whiteboardState,
      },
    });
  }

  async updateWhiteboardDescription(
    interviewId: string,
    whiteboardDescription: string | null
  ) {
    return prisma.interview.update({
      where: {
        id: interviewId,
      },
      data: {
        whiteboardDescription,
      } as any,
    });
  }

  async saveEvaluation(
    interviewId: string,
    data: {
      overallScore: number;
      dimensionScores: Prisma.InputJsonValue;
      evidence: Prisma.InputJsonValue;
      feedback: string;
      metadata?: Prisma.InputJsonValue;
      status?: string;
    }
  ) {
    return prisma.evaluation.upsert({
      where: {
        interviewId,
      },
      update: data as any,
      create: {
        interviewId,
        ...data,
      } as any,
    });
  }

  async listAll(limit = 10, offset = 0) {
    const safeLimit = Math.min(
      Math.max(limit, 1),
      100
    );

    const safeOffset = Math.max(offset, 0);

    return prisma.interview.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: safeLimit,
      skip: safeOffset,
    });
  }

  async delete(id: string) {
    return prisma.interview.delete({
      where: {
        id,
      },
    });
  }

  async transaction<T>(
    callback: (
      tx: Prisma.TransactionClient
    ) => Promise<T>
  ): Promise<T> {
    return prisma.$transaction(callback);
  }
}