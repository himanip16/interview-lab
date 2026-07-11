export interface Evaluation {
  id: string;

  interviewId: string;

  overallScore: number;

  communicationScore: number;

  architectureScore: number;

  scalabilityScore: number;

  tradeoffScore: number;

  feedback: string;

  metadata?: Record<string, unknown>;

  createdAt: Date;
}