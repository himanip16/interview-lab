-- CreateEnum
CREATE TYPE "InterviewMode" AS ENUM ('CANDIDATE', 'REVERSE');

-- AlterTable
ALTER TABLE "Interview" ADD COLUMN     "candidatePersona" JSONB,
ADD COLUMN     "mode" "InterviewMode" NOT NULL DEFAULT 'CANDIDATE';

-- AlterTable
ALTER TABLE "InterviewPhaseTemplate" ADD COLUMN     "reverseEvaluationDimensions" JSONB NOT NULL DEFAULT '[]';
