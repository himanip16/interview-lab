// src/features/bug-hunting/infrastructure/repositories/PrismaBugAttemptRepository.ts

// src/modules/bug-hunting/infrastructure/repositories/PrismaBugAttemptRepository.ts
import { prisma } from "shared/prisma/client";
import { BugAttempt, BugAttemptProps } from "../../domain/entities/BugAttempt";
import { BugSubmission, BugSubmissionProps } from "../../domain/entities/BugSubmission";
import { Finding, FindingProps } from "../../domain/entities/Finding";
import { BugAttemptStatus } from "@prisma/client";
import type {
  BugAttemptRepository,
  CreateAttemptInput,
  LogHypothesisInput,
  RecordFindingInput,
  SubmitFixInput,
  GradeAttemptInput,
} from "@/features/bug-hunting/infrastructure/repositories/BugAttemptRepository";

// Mapper function to convert Prisma model to domain props
function mapToBugAttemptProps(row: any): BugAttemptProps {
  return {
    id: row.id,
    userId: row.userId,
    scenarioId: row.scenarioId,
    status: row.status as BugAttemptStatus,
    score: row.score,
    feedback: row.feedback,
    startedAt: row.startedAt,
    completedAt: row.completedAt,
  };
}

function mapToBugSubmissionProps(row: any): BugSubmissionProps {
  return {
    id: row.id,
    attemptId: row.attemptId,
    rootCause: row.rootCause,
    proposedFix: row.proposedFix,
    submittedAt: row.submittedAt,
  };
}

function mapToFindingProps(row: any): FindingProps {
  return {
    id: row.id,
    attemptId: row.attemptId,
    source: row.source,
    refId: row.refId,
    note: row.note,
    createdAt: row.createdAt,
  };
}

export class PrismaBugAttemptRepository implements BugAttemptRepository {
  async create({ userId, scenarioId }: CreateAttemptInput): Promise<BugAttempt> {
    const row = await prisma.bugAttempt.create({
      data: { userId, scenarioId, status: "STARTED" },
    });
    return BugAttempt.fromProps(mapToBugAttemptProps(row));
  }

  async findById(attemptId: string): Promise<BugAttempt | null> {
    const row = await prisma.bugAttempt.findUnique({ where: { id: attemptId } });
    return row ? BugAttempt.fromProps(mapToBugAttemptProps(row)) : null;
  }

  async findActiveAttempt(userId: string, scenarioId: string): Promise<BugAttempt | null> {
    const row = await prisma.bugAttempt.findFirst({
      where: { userId, scenarioId, status: { in: ["STARTED", "INVESTIGATING", "SUBMITTED"] } },
      orderBy: { startedAt: "desc" },
    });
    return row ? BugAttempt.fromProps(mapToBugAttemptProps(row)) : null;
  }

  async logHypothesis({ attemptId, scenarioId, hypothesis }: LogHypothesisInput): Promise<void> {
    await prisma.bugHypothesisAttempt.create({
      data: { attemptId, scenarioId, hypothesis },
    });
  }

  async recordFinding({ attemptId, source, refId, note }: RecordFindingInput): Promise<Finding> {
    const row = await prisma.finding.create({
      data: { attemptId, source, refId, note: note ?? null },
    });
    return Finding.fromProps(mapToFindingProps(row));
  }

  async submitFix({ attemptId, rootCause, proposedFix }: SubmitFixInput): Promise<BugSubmission> {
    const [submission] = await prisma.$transaction([
      prisma.bugSubmission.upsert({
        where: { attemptId },
        create: { attemptId, rootCause, proposedFix },
        update: { rootCause, proposedFix, submittedAt: new Date() },
      }),
      prisma.bugAttempt.update({
        where: { id: attemptId },
        data: { status: "SUBMITTED" },
      }),
    ]);
    return BugSubmission.fromProps(mapToBugSubmissionProps(submission));
  }

  async updateAttempt(attempt: BugAttempt): Promise<BugAttempt> {
    const row = await prisma.bugAttempt.update({
      where: { id: attempt.id },
      data: {
        status: attempt.status as any,
        score: attempt.score,
        feedback: attempt.feedback,
        completedAt: attempt.completedAt,
      },
    });
    return BugAttempt.fromProps(mapToBugAttemptProps(row));
  }

  async getSubmission(attemptId: string): Promise<BugSubmission | null> {
    const row = await prisma.bugSubmission.findUnique({ where: { attemptId } });
    return row ? BugSubmission.fromProps(mapToBugSubmissionProps(row)) : null;
  }

  async listFindings(attemptId: string): Promise<Finding[]> {
    const rows = await prisma.finding.findMany({
      where: { attemptId },
      orderBy: { createdAt: "asc" },
    });
    return rows.map(row => Finding.fromProps(mapToFindingProps(row)));
  }
}