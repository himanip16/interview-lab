-- CreateEnum
CREATE TYPE "BugAttemptStatus" AS ENUM ('STARTED', 'INVESTIGATING', 'SUBMITTED', 'COMPLETED', 'ABANDONED');

-- CreateEnum
CREATE TYPE "InvestigationArtifactSource" AS ENUM ('LOG', 'SQL', 'CODE', 'DOC', 'DEPLOYMENT');

-- CreateTable
CREATE TABLE "BugAttempt" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "scenarioId" TEXT NOT NULL,
    "status" "BugAttemptStatus" NOT NULL DEFAULT 'STARTED',
    "score" DOUBLE PRECISION,
    "feedback" TEXT,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "BugAttempt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BugSubmission" (
    "id" TEXT NOT NULL,
    "attemptId" TEXT NOT NULL,
    "rootCause" TEXT NOT NULL,
    "proposedFix" TEXT NOT NULL,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BugSubmission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BugHypothesisAttempt" (
    "id" TEXT NOT NULL,
    "attemptId" TEXT NOT NULL,
    "scenarioId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "hypothesis" TEXT NOT NULL,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BugHypothesisAttempt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Finding" (
    "id" TEXT NOT NULL,
    "attemptId" TEXT NOT NULL,
    "source" "InvestigationArtifactSource" NOT NULL,
    "refId" TEXT NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Finding_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "BugAttempt_userId_completedAt_idx" ON "BugAttempt"("userId", "completedAt");

-- CreateIndex
CREATE INDEX "BugAttempt_userId_scenarioId_idx" ON "BugAttempt"("userId", "scenarioId");

-- CreateIndex
CREATE UNIQUE INDEX "BugSubmission_attemptId_key" ON "BugSubmission"("attemptId");

-- CreateIndex
CREATE INDEX "BugHypothesisAttempt_scenarioId_userId_idx" ON "BugHypothesisAttempt"("scenarioId", "userId");

-- CreateIndex
CREATE INDEX "BugHypothesisAttempt_attemptId_idx" ON "BugHypothesisAttempt"("attemptId");

-- CreateIndex
CREATE INDEX "Finding_attemptId_idx" ON "Finding"("attemptId");

-- AddForeignKey
ALTER TABLE "BugAttempt" ADD CONSTRAINT "BugAttempt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BugSubmission" ADD CONSTRAINT "BugSubmission_attemptId_fkey" FOREIGN KEY ("attemptId") REFERENCES "BugAttempt"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BugHypothesisAttempt" ADD CONSTRAINT "BugHypothesisAttempt_attemptId_fkey" FOREIGN KEY ("attemptId") REFERENCES "BugAttempt"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BugHypothesisAttempt" ADD CONSTRAINT "BugHypothesisAttempt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Finding" ADD CONSTRAINT "Finding_attemptId_fkey" FOREIGN KEY ("attemptId") REFERENCES "BugAttempt"("id") ON DELETE CASCADE ON UPDATE CASCADE;
