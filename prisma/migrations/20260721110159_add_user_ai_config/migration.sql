-- prisma/migrations/20260721110159_add_user_ai_config/migration.sql

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "aiApiKey" TEXT,
ADD COLUMN     "aiBaseUrl" TEXT,
ADD COLUMN     "aiModel" TEXT,
ADD COLUMN     "aiProvider" TEXT;
