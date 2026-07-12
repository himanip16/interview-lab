-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "elapsedSeconds" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "phase" TEXT;
