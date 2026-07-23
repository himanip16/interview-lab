// src/features/pr-review/domain/entities/ReviewAttempt.ts

// src/modules/pr-review/domain/entities/ReviewAttempt.ts

import { ReviewDecision, ReviewStatus } from "@prisma/client";

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
  private constructor(private readonly props: ReviewAttemptProps) {}

  static fromProps(props: ReviewAttemptProps): ReviewAttempt {
    validateInvariants(props);

    return new ReviewAttempt({
      ...props,
      startedAt: new Date(props.startedAt),
      completedAt: props.completedAt
        ? new Date(props.completedAt)
        : undefined,
    });
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
    return new Date(this.props.startedAt);
  }

  get completedAt(): Date | undefined {
    return this.props.completedAt
      ? new Date(this.props.completedAt)
      : undefined;
  }

  public start(): void {
    this.ensureStatus(ReviewStatus.CREATED);

    this.props.status = ReviewStatus.IN_PROGRESS;
  }

  public submit(decision: ReviewDecision): void {
    this.ensureStatus(ReviewStatus.IN_PROGRESS);

    this.props.decision = decision;
    this.props.status = ReviewStatus.EVALUATING;
  }

  public complete(): void {
    this.ensureStatus(ReviewStatus.EVALUATING);

    this.props.status = ReviewStatus.COMPLETED;
    this.props.completedAt = new Date();
  }

  public fail(): void {
    this.ensureStatus(ReviewStatus.EVALUATING);

    this.props.status = ReviewStatus.FAILED;
    this.props.completedAt = new Date();
  }

  public toProps(): ReviewAttemptProps {
    return {
      ...this.props,
      startedAt: new Date(this.props.startedAt),
      completedAt: this.props.completedAt
        ? new Date(this.props.completedAt)
        : undefined,
    };
  }

  private ensureStatus(expected: ReviewStatus): void {
    if (this.props.status !== expected) {
      throw new Error(
        `Expected status '${expected}' but found '${this.props.status}'.`
      );
    }
  }
}

function validateInvariants(props: ReviewAttemptProps): void {
  if (
    props.status === ReviewStatus.COMPLETED &&
    !props.completedAt
  ) {
    throw new Error(
      "Completed review must have completedAt."
    );
  }

  if (
    props.status === ReviewStatus.FAILED &&
    !props.completedAt
  ) {
    throw new Error(
      "Failed review must have completedAt."
    );
  }

  if (
    props.status === ReviewStatus.CREATED &&
    props.decision
  ) {
    throw new Error(
      "Created review cannot have a decision."
    );
  }

  if (
    props.status === ReviewStatus.IN_PROGRESS &&
    props.decision
  ) {
    throw new Error(
      "In-progress review cannot have a decision."
    );
  }

  if (
    props.status === ReviewStatus.EVALUATING &&
    !props.decision
  ) {
    throw new Error(
      "Evaluating review must have a decision."
    );
  }
}