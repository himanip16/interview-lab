// src/modules/pr-review/infrastructure/repositories/PrismaReviewAttemptRepository.ts
import { prisma } from "shared/prisma/client";
import { ReviewAttempt, ReviewAttemptProps } from "../../domain/entities/ReviewAttempt";
import { ReviewComment, ReviewCommentProps } from "../../domain/entities/ReviewComment";
import { ReviewReport, ReviewReportProps } from "../../domain/entities/ReviewReport";
import { AddCommentInput, CreateAttemptInput, CreateReportInput, ReviewAttemptRepository, SubmitReviewInput } from "./repositories/ReviewAttemptRepository";

// Mapper function to convert Prisma model to domain props
function mapToReviewAttemptProps(row: any): ReviewAttemptProps {
  return {
    id: row.id,
    userId: row.userId,
    scenarioId: row.scenarioId,
    status: row.status,
    decision: row.decision ?? undefined,
    startedAt: row.startedAt,
    completedAt: row.completedAt ?? undefined,
  };
}

function mapToReviewCommentProps(row: any): ReviewCommentProps {
  return {
    id: row.id,
    attemptId: row.attemptId,
    fileId: row.fileId,
    side: row.side,
    line: row.line,
    anchorText: row.anchorText ?? undefined,
    content: row.content,
    createdAt: row.createdAt,
  };
}

function mapToReviewReportProps(row: any): ReviewReportProps {
  return {
    id: row.id,
    attemptId: row.attemptId,
    overallScore: row.overallScore,
    categoryScores: row.categoryScores as Record<string, number>,
    summary: row.summary,
    strengths: row.strengths,
    missedFindings: row.missedFindings,
    recommendations: row.recommendations,
  };
}

export class PrismaReviewAttemptRepository implements ReviewAttemptRepository {
  async create({ userId, scenarioId }: CreateAttemptInput): Promise<ReviewAttempt> {
    const row = await prisma.reviewAttempt.create({
      data: { userId, scenarioId, status: "CREATED" },
    });
    return ReviewAttempt.fromProps(mapToReviewAttemptProps(row));
  }

  async findById(attemptId: string): Promise<ReviewAttempt | null> {
    const row = await prisma.reviewAttempt.findUnique({ where: { id: attemptId } });
    return row ? ReviewAttempt.fromProps(mapToReviewAttemptProps(row)) : null;
  }

  async findActiveAttempt(userId: string, scenarioId: string): Promise<ReviewAttempt | null> {
    const row = await prisma.reviewAttempt.findFirst({
      where: { userId, scenarioId, status: { in: ["CREATED", "IN_PROGRESS"] } },
      orderBy: { startedAt: "desc" },
    });
    return row ? ReviewAttempt.fromProps(mapToReviewAttemptProps(row)) : null;
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
    return ReviewAttempt.fromProps(mapToReviewAttemptProps(row));
  }

  async addComment({ attemptId, fileId, side, line, anchorText, content }: AddCommentInput): Promise<ReviewComment> {
    const row = await prisma.reviewComment.create({
      data: { attemptId, fileId, side, line, anchorText, content },
    });
    return ReviewComment.fromProps(mapToReviewCommentProps(row));
  }

  async getComments(attemptId: string): Promise<ReviewComment[]> {
    const rows = await prisma.reviewComment.findMany({
      where: { attemptId },
      orderBy: { createdAt: "asc" },
    });
    return rows.map(row => ReviewComment.fromProps(mapToReviewCommentProps(row)));
  }

  async updateComment(commentId: string, content: string): Promise<ReviewComment> {
    const row = await prisma.reviewComment.update({
      where: { id: commentId },
      data: { content },
    });
    return ReviewComment.fromProps(mapToReviewCommentProps(row));
  }

  async submitReview({ attemptId, decision }: SubmitReviewInput): Promise<ReviewAttempt> {
    const row = await prisma.reviewAttempt.update({
      where: { id: attemptId },
      data: { decision, status: "EVALUATING" },
    });
    return ReviewAttempt.fromProps(mapToReviewAttemptProps(row));
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
    return ReviewReport.fromProps(mapToReviewReportProps(row));
  }

  async getReport(attemptId: string): Promise<ReviewReport | null> {
    const row = await prisma.reviewReport.findUnique({ where: { attemptId } });
    return row ? ReviewReport.fromProps(mapToReviewReportProps(row)) : null;
  }
}
