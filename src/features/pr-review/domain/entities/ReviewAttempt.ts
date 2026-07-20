// src/modules/pr-review/domain/entities/ReviewAttempt.ts
import { ReviewStatus, ReviewDecision } from "@prisma/client";

export interface ReviewAttemptProps {
  id: string;
  userId: string;
  scenarioId: string;
  status: ReviewStatus;
  decision?: ReviewDecision;
  startedAt: Date;
  completedAt?: Date;
}

export class ReviewAttempt {
  constructor(private props: ReviewAttemptProps) {}

  static fromProps(props: ReviewAttemptProps): ReviewAttempt {
    return new ReviewAttempt(props);
  }

  get id(): string {
    return this.props.id;
  }

  get userId(): string {
    return this.props.userId;
  }

  get scenarioId(): string {
    return this.props.scenarioId;
  }

  get status(): ReviewStatus {
    return this.props.status;
  }

  get decision(): ReviewDecision | undefined {
    return this.props.decision;
  }

  get startedAt(): Date {
    return this.props.startedAt;
  }

  get completedAt(): Date | undefined {
    return this.props.completedAt;
  }

  public start(): void {
    if (this.props.status !== 'CREATED') {
      throw new Error("Can only start a review that is in CREATED status.");
    }
    this.props.status = 'IN_PROGRESS';
  }

  public submit(decision: ReviewDecision): void {
    if (this.props.status !== 'IN_PROGRESS') {
      throw new Error("Can only submit a review that is currently in progress.");
    }
    this.props.decision = decision;
    this.props.status = 'EVALUATING';
  }

  public complete(): void {
    if (this.props.status !== 'EVALUATING') {
      throw new Error("Cannot complete a review that isn't being evaluated.");
    }
    this.props.status = 'COMPLETED';
    this.props.completedAt = new Date();
  }

  public fail(): void {
    this.props.status = 'FAILED';
    this.props.completedAt = new Date();
  }

  toProps(): ReviewAttemptProps {
    return { ...this.props };
  }
}
