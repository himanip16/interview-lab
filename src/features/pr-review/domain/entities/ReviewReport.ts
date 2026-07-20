// src/modules/pr-review/domain/entities/ReviewReport.ts

export interface ReviewReportProps {
  id: string;
  attemptId: string;
  overallScore: number;
  categoryScores: Record<string, number>;
  summary: string;
  strengths: string[];
  missedFindings: any[];
  recommendations: string[];
}

export class ReviewReport {
  constructor(private props: ReviewReportProps) {}

  static fromProps(props: ReviewReportProps): ReviewReport {
    return new ReviewReport(props);
  }

  get id(): string {
    return this.props.id;
  }

  get attemptId(): string {
    return this.props.attemptId;
  }

  get overallScore(): number {
    return this.props.overallScore;
  }

  get categoryScores(): Record<string, number> {
    return this.props.categoryScores;
  }

  get summary(): string {
    return this.props.summary;
  }

  get strengths(): string[] {
    return this.props.strengths;
  }

  get missedFindings(): any[] {
    return this.props.missedFindings;
  }

  get recommendations(): string[] {
    return this.props.recommendations;
  }

  toProps(): ReviewReportProps {
    return { ...this.props };
  }
}
