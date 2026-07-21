// src/modules/bug-hunting/repositories/BugAttemptRepository.ts
import { BugAttempt } from "@/features/bug-hunting/domain/entities/BugAttempt";
import { BugSubmission } from "@/features/bug-hunting/domain/entities/BugSubmission";
import { Finding } from "@/features/bug-hunting/domain/entities/Finding";
import { InvestigationArtifactSource } from "@prisma/client";

export interface CreateAttemptInput {
  userId: string;
  scenarioId: string;
}

export interface LogHypothesisInput {
  attemptId: string;
  scenarioId: string;
  hypothesis: string;
}

export interface RecordFindingInput {
  attemptId: string;
  source: InvestigationArtifactSource;
  refId: string;
  note?: string;
}

export interface SubmitFixInput {
  attemptId: string;
  rootCause: string;
  proposedFix: string;
}

export interface GradeAttemptInput {
  attemptId: string;
  score: number;
  feedback: string;
}

export interface BugAttemptRepository {
  create(input: CreateAttemptInput): Promise<BugAttempt>;
  findById(attemptId: string): Promise<BugAttempt | null>;
  findActiveAttempt(userId: string, scenarioId: string): Promise<BugAttempt | null>;
  updateAttempt(attempt: BugAttempt): Promise<BugAttempt>;

  logHypothesis(input: LogHypothesisInput): Promise<void>;
  recordFinding(input: RecordFindingInput): Promise<Finding>;
  submitFix(input: SubmitFixInput): Promise<BugSubmission>;

  getSubmission(attemptId: string): Promise<BugSubmission | null>;
  listFindings(attemptId: string): Promise<Finding[]>;
}