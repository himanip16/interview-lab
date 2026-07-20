// src/features/library/types/transcript.ts
import { Difficulty } from "@prisma/client";

export type ContentBlock =
  | { type: "text"; value: string }
  | {
      type: "highlight";
      status: "strong" | "missed";
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
    };

export type TranscriptMessage = {
  id?: string;
  role: "interviewer" | "candidate" | "takeaway";
  content: ContentBlock[] | string;
  elapsedSeconds?: number;
  timestamp?: string;
};

export type TranscriptMetadata = {
  title: string;
  difficulty: Difficulty;
  duration: number;
  template: string;
  category: string;
  company?: string;
};

export type TranscriptData = {
  metadata: TranscriptMetadata;
  messages: TranscriptMessage[];
};

export type EnhancedTranscript = TranscriptMessage[];