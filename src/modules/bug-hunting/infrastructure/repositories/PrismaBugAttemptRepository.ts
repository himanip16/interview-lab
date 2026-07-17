// src/modules/bug-hunting/infrastructure/repositories/PrismaBugAttemptRepository.ts
import { prisma } from "@/shared/prisma/client";
import { BugAttempt } from "../../domain/entities/BugAttempt";
import { BugSubmission } from "../../domain/entities/BugSubmission";
import { Finding } from "../../domain/entities/Finding";
import type {
  BugAttemptRepository,
  CreateAttemptInput,
  LogHypothesisInput,
  RecordFindingInput,
  SubmitFixInput,
  GradeAttemptInput,
} from "../../repositories/BugAttemptRepository";

export class PrismaBugAttemptRepository implements BugAttemptRepository {
  async create({ userId, scenarioId }: CreateAttemptInput): Promise<BugAttempt> {
    const row = await prisma.bugAttempt.create({
      data: { userId, scenarioId, status: "STARTED" },
    });
    return BugAttempt.fromProps(row);
  }

  async findById(attemptId: string): Promise<BugAttempt | null> {
    const row = await prisma.bugAttempt.findUnique({ where: { id: attemptId } });
    return row ? BugAttempt.fromProps(row) : null;
  }

  async findActiveAttempt(userId: string, scenarioId: string): Promise<BugAttempt | null> {
    const row = await prisma.bugAttempt.findFirst({
      where: { userId, scenarioId, status: { in: ["STARTED", "INVESTIGATING"] } },
      orderBy: { startedAt: "desc" },
    });
    return row ? BugAttempt.fromProps(row) : null;
  }

  async logHypothesis({ attemptId, scenarioId, userId, hypothesis }: LogHypothesisInput): Promise<void> {
    await prisma.$transaction([
      prisma.bugHypothesisAttempt.create({
        data: { attemptId, scenarioId, userId, hypothesis },
      }),
      // Logging a hypothesis is evidence the user has moved from "just
      // started" to actively investigating.
      prisma.bugAttempt.updateMany({
        where: { id: attemptId, status: "STARTED" },
        data: { status: "INVESTIGATING" },
      }),
    ]);
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

  async gradeAttempt({ attemptId, score, feedback }: GradeAttemptInput): Promise<BugAttempt> {
    const row = await prisma.bugAttempt.update({
      where: { id: attemptId },
      data: { score, feedback, status: "COMPLETED", completedAt: new Date() },
    });
    return BugAttempt.fromProps(row);
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