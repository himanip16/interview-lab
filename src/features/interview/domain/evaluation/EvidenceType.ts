export const EvidenceType = {
  STRENGTH: "STRENGTH",
  WEAKNESS: "WEAKNESS",
} as const;

export type EvidenceType =
  typeof EvidenceType[keyof typeof EvidenceType];