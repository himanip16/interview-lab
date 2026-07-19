/*
  Warnings:

  - You are about to drop the column `userId` on the `BugHypothesisAttempt` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "BugHypothesisAttempt" DROP CONSTRAINT "BugHypothesisAttempt_userId_fkey";

-- DropIndex
DROP INDEX "BugHypothesisAttempt_scenarioId_userId_idx";

-- AlterTable
ALTER TABLE "BugHypothesisAttempt" DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "Interview" ADD COLUMN     "summaryVersion" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "WhiteboardSystem" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WhiteboardSystem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WhiteboardNode" (
    "id" TEXT NOT NULL,
    "systemId" TEXT NOT NULL,
    "nodeKey" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "deepDive" TEXT NOT NULL,
    "failureModes" TEXT NOT NULL,
    "tradeoffs" TEXT NOT NULL,

    CONSTRAINT "WhiteboardNode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WhiteboardEdge" (
    "id" TEXT NOT NULL,
    "systemId" TEXT NOT NULL,
    "fromNodeKey" TEXT NOT NULL,
    "toNodeKey" TEXT NOT NULL,

    CONSTRAINT "WhiteboardEdge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WhiteboardLayout" (
    "id" TEXT NOT NULL,
    "systemId" TEXT NOT NULL,
    "layoutName" TEXT NOT NULL,
    "nodeKey" TEXT NOT NULL,
    "gridX" INTEGER NOT NULL,
    "gridY" INTEGER NOT NULL,

    CONSTRAINT "WhiteboardLayout_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WhiteboardSystem_slug_key" ON "WhiteboardSystem"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "WhiteboardNode_systemId_nodeKey_key" ON "WhiteboardNode"("systemId", "nodeKey");

-- CreateIndex
CREATE UNIQUE INDEX "WhiteboardLayout_systemId_layoutName_nodeKey_key" ON "WhiteboardLayout"("systemId", "layoutName", "nodeKey");

-- CreateIndex
CREATE INDEX "BugHypothesisAttempt_scenarioId_idx" ON "BugHypothesisAttempt"("scenarioId");

-- AddForeignKey
ALTER TABLE "WhiteboardNode" ADD CONSTRAINT "WhiteboardNode_systemId_fkey" FOREIGN KEY ("systemId") REFERENCES "WhiteboardSystem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WhiteboardEdge" ADD CONSTRAINT "WhiteboardEdge_systemId_fkey" FOREIGN KEY ("systemId") REFERENCES "WhiteboardSystem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WhiteboardLayout" ADD CONSTRAINT "WhiteboardLayout_systemId_fkey" FOREIGN KEY ("systemId") REFERENCES "WhiteboardSystem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
