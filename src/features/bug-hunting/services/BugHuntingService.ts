// src/modules/bug-hunting/services/BugHuntingService.ts

import { BugScenarioRepository } from "@/features/bug-hunting/infrastructure/repositories/BugScenarioRepository";
import { BugAttemptRepository } from "@/features/bug-hunting/infrastructure/repositories/BugAttemptRepository";
import { InvestigationArtifactSource } from "@prisma/client";
import { BugAttempt } from "../domain/entities/BugAttempt";
import { BugAttemptStatus } from "@prisma/client";
import { BugScenarioMapper } from "../application/mappers/BugScenarioMapper";
import type {
  BugScenarioDetailDTO,
  BugScenarioListDTO,
} from "../application/dtos/BugScenarioDTO";

export class BugHuntingService {
  constructor(
    private readonly scenarios: BugScenarioRepository,
    private readonly attempts: BugAttemptRepository
  ) {}

  async getScenario(id: string): Promise<BugScenarioDetailDTO | null> {
    const scenario = await this.scenarios.findById(id);

    if (!scenario) return null;

    return BugScenarioMapper.toDTO(scenario);
  }

  async listScenarios(): Promise<BugScenarioListDTO[]> {
    const scenarios = await this.scenarios.list();

    return scenarios.map((s) => BugScenarioMapper.toListDTO(s));
  }

  async startOrResumeAttempt(
    userId: string,
    scenarioId: string
  ): Promise<BugAttempt> {
    const scenario = await this.scenarios.findById(scenarioId);

    if (!scenario) {
      throw new Error("Scenario not found");
    }

    const existing = await this.attempts.findActiveAttempt(
      userId,
      scenarioId
    );

    if (existing) {
      return existing;
    }

    return this.attempts.create({
      userId,
      scenarioId,
    });
  }

  async logHypothesis(attemptId: string, scenarioId: string, hypothesis: string, userId: string): Promise<void> {
    if (!hypothesis.trim()) {
      throw new Error("Hypothesis cannot be empty");
    }
    const attempt = await this.attempts.findById(attemptId);
    if (!attempt) throw new Error("Attempt not found");
    if (attempt.userId !== userId) throw new Error("Unauthorized: Attempt does not belong to user");
    if (!attempt.canRecordFinding()) throw new Error("Cannot log a hypothesis on a completed attempt");

    await this.attempts.logHypothesis({ attemptId, scenarioId, hypothesis });

    // Transition status from STARTED to INVESTIGATING when user logs first hypothesis
    if (attempt.status === BugAttemptStatus.STARTED) {
      const updatedAttempt = attempt.transitionToInvestigating();
      await this.attempts.updateAttempt(updatedAttempt);
    }
  }

  async recordFinding(attemptId: string, source: InvestigationArtifactSource, refId: string, note?: string, userId?: string) {
    const attempt = await this.attempts.findById(attemptId);
    if (!attempt) throw new Error("Attempt not found");
    if (userId && attempt.userId !== userId) throw new Error("Unauthorized: Attempt does not belong to user");
    if (!attempt.canRecordFinding()) throw new Error("Cannot record findings on a completed attempt");

    return this.attempts.recordFinding({ attemptId, source, refId, note });
  }

  async submitFix(attemptId: string, rootCause: string, proposedFix: string, userId: string) {
    if (!rootCause.trim() || !proposedFix.trim()) {
      throw new Error("rootCause and proposedFix are required");
    }
    const attempt = await this.attempts.findById(attemptId);
    if (!attempt) throw new Error("Attempt not found");
    if (attempt.userId !== userId) throw new Error("Unauthorized: Attempt does not belong to user");
    if (!attempt.canSubmit()) throw new Error("This attempt has already been submitted");

    const submission = await this.attempts.submitFix({ attemptId, rootCause, proposedFix });

    // Grading is intentionally decoupled from submission — call gradeAttempt
    // separately (sync or async via a queue) once real grading logic exists.
    return submission;
  }

  async gradeAttempt(attemptId: string, score: number, feedback: string) {
    const attempt = await this.attempts.findById(attemptId);
    if (!attempt) throw new Error("Attempt not found");
    
    const completedAttempt = attempt.complete(score, feedback);
    return this.attempts.updateAttempt(completedAttempt);
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

   

const { database } = scenario.toJSON();

if (!database) {
  throw new Error(
    "This scenario does not contain a database."
  );
}

const sql = {
  columns: database.tables[0]?.columns.map((c) => c.name) ?? [],
  rows: database.tables[0]?.rows ?? [],
};
    
    // Basic SQL simulation - filter rows based on simple WHERE clauses
    let filteredRows = [...sql.rows];
    
    // Simple WHERE clause parsing for common patterns
    const whereMatch = query.match(/WHERE\s+(.+?)(?:\s+ORDER\s+BY|\s+LIMIT|;|$)/i);
    if (whereMatch) {
      const whereClause = whereMatch[1].trim();
      
      // Handle simple equality conditions: column = 'value'
      const equalityMatches = whereClause.matchAll(/(\w+)\s*=\s*['"]([^'"]+)['"]/gi);
      for (const match of equalityMatches) {
        const column = match[1].toLowerCase();
        const value = match[2];
        
        const colIndex = sql.columns.findIndex(c => c.toLowerCase() === column);
        if (colIndex !== -1) {
          filteredRows = filteredRows.filter(row => row[colIndex] === value);
        }
      }
      
      // Handle simple inequality: column != 'value'
      const inequalityMatches = whereClause.matchAll(/(\w+)\s*!=\s*['"]([^'"]+)['"]/gi);
      for (const match of inequalityMatches) {
        const column = match[1].toLowerCase();
        const value = match[2];
        
        const colIndex = sql.columns.findIndex(c => c.toLowerCase() === column);
        if (colIndex !== -1) {
          filteredRows = filteredRows.filter(row => row[colIndex] !== value);
        }
      }
      
      const likeMatches = whereClause.matchAll(
  /(\w+)\s+LIKE\s+['"]%([^'"]*)%['"]/gi
);

for (const match of likeMatches) {
  const column = match[1].toLowerCase();
  const value = match[2].toLowerCase();

  const colIndex = sql.columns.findIndex(
    (c) => c.toLowerCase() === column
  );

  if (colIndex !== -1) {
    filteredRows = filteredRows.filter((row) =>
      String(row[colIndex] ?? "")
        .toLowerCase()
        .includes(value)
    );
  }
}
    }
    
    // Handle LIMIT
    const limitMatch = query.match(/LIMIT\s+(\d+)/i);
    if (limitMatch) {
      const limit = parseInt(limitMatch[1], 10);
      filteredRows = filteredRows.slice(0, limit);
    }
    
    return { columns: sql.columns, rows: filteredRows, executedQuery: query };
  }
}