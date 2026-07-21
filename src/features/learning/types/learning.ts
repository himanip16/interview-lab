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

export interface Action {
  id: string;
  type: string;
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
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface FixActionContent {
  problem: string;
  solution: string;
  hints?: string[];
}

export interface PredictActionContent {
  context: string;
  prediction: string;
  explanation: string;
}

export interface CompareActionContent {
  items: Array<{
    name: string;
    description: string;
  }>;
  comparison: string;
}