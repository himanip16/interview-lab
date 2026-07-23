-- prisma/migrations/20260712224820_add_code_state/migration.sql

-- AlterTable
ALTER TABLE "Interview" ADD COLUMN     "codeState" JSONB;
