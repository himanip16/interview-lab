// src/modules/bug-hunting/domain/entities/BugSubmission.ts
interface BugSubmissionProps {
  id: string;
  attemptId: string;
  rootCause: string;
  proposedFix: string;
  submittedAt: Date;
}

export class BugSubmission {
  private constructor(private readonly props: BugSubmissionProps) {}

  static fromProps(props: BugSubmissionProps): BugSubmission {
    return new BugSubmission(props);
  }

  toJSON(): BugSubmissionProps {
    return this.props;
  }
}