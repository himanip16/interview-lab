// src/features/library/types/transcript.ts
import { Difficulty } from "@prisma/client";

export type ContentBlock =
  | { type: "text"; value: string }
  | {
      type: "highlight";
      status: "strong" | "missed" | "note";
      value: string;
      explanation: string;
      id: string;
    }
  | {
      type: "code";
      value: string;
      language?: string;
      id?: string;
    }
  | {
      type: "whiteboard";
      value: string; // SVG markup rendered as a static diagram/sketch
      caption?: string;
      id?: string;
    }
  | {
      type: "animation";
      value: string; // SVG markup, may include <animate>/<animateTransform> or embedded <style> keyframes
      caption?: string;
      durationSeconds?: number;
      id?: string;
    }
  | {
      type: "concept";
      value: string;
      conceptKey: string;
    };

export type TranscriptMessage = {
  id?: string;
  role: "interviewer" | "candidate" | "takeaway";
  content: ContentBlock[] | string;
  elapsedSeconds?: number;
  timestamp?: string;
  intent?: string;
  eval?: string[];
};

export type TranscriptSection = {
  id: string;
  title: string;
  time: string;
  messages: TranscriptMessage[];
};

export type Concept = {
  name: string;
  sub: string;
  uses: string[];
};

export type ArchitectureNode = {
  label: string;
  color: string;
};

export type TranscriptMetadata = {
  title: string;
  difficulty: Difficulty;
  duration: number;
  template: string;
  category: string;
  company?: string;
  topics?: string[];
  concepts?: Record<string, Concept>;
  architectureSteps?: ArchitectureNode[][];
};

export type TranscriptData = {
  metadata: TranscriptMetadata;
  messages: TranscriptMessage[];
  sections?: TranscriptSection[];
};

export type EnhancedTranscript = TranscriptMessage[];

export type UserProgress = {
  messageId: string;
  sectionId: string;
  pct: number;
};