import type {
  EvidenceItem,
  DimensionScore,
} from "@/features/interview/domain/evaluation/types";

// Database stores flattened evidence with dimension, but canonical model
// has dimension on DimensionScore, not EvidenceItem
type FlattenedEvidenceItem = EvidenceItem & { dimension: string };

export function mapEvidence(
  raw: unknown
): EvidenceItem[] {
  if (!Array.isArray(raw)) {
    return [];
  }

  const flattened = raw as FlattenedEvidenceItem[];

  // Strip dimension from evidence items since dimension belongs to DimensionScore
  return flattened.map(({ dimension, ...item }) => item);
}

export function mapDimensionScores(
  raw: unknown
): DimensionScore[] {
  if (!Array.isArray(raw)) {
    return [];
  }

  return raw as DimensionScore[];
}
