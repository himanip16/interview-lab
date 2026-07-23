// src/features/pr-review/services/ReviewService.ts

// src/modules/pr-review/services/ReviewService.ts
import { ReviewAttempt } from "../domain/entities/ReviewAttempt";
import { ReviewComment } from "../domain/entities/ReviewComment";
import { ReviewReport } from "../domain/entities/ReviewReport";
import type { ReviewAttemptRepository } from "../infrastructure/repositories/repositories/ReviewAttemptRepository";
import type { ScenarioLoader } from "./ScenarioLoader";
import type { AddCommentInput, SubmitReviewInput } from "../infrastructure/repositories/repositories/ReviewAttemptRepository";
import { ReviewEvaluationService } from "./ReviewEvaluationService";

export class ReviewService {
  private evaluationService: ReviewEvaluationService;

  constructor(
    private repository: ReviewAttemptRepository,
    private scenarioLoader: ScenarioLoader
  ) {
    this.evaluationService = new ReviewEvaluationService(repository, scenarioLoader);
  }

  async startOrResumeAttempt(userId: string, scenarioId: string): Promise<ReviewAttempt> {
    const existing = await this.repository.findActiveAttempt(userId, scenarioId);
    if (existing) {
      return existing;
    }

    const attempt = await this.repository.create({ userId, scenarioId });
    attempt.start();
    return await this.repository.updateAttempt(attempt);
  }

  async getAttempt(attemptId: string): Promise<ReviewAttempt | null> {
    return await this.repository.findById(attemptId);
  }

  async addComment(input: AddCommentInput): Promise<ReviewComment> {
    const attempt = await this.repository.findById(input.attemptId);
    if (!attempt) {
      throw new Error("Attempt not found");
    }

    if (attempt.status !== 'IN_PROGRESS') {
      throw new Error("Can only add comments to attempts in progress");
    }

    return await this.repository.addComment(input);
  }

  async getComments(attemptId: string): Promise<ReviewComment[]> {
    return await this.repository.getComments(attemptId);
  }

  async updateComment(commentId: string, content: string): Promise<ReviewComment> {
    return await this.repository.updateComment(commentId, content);
  }

  async submitReview(input: SubmitReviewInput): Promise<ReviewAttempt> {
    const attempt = await this.repository.findById(input.attemptId);
    if (!attempt) {
      throw new Error("Attempt not found");
    }

    attempt.submit(input.decision);
    return await this.repository.updateAttempt(attempt);
  }

  async getScenarioData(scenarioId: string) {
    return await this.scenarioLoader.loadScenario(scenarioId);
  }

  async listScenarios() {
    return await this.scenarioLoader.listScenarios();
  }

  async evaluateAttempt(attemptId: string) {
    return await this.evaluationService.evaluateAttempt(attemptId);
  }

  async completeEvaluation(attemptId: string) {
    const evaluationResult = await this.evaluationService.evaluateAttempt(attemptId);
    return await this.evaluationService.completeEvaluation(attemptId, evaluationResult);
  }

  async getReport(attemptId: string): Promise<ReviewReport | null> {
    return await this.repository.getReport(attemptId);
  }
}
