// src/features/pr-review/services/ReviewEvaluationService.ts

// src/modules/pr-review/services/ReviewEvaluationService.ts
import { ReviewAttempt } from "../domain/entities/ReviewAttempt";
import { ReviewComment } from "../domain/entities/ReviewComment";
import { ReviewReport } from "../domain/entities/ReviewReport";
import type { ReviewAttemptRepository } from "../infrastructure/repositories/repositories/ReviewAttemptRepository";
import type { ScenarioLoader, Finding } from "./ScenarioLoader";
import { FindingMatcher } from "./FindingMatcher";
import { AIReportGenerator } from "./AIReportGenerator";

export interface EvaluationResult {
  overallScore: number;
  categoryScores: Record<string, number>;
  matchedFindings: Finding[];
  missedFindings: Finding[];
  unmatchedComments: ReviewComment[];
}

export class ReviewEvaluationService {
  constructor(
    private repository: ReviewAttemptRepository,
    private scenarioLoader: ScenarioLoader,
    private findingMatcher: FindingMatcher = new FindingMatcher(),
    private aiReportGenerator: AIReportGenerator = new AIReportGenerator()
  ) {}

  /**
   * Evaluates a review attempt by matching user comments against expected findings.
   */
  async evaluateAttempt(attemptId: string): Promise<EvaluationResult> {
    const attempt = await this.repository.findById(attemptId);
    if (!attempt) {
      throw new Error("Attempt not found");
    }

    if (attempt.status !== 'EVALUATING') {
      throw new Error("Can only evaluate attempts in EVALUATING status");
    }

    // Load the scenario rubric
    const rubric = await this.scenarioLoader.getRubric(attempt.scenarioId);
    
    // Get all user comments
    const comments = await this.repository.getComments(attemptId);

    // Match comments against findings
    const { matched, unmatchedFindings, unmatchedComments } = 
      this.findingMatcher.matchAll(comments, rubric.findings);

    // Calculate scores
    const matchedFindings = Array.from(matched.values());
    const overallScore = this.calculateOverallScore(matchedFindings, unmatchedFindings);
    const categoryScores = this.calculateCategoryScores(matchedFindings, unmatchedFindings);

    return {
      overallScore,
      categoryScores,
      matchedFindings,
      missedFindings: unmatchedFindings,
      unmatchedComments,
    };
  }

  /**
   * Completes the evaluation by creating a report with AI feedback and updating the attempt status.
   */
  async completeEvaluation(attemptId: string, evaluationResult: EvaluationResult): Promise<ReviewReport> {
    const attempt = await this.repository.findById(attemptId);
    if (!attempt) {
      throw new Error("Attempt not found");
    }

    // Generate AI feedback
    const aiReport = await this.aiReportGenerator.generateReport(evaluationResult);

    // Create the report with AI feedback
    const report = await this.repository.createReport({
      attemptId,
      overallScore: evaluationResult.overallScore,
      categoryScores: evaluationResult.categoryScores,
      summary: aiReport.summary,
      strengths: aiReport.strengths,
      missedFindings: evaluationResult.missedFindings,
      recommendations: [...aiReport.recommendations, aiReport.communication].filter(Boolean),
    });

    // Update attempt status to COMPLETED
    attempt.complete();
    await this.repository.updateAttempt(attempt);

    return report;
  }

  /**
   * Calculates the overall score based on matched vs missed findings.
   */
  private calculateOverallScore(matched: Finding[], missed: Finding[]): number {
    const totalPoints = matched.reduce((sum, f) => sum + f.points, 0) + 
                       missed.reduce((sum, f) => sum + f.points, 0);
    
    if (totalPoints === 0) return 0;
    
    const earnedPoints = matched.reduce((sum, f) => sum + f.points, 0);
    return Math.round((earnedPoints / totalPoints) * 100);
  }

  /**
   * Calculates scores by category.
   */
  private calculateCategoryScores(matched: Finding[], missed: Finding[]): Record<string, number> {
    const allFindings = [...matched, ...missed];
    const categories = Array.from(new Set(allFindings.map(f => f.category)));
    
    const scores: Record<string, number> = {};
    
    for (const category of categories) {
      const categoryFindings = allFindings.filter(f => f.category === category);
      const matchedInCategory = matched.filter(f => f.category === category);
      
      const totalPoints = categoryFindings.reduce((sum, f) => sum + f.points, 0);
      if (totalPoints === 0) {
        scores[category] = 0;
        continue;
      }
      
      const earnedPoints = matchedInCategory.reduce((sum, f) => sum + f.points, 0);
      scores[category] = Math.round((earnedPoints / totalPoints) * 100);
    }
    
    return scores;
  }
}
