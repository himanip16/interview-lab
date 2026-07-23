-- prisma/migrations/20260713125116_add_problem_metadata/migration.sql

-- AlterTable
ALTER TABLE "Problem" ADD COLUMN     "cruxOfProblem" TEXT,
ADD COLUMN     "estimatedMinutes" INTEGER,
ADD COLUMN     "interviewType" TEXT;
