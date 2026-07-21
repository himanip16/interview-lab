// src/features/learning/types/learning.ts
// Whiteboard types migrated to whiteboard.ts - this file now contains only learning-specific types

export interface Scenario {
  id: string;
  title: string;
  description?: string;
  segments: Segment[];
}

export interface ScenarioListItem {
  id: string;
  title: string;
  description?: string;
  slug: string;
  _count: {
    segments: number;
  };
}

export interface Segment {
  id: string;
  conversation: ConversationMessage[];
  takeaway?: string;
  actions: Action[];
}

export interface ConversationMessage {
  role: "user" | "assistant";
  content: string;
}


export type ActionType =
  | "OBSERVE"
  | "JUDGE"
  | "FIX"
  | "PREDICT"
  | "COMPARE";


export interface Action {
  id: string;
  type: ActionType;
  title: string;
  instructions?: string;
  content: unknown;
}

export interface ObserveActionContent {
  observation: string;
  reflection: string;
}



export interface JudgeActionContent {
  question: string;
  options: Array<{
    id: string;
    text: string;
  }>;
  correctOptionId: string;
  reflection: string;
}

export interface FixActionContent {
  interviewerQuestion: string;
  flawedAnswer: string;
  reflection: string;
}


export interface PredictActionContent {
  question: string;
  revealExplanation: string;
  reflection?: string;
}

export interface CompareActionContent {
  candidateA: string;
  candidateB: string;
  correctChoice: "A" | "B";
  reflection: string;
}