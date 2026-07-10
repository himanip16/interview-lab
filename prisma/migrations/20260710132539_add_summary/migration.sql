-- AlterTable
ALTER TABLE "Interview" ADD COLUMN     "summary" TEXT NOT NULL DEFAULT 'Interview has not started yet.';

-- CreateTable
CREATE TABLE "Evaluation" (
    "id" TEXT NOT NULL,
    "interviewId" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "feedback" TEXT NOT NULL,
    "metadata" JSONB,

    CONSTRAINT "Evaluation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Evaluation_interviewId_key" ON "Evaluation"("interviewId");

-- CreateIndex
CREATE INDEX "Message_interviewId_idx" ON "Message"("interviewId");

-- AddForeignKey
ALTER TABLE "Evaluation" ADD CONSTRAINT "Evaluation_interviewId_fkey" FOREIGN KEY ("interviewId") REFERENCES "Interview"("id") ON DELETE CASCADE ON UPDATE CASCADE;
