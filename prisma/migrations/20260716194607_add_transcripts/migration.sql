-- prisma/migrations/20260716194607_add_transcripts/migration.sql

-- CreateTable
CREATE TABLE "Transcript" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "difficulty" TEXT NOT NULL,
    "company" TEXT,
    "interviewer" TEXT,
    "candidate" TEXT,
    "duration" INTEGER,
    "summary" TEXT,
    "transcript" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Transcript_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Transcript_slug_key" ON "Transcript"("slug");

-- CreateIndex
CREATE INDEX "Transcript_category_idx" ON "Transcript"("category");
