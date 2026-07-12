-- AlterTable
ALTER TABLE "Interview" ADD COLUMN     "completedAt" TIMESTAMP(3),
ADD COLUMN     "startedAt" TIMESTAMP(3),
ALTER COLUMN "currentPhase" DROP DEFAULT;
