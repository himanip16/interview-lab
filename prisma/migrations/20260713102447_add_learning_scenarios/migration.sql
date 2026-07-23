-- prisma/migrations/20260713102447_add_learning_scenarios/migration.sql

-- CreateEnum
CREATE TYPE "LearningAttemptStatus" AS ENUM ('STARTED', 'COMPLETED', 'ABANDONED');

-- CreateEnum
CREATE TYPE "LearningActionType" AS ENUM ('OBSERVE', 'JUDGE', 'FIX', 'PREDICT', 'COMPARE');

-- CreateEnum
CREATE TYPE "PracticeActivityType" AS ENUM ('MOCK_INTERVIEW', 'BUG_HUNT', 'JUDGE', 'FIX', 'PREDICT', 'COMPARE');

-- CreateEnum
CREATE TYPE "PracticeAttemptStatus" AS ENUM ('STARTED', 'COMPLETED', 'ABANDONED');

-- CreateTable
CREATE TABLE "LearningScenario" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "context" JSONB,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LearningScenario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LearningSegment" (
    "id" TEXT NOT NULL,
    "scenarioId" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "conversation" JSONB NOT NULL,
    "takeaway" TEXT,

    CONSTRAINT "LearningSegment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LearningSegmentConcept" (
    "scenarioId" TEXT NOT NULL,
    "segmentId" TEXT NOT NULL,
    "conceptId" TEXT NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL DEFAULT 1.0,

    CONSTRAINT "LearningSegmentConcept_pkey" PRIMARY KEY ("scenarioId","segmentId","conceptId")
);

-- CreateTable
CREATE TABLE "LearningAction" (
    "id" TEXT NOT NULL,
    "segmentId" TEXT NOT NULL,
    "type" "LearningActionType" NOT NULL,
    "title" TEXT NOT NULL,
    "instructions" TEXT,
    "content" JSONB NOT NULL,
    "contentVersion" INTEGER NOT NULL DEFAULT 1,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LearningAction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LearningActionConcept" (
    "actionId" TEXT NOT NULL,
    "conceptId" TEXT NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL DEFAULT 1.0,

    CONSTRAINT "LearningActionConcept_pkey" PRIMARY KEY ("actionId","conceptId")
);

-- CreateTable
CREATE TABLE "UserLearningAttempt" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "actionId" TEXT NOT NULL,
    "status" "LearningAttemptStatus" NOT NULL DEFAULT 'STARTED',
    "response" JSONB,
    "responseVersion" INTEGER NOT NULL DEFAULT 1,
    "score" DOUBLE PRECISION,
    "feedback" TEXT,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "UserLearningAttempt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LearningRecommendation" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "actionId" TEXT NOT NULL,
    "conceptId" TEXT NOT NULL,
    "masteryScore" DOUBLE PRECISION NOT NULL,
    "masteryConfidence" DOUBLE PRECISION NOT NULL,
    "reason" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dismissedAt" TIMESTAMP(3),
    "consumedAt" TIMESTAMP(3),

    CONSTRAINT "LearningRecommendation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PracticeActivity" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "type" "PracticeActivityType" NOT NULL,
    "difficulty" "Difficulty" NOT NULL,
    "estimatedMinutes" INTEGER,
    "content" JSONB NOT NULL,
    "contentVersion" INTEGER NOT NULL DEFAULT 1,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PracticeActivity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PracticeActivityConcept" (
    "activityId" TEXT NOT NULL,
    "conceptId" TEXT NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL DEFAULT 1.0,

    CONSTRAINT "PracticeActivityConcept_pkey" PRIMARY KEY ("activityId","conceptId")
);

-- CreateTable
CREATE TABLE "PracticeAttempt" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "activityId" TEXT NOT NULL,
    "status" "PracticeAttemptStatus" NOT NULL DEFAULT 'STARTED',
    "response" JSONB,
    "responseVersion" INTEGER NOT NULL DEFAULT 1,
    "score" DOUBLE PRECISION,
    "feedback" TEXT,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "PracticeAttempt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PracticeRecommendation" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3),

    CONSTRAINT "PracticeRecommendation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PracticeRecommendationItem" (
    "recommendationId" TEXT NOT NULL,
    "activityId" TEXT NOT NULL,
    "rank" INTEGER NOT NULL,
    "targetConceptId" TEXT,
    "reason" TEXT,

    CONSTRAINT "PracticeRecommendationItem_pkey" PRIMARY KEY ("recommendationId","activityId")
);

-- CreateIndex
CREATE UNIQUE INDEX "LearningScenario_slug_key" ON "LearningScenario"("slug");

-- CreateIndex
CREATE INDEX "LearningSegment_scenarioId_idx" ON "LearningSegment"("scenarioId");

-- CreateIndex
CREATE UNIQUE INDEX "LearningSegment_scenarioId_order_key" ON "LearningSegment"("scenarioId", "order");

-- CreateIndex
CREATE INDEX "LearningSegmentConcept_conceptId_idx" ON "LearningSegmentConcept"("conceptId");

-- CreateIndex
CREATE INDEX "LearningAction_segmentId_idx" ON "LearningAction"("segmentId");

