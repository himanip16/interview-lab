import type { TranscriptMessage } from './TranscriptMessage';

export interface InterviewProblem {
  id: string;
  title: string;
  description: string | null;
  difficulty: string;
  company: string | null;
}

export interface InterviewState {
  id: string;
  status: string;
  currentPhase: string;
  duration: number;
  createdAt: string;
  transcript: TranscriptMessage[];
  summary: string | null;

  problem: InterviewProblem;
}