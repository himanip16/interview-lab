-- prisma/migrations/20260713103252_add_phase_started_at/migration.sql

-- AlterTable
ALTER TABLE "Interview" ADD COLUMN     "phaseStartedAt" TIMESTAMP(3);
