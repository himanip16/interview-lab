// src/modules/pr-review/repositories/ReviewAttemptRepository.ts

import { ReviewAttempt } from "../../../domain/entities/ReviewAttempt";
import { ReviewComment } from "../../../domain/entities/ReviewComment";
import { ReviewReport } from "../../../domain/entities/ReviewReport";

export interface CreateAttemptInput {
  userId: string;
  scenarioId: string;
}

export interface AddCommentInput {
  attemptId: string;
  fileId: string;
  side: string;
  line: number;
  anchorText?: string;
  content: string;
}

export interface SubmitReviewInput {
  attemptId: string;
  decision: "APPROVE" | "REQUEST_CHANGES" | "REJECT";
}

export interface CreateReportInput {
  attemptId: string;
  overallScore: number;
  categoryScores: Record<string, number>;
  summary: string;
  strengths: string[];
  missedFindings: any[];
  recommendations: string[];
}

export interface ReviewAttemptRepository {
  create(input: CreateAttemptInput): Promise<ReviewAttempt>;
  findById(attemptId: string): Promise<ReviewAttempt | null>;
  findActiveAttempt(userId: string, scenarioId: string): Promise<ReviewAttempt | null>;
  updateAttempt(attempt: ReviewAttempt): Promise<ReviewAttempt>;

  addComment(input: AddCommentInput): Promise<ReviewComment>;
  getComments(attemptId: string): Promise<ReviewComment[]>;
  updateComment(commentId: string, content: string): Promise<ReviewComment>;

  submitReview(input: SubmitReviewInput): Promise<ReviewAttempt>;
  createReport(input: CreateReportInput): Promise<ReviewReport>;
  getReport(attemptId: string): Promise<ReviewReport | null>;
}
