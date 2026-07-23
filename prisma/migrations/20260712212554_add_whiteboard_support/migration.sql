-- prisma/migrations/20260712212554_add_whiteboard_support/migration.sql

-- AlterTable
ALTER TABLE "Interview" ADD COLUMN     "whiteboardState" JSONB;

-- AlterTable
ALTER TABLE "InterviewPhaseTemplate" ADD COLUMN     "showWhiteboard" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "InterviewTemplate" ADD COLUMN     "whiteboardPreset" TEXT;
