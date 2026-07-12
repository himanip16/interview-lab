/*
  Warnings:

  - Added the required column `topic` to the `Interview` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Interview_createdAt_idx";

-- DropIndex
DROP INDEX "Interview_status_idx";

-- AlterTable
ALTER TABLE "Interview" ADD COLUMN     "topic" TEXT NOT NULL;
