import { LearningActionType } from "@prisma/client";

export interface ObserveActionContent {
  schemaVersion?: number;
  reflection: string;
}

export interface JudgeActionContent {
  schemaVersion?: number;
  reflection: string;
  options: Array<{
    id: string;
    text: string;
  }>;
  correctOptionId: string;
}

export interface FixActionContent {
  schemaVersion?: number;
  reflection: string;
  interviewerQuestion: string;
  flawedAnswer: string;
  evaluationFocus?: string;
}

export interface PredictActionContent {
  schemaVersion?: number;
  reflection: string;
  question: string;
  revealExplanation: string;
}

export interface CompareActionContent {
  schemaVersion?: number;
  reflection: string;
  candidateA: string;
  candidateB: string;
  correctChoice: "A" | "B";
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
