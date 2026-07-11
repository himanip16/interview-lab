/*
  Warnings:

  - You are about to drop the column `score` on the `Evaluation` table. All the data in the column will be lost.
  - Added the required column `architectureScore` to the `Evaluation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `communicationScore` to the `Evaluation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `overallScore` to the `Evaluation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `scalabilityScore` to the `Evaluation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tradeoffScore` to the `Evaluation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Interview` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `type` on the `Interview` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `difficulty` on the `Interview` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "InterviewType" AS ENUM ('HLD', 'LLD');

-- CreateEnum
CREATE TYPE "Difficulty" AS ENUM ('EASY', 'MEDIUM', 'HARD');

-- AlterTable
ALTER TABLE "Evaluation" DROP COLUMN "score",
ADD COLUMN     "architectureScore" INTEGER NOT NULL,
ADD COLUMN     "communicationScore" INTEGER NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "overallScore" INTEGER NOT NULL,
ADD COLUMN     "scalabilityScore" INTEGER NOT NULL,
ADD COLUMN     "tradeoffScore" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Interview" ADD COLUMN     "promptVersion" TEXT NOT NULL DEFAULT 'v1',
DROP COLUMN "type",
ADD COLUMN     "type" "InterviewType" NOT NULL,
DROP COLUMN "difficulty",
ADD COLUMN     "difficulty" "Difficulty" NOT NULL;

-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "metadata" JSONB;

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");


-- CreateIndex
CREATE INDEX "Interview_createdAt_idx" ON "Interview"("createdAt");

-- CreateIndex
CREATE INDEX "Interview_status_idx" ON "Interview"("status");
