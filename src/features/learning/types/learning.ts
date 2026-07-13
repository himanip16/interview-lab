import { LearningActionType } from "@prisma/client";

export interface ObserveActionContent {
  schemaVersion: number;
  reflection: string;
}

export interface JudgeActionContent {
  schemaVersion: number;
  question: string;
  options: Array<{
    id: string;
    text: string;
    isCorrect: boolean;
  }>;
  reflection: string;
}

export interface FixActionContent {
  schemaVersion: number;
  question: string;
  flawedAnswer: string;
  reflection: string;
}

export interface PredictActionContent {
  schemaVersion: number;
  question: string;
  revealExplanation: string;
}

export interface CompareActionContent {
  schemaVersion: number;
  question: string;
  candidateA: {
    name: string;
    answer: string;
  };
  candidateB: {
    name: string;
    answer: string;
  };
  correctChoice: "A" | "B";
  reflection: string;
}

export type LearningActionContent =
  | { type: "OBSERVE"; content: ObserveActionContent }
  | { type: "JUDGE"; content: JudgeActionContent }
  | { type: "FIX"; content: FixActionContent }
  | { type: "PREDICT"; content: PredictActionContent }
  | { type: "COMPARE"; content: CompareActionContent };

export interface Scenario {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
  segments: Segment[];
}

export interface Segment {
  id: string;
  order: number;
  conversation: any;
  takeaway: string | null;
  actions: Action[];
  concepts: ConceptLink[];
}

export interface Action {
  id: string;
  type: LearningActionType;
  title: string;
  instructions: string | null;
  content: any;
  contentVersion: number;
  isActive: boolean;
  concepts: ConceptLink[];
}

export interface ConceptLink {
  id: string;
  weight: number;
  concept: {
    id: string;
    slug: string;
    name: string;
    description: string | null;
    category: string;
  };
}

export interface ScenarioListItem {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
  _count: {
    segments: number;
  };
}
