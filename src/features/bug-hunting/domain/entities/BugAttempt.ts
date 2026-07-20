// src/modules/bug-hunting/domain/entities/BugAttempt.ts
import { AttemptStatus } from "../value-objects/AttemptStatus";
import { z } from "zod";

interface BugAttemptProps {
  id: string;
  userId: string;
  scenarioId: string;
  status: AttemptStatus;
  score: number | null;
  feedback: string | null;
  startedAt: Date;
  completedAt: Date | null;
}

// Zod schema for validation
const BugAttemptSchema = z.object({
  id: z.string(),
  userId: z.string(),
  scenarioId: z.string(),
  status: z.enum(["STARTED", "INVESTIGATING", "SUBMITTED", "COMPLETED", "ABANDONED"]),
  score: z.number().nullable(),
  feedback: z.string().nullable(),
  startedAt: z.coerce.date(),
  completedAt: z.coerce.date().nullable(),
});

export class BugAttempt {
  private constructor(private props: BugAttemptProps) {}

  static fromProps(props: BugAttemptProps): BugAttempt {
    return new BugAttempt(props);
  }

  static fromJSON(raw: unknown): BugAttempt {
    const validated = BugAttemptSchema.parse(raw);
    return new BugAttempt(validated as BugAttemptProps);
  }

  get id() {
    return this.props.id;
  }

  get status() {
    return this.props.status;
  }

  get scenarioId() {
    return this.props.scenarioId;
  }

  get userId() {
    return this.props.userId;
  }

  get score() {
    return this.props.score;
  }

  get feedback() {
    return this.props.feedback;
  }

  get startedAt() {
    return this.props.startedAt;
  }

  get completedAt() {
    return this.props.completedAt;
  }

  isActive(): boolean {
    return this.props.status === AttemptStatus.STARTED || this.props.status === AttemptStatus.INVESTIGATING;
  }

  canSubmit(): boolean {
    return this.isActive();
  }

  canRecordFinding(): boolean {
    return this.isActive();
  }

  transitionToInvestigating(): BugAttempt {
    if (this.props.status !== AttemptStatus.STARTED) {
      throw new Error("Can only transition to INVESTIGATING from STARTED");
    }
    return new BugAttempt({ ...this.props, status: AttemptStatus.INVESTIGATING });
  }

  submit(): BugAttempt {
    if (!this.canSubmit()) {
      throw new Error("Cannot submit an inactive or already submitted attempt");
    }
    return new BugAttempt({ ...this.props, status: AttemptStatus.SUBMITTED });
  }

  complete(score: number, feedback: string): BugAttempt {
    if (this.props.status !== AttemptStatus.SUBMITTED) {
      throw new Error("Can only complete a submitted attempt");
    }
    return new BugAttempt({
      ...this.props,
      status: AttemptStatus.COMPLETED,
      score,
      feedback,
      completedAt: new Date(),
    });
  }

  toJSON(): BugAttemptProps {
    return this.props;
  }
}