/*
  Warnings:

  - A unique constraint covering the columns `[guestIdentifier]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "ReviewStatus" AS ENUM ('CREATED', 'IN_PROGRESS', 'EVALUATING', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "ReviewDecision" AS ENUM ('APPROVE', 'REQUEST_CHANGES', 'REJECT');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "guestIdentifier" TEXT;

-- CreateTable
CREATE TABLE "ReviewAttempt" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "scenarioId" TEXT NOT NULL,
    "status" "ReviewStatus" NOT NULL DEFAULT 'CREATED',
    "decision" "ReviewDecision",
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "ReviewAttempt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReviewComment" (
    "id" TEXT NOT NULL,
    "attemptId" TEXT NOT NULL,
    "fileId" TEXT NOT NULL,
    "side" TEXT NOT NULL,
    "line" INTEGER NOT NULL,
    "anchorText" TEXT,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReviewComment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReviewReport" (
    "id" TEXT NOT NULL,
    "attemptId" TEXT NOT NULL,
    "overallScore" INTEGER NOT NULL,
    "categoryScores" JSONB NOT NULL,
    "summary" TEXT NOT NULL,
    "strengths" TEXT[],
    "missedFindings" JSONB NOT NULL,
    "recommendations" TEXT[],

    CONSTRAINT "ReviewReport_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ReviewAttempt_userId_scenarioId_idx" ON "ReviewAttempt"("userId", "scenarioId");

-- CreateIndex
CREATE INDEX "ReviewComment_attemptId_idx" ON "ReviewComment"("attemptId");

-- CreateIndex
CREATE UNIQUE INDEX "ReviewReport_attemptId_key" ON "ReviewReport"("attemptId");

-- CreateIndex
CREATE UNIQUE INDEX "User_guestIdentifier_key" ON "User"("guestIdentifier");

-- AddForeignKey
ALTER TABLE "ReviewAttempt" ADD CONSTRAINT "ReviewAttempt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReviewComment" ADD CONSTRAINT "ReviewComment_attemptId_fkey" FOREIGN KEY ("attemptId") REFERENCES "ReviewAttempt"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReviewReport" ADD CONSTRAINT "ReviewReport_attemptId_fkey" FOREIGN KEY ("attemptId") REFERENCES "ReviewAttempt"("id") ON DELETE CASCADE ON UPDATE CASCADE;