-- CreateIndex
CREATE INDEX "LearningAction_type_isActive_idx" ON "LearningAction"("type", "isActive");

-- CreateIndex
CREATE INDEX "LearningActionConcept_conceptId_idx" ON "LearningActionConcept"("conceptId");

-- CreateIndex
CREATE INDEX "UserLearningAttempt_userId_completedAt_idx" ON "UserLearningAttempt"("userId", "completedAt");

-- CreateIndex
CREATE INDEX "UserLearningAttempt_userId_actionId_idx" ON "UserLearningAttempt"("userId", "actionId");

-- CreateIndex
CREATE INDEX "UserLearningAttempt_actionId_idx" ON "UserLearningAttempt"("actionId");

-- CreateIndex
CREATE INDEX "LearningRecommendation_userId_createdAt_idx" ON "LearningRecommendation"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "LearningRecommendation_userId_consumedAt_idx" ON "LearningRecommendation"("userId", "consumedAt");

-- CreateIndex
CREATE UNIQUE INDEX "PracticeActivity_slug_key" ON "PracticeActivity"("slug");

-- CreateIndex
CREATE INDEX "PracticeActivity_type_isPublished_idx" ON "PracticeActivity"("type", "isPublished");

-- CreateIndex
CREATE INDEX "PracticeActivity_difficulty_isPublished_idx" ON "PracticeActivity"("difficulty", "isPublished");

-- CreateIndex
CREATE INDEX "PracticeActivityConcept_conceptId_idx" ON "PracticeActivityConcept"("conceptId");

-- CreateIndex
CREATE INDEX "PracticeAttempt_userId_completedAt_idx" ON "PracticeAttempt"("userId", "completedAt");

-- CreateIndex
CREATE INDEX "PracticeAttempt_userId_activityId_idx" ON "PracticeAttempt"("userId", "activityId");

-- CreateIndex
CREATE INDEX "PracticeRecommendation_userId_createdAt_idx" ON "PracticeRecommendation"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "PracticeRecommendationItem_activityId_idx" ON "PracticeRecommendationItem"("activityId");

-- CreateIndex
CREATE INDEX "PracticeRecommendationItem_targetConceptId_idx" ON "PracticeRecommendationItem"("targetConceptId");

-- AddForeignKey
ALTER TABLE "LearningSegment" ADD CONSTRAINT "LearningSegment_scenarioId_fkey" FOREIGN KEY ("scenarioId") REFERENCES "LearningScenario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LearningSegmentConcept" ADD CONSTRAINT "LearningSegmentConcept_segmentId_fkey" FOREIGN KEY ("segmentId") REFERENCES "LearningSegment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LearningSegmentConcept" ADD CONSTRAINT "LearningSegmentConcept_conceptId_fkey" FOREIGN KEY ("conceptId") REFERENCES "Concept"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LearningAction" ADD CONSTRAINT "LearningAction_segmentId_fkey" FOREIGN KEY ("segmentId") REFERENCES "LearningSegment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LearningActionConcept" ADD CONSTRAINT "LearningActionConcept_actionId_fkey" FOREIGN KEY ("actionId") REFERENCES "LearningAction"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LearningActionConcept" ADD CONSTRAINT "LearningActionConcept_conceptId_fkey" FOREIGN KEY ("conceptId") REFERENCES "Concept"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserLearningAttempt" ADD CONSTRAINT "UserLearningAttempt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserLearningAttempt" ADD CONSTRAINT "UserLearningAttempt_actionId_fkey" FOREIGN KEY ("actionId") REFERENCES "LearningAction"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LearningRecommendation" ADD CONSTRAINT "LearningRecommendation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LearningRecommendation" ADD CONSTRAINT "LearningRecommendation_actionId_fkey" FOREIGN KEY ("actionId") REFERENCES "LearningAction"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LearningRecommendation" ADD CONSTRAINT "LearningRecommendation_conceptId_fkey" FOREIGN KEY ("conceptId") REFERENCES "Concept"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PracticeActivityConcept" ADD CONSTRAINT "PracticeActivityConcept_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "PracticeActivity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PracticeActivityConcept" ADD CONSTRAINT "PracticeActivityConcept_conceptId_fkey" FOREIGN KEY ("conceptId") REFERENCES "Concept"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PracticeAttempt" ADD CONSTRAINT "PracticeAttempt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PracticeAttempt" ADD CONSTRAINT "PracticeAttempt_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "PracticeActivity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PracticeRecommendation" ADD CONSTRAINT "PracticeRecommendation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PracticeRecommendationItem" ADD CONSTRAINT "PracticeRecommendationItem_recommendationId_fkey" FOREIGN KEY ("recommendationId") REFERENCES "PracticeRecommendation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PracticeRecommendationItem" ADD CONSTRAINT "PracticeRecommendationItem_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "PracticeActivity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PracticeRecommendationItem" ADD CONSTRAINT "PracticeRecommendationItem_targetConceptId_fkey" FOREIGN KEY ("targetConceptId") REFERENCES "Concept"("id") ON DELETE SET NULL ON UPDATE CASCADE;
