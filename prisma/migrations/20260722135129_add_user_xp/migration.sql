-- CreateTable
CREATE TABLE "SavedTranscript" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "transcriptId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SavedTranscript_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TodoItem" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TodoItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserXP" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "totalXP" INTEGER NOT NULL DEFAULT 0,
    "level" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserXP_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "XPActivity" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "activityType" TEXT NOT NULL,
    "xpEarned" INTEGER NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "XPActivity_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SavedTranscript_userId_idx" ON "SavedTranscript"("userId");

-- CreateIndex
CREATE INDEX "SavedTranscript_transcriptId_idx" ON "SavedTranscript"("transcriptId");

-- CreateIndex
CREATE UNIQUE INDEX "SavedTranscript_userId_transcriptId_key" ON "SavedTranscript"("userId", "transcriptId");

-- CreateIndex
CREATE INDEX "TodoItem_userId_idx" ON "TodoItem"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UserXP_userId_key" ON "UserXP"("userId");

-- CreateIndex
CREATE INDEX "UserXP_userId_idx" ON "UserXP"("userId");

-- CreateIndex
CREATE INDEX "XPActivity_userId_idx" ON "XPActivity"("userId");

-- CreateIndex
CREATE INDEX "XPActivity_activityType_idx" ON "XPActivity"("activityType");

-- AddForeignKey
ALTER TABLE "SavedTranscript" ADD CONSTRAINT "SavedTranscript_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedTranscript" ADD CONSTRAINT "SavedTranscript_transcriptId_fkey" FOREIGN KEY ("transcriptId") REFERENCES "Transcript"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TodoItem" ADD CONSTRAINT "TodoItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserXP" ADD CONSTRAINT "UserXP_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "XPActivity" ADD CONSTRAINT "XPActivity_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserXP"("id") ON DELETE CASCADE ON UPDATE CASCADE;
