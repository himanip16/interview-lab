// src/features/library/types/transcript.ts

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

export type EnhancedTranscript = TranscriptMessage[];
