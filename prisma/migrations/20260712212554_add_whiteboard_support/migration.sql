-- AlterTable
ALTER TABLE "Interview" ADD COLUMN     "whiteboardState" JSONB;

-- AlterTable
ALTER TABLE "InterviewPhaseTemplate" ADD COLUMN     "showWhiteboard" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "InterviewTemplate" ADD COLUMN     "whiteboardPreset" TEXT;
