-- prisma/migrations/20260712214944_add_normalized_score_to_evidence_item/migration.sql

-- AlterTable
ALTER TABLE "EvidenceItem" ADD COLUMN     "normalizedScore" DOUBLE PRECISION NOT NULL DEFAULT 0;
