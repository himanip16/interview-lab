import { prisma } from "@/lib/prisma";

import { InterviewState } from "../types";
import { InterviewStatus } from "../types";

export class InterviewRepository {
  async save(interview: InterviewState) {
    return prisma.interview.create({
      data: {
        id: interview.id,
        type: interview.type,
        difficulty: interview.difficulty,
        duration: interview.duration,
        company: interview.company,
        status: interview.status,
        createdAt: interview.createdAt,
      },
    });
  }

  async get(id: string) {
    return prisma.interview.findUnique({
      where: {
        id,
      },
      include: {
        transcript: true,
      },
    });
  }

  async delete(id: string) {
    return prisma.interview.delete({
      where: {
        id,
      },
    });
  }

  async addMessage(
  interviewId: string,
  role: "assistant" | "user",
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

async updateStatus(
  id: string,
  status: InterviewStatus
) {
  return prisma.interview.update({
    where: { id },
    data: { status },
  });
}

  async exists(id: string) {
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

  async getWithMessages(id: string) {
  return prisma.interview.findUnique({
    where: {
      id,
    },
    include: {
      messages: {
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });
}
}