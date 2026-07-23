-- prisma/migrations/20260714134339_add_evidence_type/migration.sql

/*
  Warnings:

  - Added the required column `type` to the `EvidenceItem` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "EvidenceType" AS ENUM ('STRENGTH', 'WEAKNESS');

-- AlterTable
ALTER TABLE "EvidenceItem" ADD COLUMN     "type" "EvidenceType" NOT NULL;
