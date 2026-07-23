-- prisma/migrations/20260714135029_add_interview_metadata_and_evidence_type/migration.sql

-- AlterTable
ALTER TABLE "Interview" ADD COLUMN     "metadata" JSONB;
