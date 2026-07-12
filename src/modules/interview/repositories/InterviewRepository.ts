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
        problem: true,
        transcript: {
          orderBy: {
            createdAt: "asc",
          },
        },
        evaluation: true,
      },
    });
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
  }) {
    const {
      interviewId,
      userMessage,
      assistantMessage,
      currentPhase,
      status = InterviewStatus.IN_PROGRESS,
      assistantMetadata,
    } = params;

    return prisma.$transaction(async (tx) => {
      await tx.message.create({
        data: {
          interviewId,
          role: MessageRole.user,
          content: userMessage,
        },
      });

      await tx.message.create({
        data: {
          interviewId,
          role: MessageRole.assistant,
          content: assistantMessage,
          metadata: assistantMetadata,
        },
      });

      return tx.interview.update({
        where: {
          id: interviewId,
        },
        data: {
          currentPhase,
          status,
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

  async saveEvaluation(
    interviewId: string,
    data: {
      overallScore: number;
      dimensionScores: Prisma.InputJsonValue;
      evidence: Prisma.InputJsonValue;
      feedback: string;
      metadata?: Prisma.InputJsonValue;
    }
  ) {
    return prisma.evaluation.upsert({
      where: {
        interviewId,
      },
      update: data,
      create: {
        interviewId,
        ...data,
      },
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