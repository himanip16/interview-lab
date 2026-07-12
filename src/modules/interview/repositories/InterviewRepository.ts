

import {InterviewStatus, MessageRole, Prisma} from "@prisma/client";

import { CreateInterviewInput } from "../../../features/interview/types/CreateInterviewInput";
import { prisma } from "@/shared/prisma/client";
export class InterviewRepository {

  async create(data: CreateInterviewInput & {  }) {
    const {  ...rest } = data;

    return prisma.interview.create({
      data: {
        ...rest,
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
    const interview =
      await prisma.interview.findUnique({
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
      communicationScore: number;
      architectureScore: number;
      scalabilityScore: number;
      tradeoffScore: number;
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


  async listAll(
    limit = 10,
    offset = 0
  ) {
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