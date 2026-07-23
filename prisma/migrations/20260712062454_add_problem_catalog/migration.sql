-- prisma/migrations/20260712062454_add_problem_catalog/migration.sql

/*
  Warnings:

  - You are about to drop the column `topic` on the `Interview` table. All the data in the column will be lost.
  - Added the required column `problemId` to the `Interview` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ProblemCategory" AS ENUM ('SYSTEM_DESIGN', 'LOW_LEVEL_DESIGN', 'DATABASES', 'BACKEND', 'DISTRIBUTED_SYSTEMS', 'JAVA', 'KAFKA', 'REDIS', 'OPERATING_SYSTEMS', 'NETWORKING');

-- CreateEnum
CREATE TYPE "ExperienceSource" AS ENUM ('LEETCODE', 'ENGINEERBOOGIE', 'GLASSDOOR', 'USER_SUBMISSION');

-- AlterTable
ALTER TABLE "Interview" DROP COLUMN "topic",
ADD COLUMN     "problemId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Problem" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "category" "ProblemCategory" NOT NULL,
    "difficulty" "Difficulty" NOT NULL,
    "interviewCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Problem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Company" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProblemCompany" (
    "problemId" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "frequency" INTEGER,
    "lastSeen" TIMESTAMP(3),

    CONSTRAINT "ProblemCompany_pkey" PRIMARY KEY ("problemId","companyId")
);

-- CreateTable
CREATE TABLE "Tag" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProblemTag" (
    "problemId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,

    CONSTRAINT "ProblemTag_pkey" PRIMARY KEY ("problemId","tagId")
);

-- CreateTable
CREATE TABLE "InterviewExperience" (
    "id" TEXT NOT NULL,
    "problemId" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "role" TEXT,
    "level" TEXT,
    "year" INTEGER,
    "source" "ExperienceSource" NOT NULL,
    "url" TEXT NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InterviewExperience_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Problem_slug_key" ON "Problem"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Company_name_key" ON "Company"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_name_key" ON "Tag"("name");

-- AddForeignKey
ALTER TABLE "Interview" ADD CONSTRAINT "Interview_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "Problem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProblemCompany" ADD CONSTRAINT "ProblemCompany_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "Problem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProblemCompany" ADD CONSTRAINT "ProblemCompany_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProblemTag" ADD CONSTRAINT "ProblemTag_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "Problem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProblemTag" ADD CONSTRAINT "ProblemTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InterviewExperience" ADD CONSTRAINT "InterviewExperience_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "Problem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InterviewExperience" ADD CONSTRAINT "InterviewExperience_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;
