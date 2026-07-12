-- Reference migration for moving InterviewType (enum) -> InterviewTemplate (data).
--
-- IMPORTANT: generate the real migration with
--   npx prisma migrate dev --name dynamic_interview_templates
-- against your actual dev database once schema.prisma is updated, and diff it
-- against this file. This file exists so the destructive steps (dropping the
-- enum column) are reviewed with the backfill step alongside them, since
-- Prisma will not know how to backfill templateId for you automatically.

-- 1. New tables
CREATE TABLE "InterviewTemplate" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "InterviewTemplate_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "InterviewTemplate_slug_key" ON "InterviewTemplate"("slug");

CREATE TABLE "InterviewPhaseTemplate" (
    "id" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    "phaseKey" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "goals" JSONB NOT NULL,
    "evaluationDimensions" JSONB NOT NULL,
    "targetDurationRatio" DOUBLE PRECISION NOT NULL,
    "transitionThreshold" DOUBLE PRECISION NOT NULL,
    "instructions" TEXT NOT NULL,
    CONSTRAINT "InterviewPhaseTemplate_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "InterviewPhaseTemplate_templateId_phaseKey_key" ON "InterviewPhaseTemplate"("templateId", "phaseKey");
CREATE INDEX "InterviewPhaseTemplate_templateId_idx" ON "InterviewPhaseTemplate"("templateId");
ALTER TABLE "InterviewPhaseTemplate" ADD CONSTRAINT "InterviewPhaseTemplate_templateId_fkey"
    FOREIGN KEY ("templateId") REFERENCES "InterviewTemplate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "RubricTemplate" (
    "id" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    "dimension" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    CONSTRAINT "RubricTemplate_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "RubricTemplate_templateId_dimension_key" ON "RubricTemplate"("templateId", "dimension");
ALTER TABLE "RubricTemplate" ADD CONSTRAINT "RubricTemplate_templateId_fkey"
    FOREIGN KEY ("templateId") REFERENCES "InterviewTemplate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- 2. Seed the two templates that already exist as enum values so existing
--    rows have somewhere to point. (Full phase/rubric content is seeded by
--    prisma/seed.ts — this just creates the parent rows so the backfill in
--    step 3 has a target.)
INSERT INTO "InterviewTemplate" ("id", "slug", "name", "isActive", "updatedAt")
VALUES
    ('tpl_hld_seed', 'hld', 'High Level Design', true, CURRENT_TIMESTAMP),
    ('tpl_lld_seed', 'lld', 'Low Level Design', true, CURRENT_TIMESTAMP);

-- 3. Add the new column, backfill from the old enum column, then drop the old one.
ALTER TABLE "Interview" ADD COLUMN "templateId" TEXT;

UPDATE "Interview" SET "templateId" = 'tpl_hld_seed' WHERE "type" = 'HLD';
UPDATE "Interview" SET "templateId" = 'tpl_lld_seed' WHERE "type" = 'LLD';

ALTER TABLE "Interview" ALTER COLUMN "templateId" SET NOT NULL;
ALTER TABLE "Interview" ADD CONSTRAINT "Interview_templateId_fkey"
    FOREIGN KEY ("templateId") REFERENCES "InterviewTemplate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
CREATE INDEX "Interview_templateId_idx" ON "Interview"("templateId");

ALTER TABLE "Interview" DROP COLUMN "type";
DROP TYPE "InterviewType";

-- 4. Evaluation: replace fixed score columns with dynamic dimensionScores/evidence.
--    If you have evaluations you care about keeping, migrate them into the new
--    JSON shape before dropping the columns instead of running this as-is.
ALTER TABLE "Evaluation" ADD COLUMN "dimensionScores" JSONB;
ALTER TABLE "Evaluation" ADD COLUMN "evidence" JSONB;

UPDATE "Evaluation" SET
    "dimensionScores" = jsonb_build_array(
        jsonb_build_object('dimension', 'communication', 'score', "communicationScore" / 10.0, 'summary', '', 'evidence', '[]'::jsonb),
        jsonb_build_object('dimension', 'architecture', 'score', "architectureScore" / 10.0, 'summary', '', 'evidence', '[]'::jsonb),
        jsonb_build_object('dimension', 'scalability', 'score', "scalabilityScore" / 10.0, 'summary', '', 'evidence', '[]'::jsonb),
        jsonb_build_object('dimension', 'tradeoffs', 'score', "tradeoffScore" / 10.0, 'summary', '', 'evidence', '[]'::jsonb)
    ),
    "evidence" = '[]'::jsonb;

ALTER TABLE "Evaluation" ALTER COLUMN "dimensionScores" SET NOT NULL;
ALTER TABLE "Evaluation" ALTER COLUMN "evidence" SET NOT NULL;

ALTER TABLE "Evaluation" DROP COLUMN "communicationScore";
ALTER TABLE "Evaluation" DROP COLUMN "architectureScore";
ALTER TABLE "Evaluation" DROP COLUMN "scalabilityScore";
ALTER TABLE "Evaluation" DROP COLUMN "tradeoffScore";