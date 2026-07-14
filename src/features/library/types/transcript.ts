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
};

export type TranscriptData = {
  metadata: TranscriptMetadata;
  messages: TranscriptMessage[];
};

export type EnhancedTranscript = TranscriptMessage[];
