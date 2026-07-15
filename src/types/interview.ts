/**
 * Types aligned with your Prisma schema
 * DO NOT invent new types — reuse existing @prisma/client exports
 */

export type { Interview, Message, Problem, InterviewStatus, MessageRole } from '@prisma/client';

/**
 * ProcessInterviewMessageResult - what your service layer returns
 * Matches InterviewMessageService.processMessage()
 */
export interface ProcessInterviewMessageResult {
  reply: string;
  phase: string;
  previousPhase: string;
  transitioned: boolean;
  confidence: number;
  completed: boolean;
  summary: string;
}

/**
 * UI-specific derived type - never mutate, let backend provide source of truth
 * This is what the GET /api/interviews/[id] endpoint returns
 */
export interface InterviewUIState {
  id: string;
  status: 'SETUP' | 'IN_PROGRESS' | 'COMPLETED';
  template: {
    id: string;
    name: string;
    slug: string;
  };
  difficulty: string;
  duration: number;
  company: string;
  problem: {
    id: string;
    title: string;
    description: string | null;
  };
  currentPhase: string;
  summary: string;
  transcript: Array<{
    id: string;
    role: 'assistant' | 'user';
    content: string;
    metadata?: Record<string, any>;
    createdAt: string;
    elapsedSeconds: number;
    phase: string | null;
  }>;
  evaluation?: {
    id: string;
    scores?: Record<string, number>;
  } | null;
  createdAt: string;
  updatedAt: string;
  startedAt?: string;
  completedAt?: string;
}