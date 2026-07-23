-- prisma/migrations/20260712074509_dynamic_interview_lifecycle/migration.sql

-- AlterTable
ALTER TABLE "Interview" ADD COLUMN     "completedAt" TIMESTAMP(3),
ADD COLUMN     "startedAt" TIMESTAMP(3),
ALTER COLUMN "currentPhase" DROP DEFAULT;
