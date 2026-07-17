// src/modules/bug-hunting/domain/entities/BugAttempt.ts
export type BugAttemptStatus = "STARTED" | "INVESTIGATING" | "SUBMITTED" | "COMPLETED" | "ABANDONED";

interface BugAttemptProps {
  id: string;
  userId: string;
  scenarioId: string;
  status: BugAttemptStatus;
  score: number | null;
  feedback: string | null;
  startedAt: Date;
  completedAt: Date | null;
}

export class BugAttempt {
  private constructor(private readonly props: BugAttemptProps) {}

  static fromProps(props: BugAttemptProps): BugAttempt {
    return new BugAttempt(props);
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

  isActive(): boolean {
    return this.props.status === "STARTED" || this.props.status === "INVESTIGATING";
  }

  toJSON(): BugAttemptProps {
    return this.props;
  }
}