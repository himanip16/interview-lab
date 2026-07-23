-- prisma/migrations/20260719192251_add_whiteboard_description/migration.sql

-- AlterTable
ALTER TABLE "Interview" ADD COLUMN     "whiteboardDescription" TEXT;
