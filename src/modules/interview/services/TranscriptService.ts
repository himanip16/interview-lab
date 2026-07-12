import {
  MessageRole,
  Prisma,
} from "@prisma/client";

import { prisma } from "@/shared/prisma/client";

export class TranscriptService {
  async addUserMessage(
    interviewId: string,
    message: string
  ) {
    return prisma.message.create({
      data: {
        interviewId,
        role: MessageRole.user,
        content: message,
      },
    });
  }

  async addAssistantMessage(
    interviewId: string,
    message: string,
    metadata?: Prisma.InputJsonValue
  ) {
    return prisma.message.create({
      data: {
        interviewId,
        role: MessageRole.assistant,
        content: message,
        metadata,
      },
    });
  }

  async getTranscript(
    interviewId: string
  ) {
    return prisma.message.findMany({
      where: {
        interviewId,
      },
      orderBy: {
        createdAt: "asc",
      },
    });
  }
}