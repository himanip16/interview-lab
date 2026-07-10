import { prisma } from "@/lib/prisma";
import { MessageRole, InterviewStatus, Prisma } from "@prisma/client";
import { InterviewState } from "../types";
import { SummaryService } from "../services/SummaryService";
import { EvaluationService } from "../services/EvaluationService";

export class InterviewRepository {
  /**
   * Creates a new interview record
   */
  async create(data: InterviewState) {
  return prisma.interview.create({
    data: {
      id: data.id,
      type: data.type,
      difficulty: data.difficulty,
      duration: data.duration,
      company: data.company,
      status: data.status,
      currentPhase: data.currentPhase || "introduction",
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      summary: data.summary,
    },
  });
}

  /**
   * Retrieves an interview with its transcript
   */
  async getById(id: string) {
    return prisma.interview.findUnique({
      where: { id },
      include: {
        transcript: {
          orderBy: { createdAt: "asc" },
        },
        evaluation: true,
      },
    });
  }

  /**
   * Simple check if interview exists
   */
  async exists(id: string): Promise<boolean> {
    const count = await prisma.interview.count({
      where: { id },
    });
    return count > 0;
  }

  /**
   * Updates the interview status and/or current phase
   */
  async updateProgress(
    id: string, 
    updates: { status?: InterviewStatus; currentPhase?: string }
  ) {
    return prisma.interview.update({
      where: { id },
      data: updates,
    });
  }

  /**
   * Appends a message to the transcript
   */
  async addMessage(
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

  /**
   * Updates the AI-generated summary
   */
  async updateSummary(interviewId: string, summary: string) {
    return prisma.interview.update({
      where: { id: interviewId },
      data: { summary },
    });
  }

  /**
   * Saves or updates the evaluation for an interview
   */
  async saveEvaluation(
    interviewId: string, 
    data: { score: number; feedback: string; metadata?: Prisma.InputJsonValue }
  ) {
    return prisma.evaluation.upsert({
      where: { interviewId },
      update: data,
      create: {
        interviewId,
        ...data,
      },
    });
  }

  /**
   * Fetches all interviews (useful for a dashboard)
   */
  async listAll(limit = 10, offset = 0) {
    return prisma.interview.findMany({
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: offset,
    });
  }

  /**
   * Deletes an interview and all related data (cascade handled by schema)
   */
  async delete(id: string) {
    return prisma.interview.delete({
      where: { id },
    });
  }
}