-- prisma/migrations/20260719191613_add_evaluation_status/migration.sql

-- CreateEnum
CREATE TYPE "EvaluationStatus" AS ENUM ('PENDING', 'RUNNING', 'COMPLETED', 'FAILED');

-- AlterTable
ALTER TABLE "Evaluation" ADD COLUMN     "status" "EvaluationStatus" NOT NULL DEFAULT 'PENDING';
