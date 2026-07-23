// src/features/interview/types/interview.ts

// types/interview.ts
export interface Interview {
  id: string;
  sessionId: string;
  problem: {
    id: string;
    title: string;
    description: string;
  };
  currentPhase: string;
  phases: Phase[];
  status: 'active' | 'paused' | 'completed';
  timeRemaining: number;
  startedAt: Date;
  phaseSummaries: Record<string, string[]>;
}

export interface Phase {
  id: string;
  name: string;
  status: 'completed' | 'current' | 'upcoming';
  durationSeconds?: number;
}

export interface Message {
  id: string;
  role: 'interviewer' | 'candidate';
  content: string;
  timestamp: Date;
  phase: string;
}