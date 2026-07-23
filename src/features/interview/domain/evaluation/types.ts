// src/features/interview/domain/evaluation/types.ts

import { EvidenceType } from "@prisma/client";

export interface EvidenceItem {
  messageId: string;
  timestampSeconds: number;
  quote: string;
  comment: string;
  conceptSlugs: string[];
  type: EvidenceType;
}

export interface DimensionScore {
  dimension: string;
  score: number;
  summary: string;
  evidence: EvidenceItem[];
}