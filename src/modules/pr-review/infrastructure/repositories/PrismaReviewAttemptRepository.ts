// src/modules/pr-review/infrastructure/repositories/PrismaReviewAttemptRepository.ts
import { PrismaClient } from "@prisma/client";

const globalForPrisma =
  globalThis as unknown as {
    prisma: PrismaClient | undefined;
  };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
import { ReviewAttempt } from "../../domain/entities/ReviewAttempt";
import { ReviewComment } from "../../domain/entities/ReviewComment";
import { ReviewReport } from "../../domain/entities/ReviewReport";
import type {
  ReviewAttemptRepository,
  CreateAttemptInput,
  AddCommentInput,
  SubmitReviewInput,
  CreateReportInput,
} from "../../repositories/ReviewAttemptRepository";

export class PrismaReviewAttemptRepository implements ReviewAttemptRepository {
  async create({ userId, scenarioId }: CreateAttemptInput): Promise<ReviewAttempt> {
    const row = await prisma.reviewAttempt.create({
      data: { userId, scenarioId, status: "CREATED" },
    });
    return ReviewAttempt.fromProps(row);
  }

  async findById(attemptId: string): Promise<ReviewAttempt | null> {
    const row = await prisma.reviewAttempt.findUnique({ where: { id: attemptId } });
    return row ? ReviewAttempt.fromProps(row) : null;
  }

  async findActiveAttempt(userId: string, scenarioId: string): Promise<ReviewAttempt | null> {
    const row = await prisma.reviewAttempt.findFirst({
      where: { userId, scenarioId, status: { in: ["CREATED", "IN_PROGRESS"] } },
      orderBy: { startedAt: "desc" },
    });
    return row ? ReviewAttempt.fromProps(row) : null;
  }

  async updateAttempt(attempt: ReviewAttempt): Promise<ReviewAttempt> {
    const row = await prisma.reviewAttempt.update({
      where: { id: attempt.id },
      data: {
        status: attempt.status,
        decision: attempt.decision,
        completedAt: attempt.completedAt,
      },
    });
    return ReviewAttempt.fromProps(row);
  }

  async addComment({ attemptId, fileId, side, line, anchorText, content }: AddCommentInput): Promise<ReviewComment> {
    const row = await prisma.reviewComment.create({
      data: { attemptId, fileId, side, line, anchorText, content },
    });
    return ReviewComment.fromProps(row);
  }

  async getComments(attemptId: string): Promise<ReviewComment[]> {
    const rows = await prisma.reviewComment.findMany({
      where: { attemptId },
      orderBy: { createdAt: "asc" },
    });
    return rows.map(ReviewComment.fromProps);
  }

  async updateComment(commentId: string, content: string): Promise<ReviewComment> {
    const row = await prisma.reviewComment.update({
      where: { id: commentId },
      data: { content },
    });
    return ReviewComment.fromProps(row);
  }

  async submitReview({ attemptId, decision }: SubmitReviewInput): Promise<ReviewAttempt> {
    const row = await prisma.reviewAttempt.update({
      where: { id: attemptId },
      data: { decision, status: "EVALUATING" },
    });
    return ReviewAttempt.fromProps(row);
  }

  async createReport({ attemptId, overallScore, categoryScores, summary, strengths, missedFindings, recommendations }: CreateReportInput): Promise<ReviewReport> {
    const row = await prisma.reviewReport.create({
      data: {
        attemptId,
        overallScore,
        categoryScores,
        summary,
        strengths,
        missedFindings,
        recommendations,
      },
    });
    return ReviewReport.fromProps(row);
  }

  async getReport(attemptId: string): Promise<ReviewReport | null> {
    const row = await prisma.reviewReport.findUnique({ where: { attemptId } });
    return row ? ReviewReport.fromProps(row) : null;
  }
}
