import { MessageRole } from "@prisma/client";
import { prisma } from "@/src/shared/prisma/client";

export class MessageRepository {
  async create(
    interviewId: string,
    role: MessageRole,
    content: string
  ) {
    return prisma.message.create({
      data: {
        interviewId,
        role,
        content,
      },
    });
  }

  async list(interviewId: string) {
    return prisma.message.findMany({
      where: {
        interviewId,
      },
      orderBy: {
        createdAt: "asc",
      },
    });
  }

  async deleteAll(interviewId: string) {
    return prisma.message.deleteMany({
      where: {
        interviewId,
      },
    });
  }
}