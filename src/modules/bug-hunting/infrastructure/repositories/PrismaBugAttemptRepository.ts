// src/modules/bug-hunting/infrastructure/repositories/PrismaBugAttemptRepository.ts
import { prisma } from "@/shared/prisma/client";
import { BugAttempt } from "../../domain/entities/BugAttempt";
import { BugSubmission } from "../../domain/entities/BugSubmission";
import { Finding } from "../../domain/entities/Finding";
import { AttemptStatus } from "../../domain/value-objects/AttemptStatus";
import type {
  BugAttemptRepository,
  CreateAttemptInput,
  LogHypothesisInput,
  RecordFindingInput,
  SubmitFixInput,
  GradeAttemptInput,
} from "../../repositories/BugAttemptRepository";

export class PrismaBugAttemptRepository implements BugAttemptRepository {
  private convertStatus(status: string): AttemptStatus {
    return status as AttemptStatus;
  }

  async create({ userId, scenarioId }: CreateAttemptInput): Promise<BugAttempt> {
    const row = await prisma.bugAttempt.create({
      data: { userId, scenarioId, status: "STARTED" },
    });
    return BugAttempt.fromProps({ ...row, status: this.convertStatus(row.status) });
  }

  async findById(attemptId: string): Promise<BugAttempt | null> {
    const row = await prisma.bugAttempt.findUnique({ where: { id: attemptId } });
    return row ? BugAttempt.fromProps({ ...row, status: this.convertStatus(row.status) }) : null;
  }

  async findActiveAttempt(userId: string, scenarioId: string): Promise<BugAttempt | null> {
    const row = await prisma.bugAttempt.findFirst({
      where: { userId, scenarioId, status: { in: ["STARTED", "INVESTIGATING", "SUBMITTED"] } },
      orderBy: { startedAt: "desc" },
    });
    return row ? BugAttempt.fromProps({ ...row, status: this.convertStatus(row.status) }) : null;
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
    return Finding.fromProps(row);
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
    return BugSubmission.fromProps(submission);
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
    return BugAttempt.fromProps({ ...row, status: this.convertStatus(row.status) });
  }

  async getSubmission(attemptId: string): Promise<BugSubmission | null> {
    const row = await prisma.bugSubmission.findUnique({ where: { attemptId } });
    return row ? BugSubmission.fromProps(row) : null;
  }

  async listFindings(attemptId: string): Promise<Finding[]> {
    const rows = await prisma.finding.findMany({
      where: { attemptId },
      orderBy: { createdAt: "asc" },
    });
    return rows.map(Finding.fromProps);
  }
}