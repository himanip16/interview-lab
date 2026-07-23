-- prisma/migrations/20260714054547_new/migration.sql

/*
  Warnings:

  - You are about to drop the column `contentVersion` on the `LearningAction` table. All the data in the column will be lost.
  - You are about to drop the column `contentVersion` on the `PracticeActivity` table. All the data in the column will be lost.
  - You are about to drop the column `responseVersion` on the `PracticeAttempt` table. All the data in the column will be lost.
  - You are about to drop the column `responseVersion` on the `UserLearningAttempt` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "LearningAction" DROP COLUMN "contentVersion";

-- AlterTable
ALTER TABLE "PracticeActivity" DROP COLUMN "contentVersion";

-- AlterTable
ALTER TABLE "PracticeAttempt" DROP COLUMN "responseVersion";

-- AlterTable
ALTER TABLE "UserLearningAttempt" DROP COLUMN "responseVersion";
