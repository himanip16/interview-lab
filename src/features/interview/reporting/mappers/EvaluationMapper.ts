// src/features/interview/reporting/mappers/EvaluationMapper.ts

import type {
  DimensionScore,
  EvidenceItem,
} from "@/features/interview/domain/evaluation/types";
import type { Prisma } from "@prisma/client";

export function mapDimensionScores(
  value: Prisma.JsonValue | null
): DimensionScore[] {
  if (!value) {
    return [];
  }

  return value as unknown as DimensionScore[];
}

export function mapEvidence(
  value: Prisma.JsonValue | null
): EvidenceItem[] {
  if (!value) {
    return [];
  }

  return value as unknown as EvidenceItem[];
}