-- CreateEnum
CREATE TYPE "EvaluationStatus" AS ENUM ('PENDING', 'RUNNING', 'COMPLETED', 'FAILED');

-- AlterTable
ALTER TABLE "Evaluation" ADD COLUMN     "status" "EvaluationStatus" NOT NULL DEFAULT 'PENDING';
