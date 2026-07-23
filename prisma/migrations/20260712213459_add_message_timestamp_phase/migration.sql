-- prisma/migrations/20260712213459_add_message_timestamp_phase/migration.sql

-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "elapsedSeconds" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "phase" TEXT;
