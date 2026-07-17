// src/modules/bug-hunting/services/BugHuntingService.ts
import type { BugScenarioRepository } from "../repositories/BugScenarioRepository";
import type { BugAttemptRepository } from "../repositories/BugAttemptRepository";
import type { InvestigationArtifactSource } from "../domain/entities/Finding";
import { BugScenario } from "../domain/entities/BugScenario";
import { BugAttempt } from "../domain/entities/BugAttempt";

export class BugHuntingService {
  constructor(
    private readonly scenarios: BugScenarioRepository,
    private readonly attempts: BugAttemptRepository
  ) {}

  async getScenario(id: string): Promise<BugScenario | null> {
    return this.scenarios.findById(id);
  }

  /** Resumes an in-progress attempt if one exists, otherwise starts a new one. */
  async startOrResumeAttempt(userId: string, scenarioId: string): Promise<BugAttempt> {
    const scenario = await this.scenarios.findById(scenarioId);
    if (!scenario) throw new Error("Scenario not found");

    const existing = await this.attempts.findActiveAttempt(userId, scenarioId);
    if (existing) return existing;

    return this.attempts.create({ userId, scenarioId });
  }

  async logHypothesis(attemptId: string, scenarioId: string, userId: string, hypothesis: string): Promise<void> {
    if (!hypothesis.trim()) {
      throw new Error("Hypothesis cannot be empty");
    }
    const attempt = await this.attempts.findById(attemptId);
    if (!attempt) throw new Error("Attempt not found");
    if (!attempt.isActive()) throw new Error("Cannot log a hypothesis on a completed attempt");

    await this.attempts.logHypothesis({ attemptId, scenarioId, userId, hypothesis });
  }

  async recordFinding(attemptId: string, source: InvestigationArtifactSource, refId: string, note?: string) {
    const attempt = await this.attempts.findById(attemptId);
    if (!attempt) throw new Error("Attempt not found");
    if (!attempt.isActive()) throw new Error("Cannot record findings on a completed attempt");

    return this.attempts.recordFinding({ attemptId, source, refId, note });
  }

  async submitFix(attemptId: string, rootCause: string, proposedFix: string) {
    if (!rootCause.trim() || !proposedFix.trim()) {
      throw new Error("rootCause and proposedFix are required");
    }
    const attempt = await this.attempts.findById(attemptId);
    if (!attempt) throw new Error("Attempt not found");
    if (!attempt.isActive()) throw new Error("This attempt has already been submitted");

    const submission = await this.attempts.submitFix({ attemptId, rootCause, proposedFix });

    // Grading is intentionally decoupled from submission — call gradeAttempt
    // separately (sync or async via a queue) once real grading logic exists.
    return submission;
  }

  async gradeAttempt(attemptId: string, score: number, feedback: string) {
    return this.attempts.gradeAttempt({ attemptId, score, feedback });
  }

  async getAttemptSummary(attemptId: string) {
    const attempt = await this.attempts.findById(attemptId);
    if (!attempt) throw new Error("Attempt not found");

    const [submission, findings] = await Promise.all([
      this.attempts.getSubmission(attemptId),
      this.attempts.listFindings(attemptId),
    ]);

    return {
      attempt: attempt.toJSON(),
      submission: submission?.toJSON() ?? null,
      findings: findings.map((f) => f.toJSON()),
    };
  }

  async runSqlQuery(scenarioId: string, query: string) {
    const scenario = await this.scenarios.findById(scenarioId);
    if (!scenario) throw new Error("Scenario not found");

    const { sql } = scenario.toJSON();
    return { columns: sql.columns, rows: sql.rows, executedQuery: query };
  }
}