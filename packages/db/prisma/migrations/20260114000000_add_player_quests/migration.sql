-- CreateTable
CREATE TABLE "player_quests" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "questId" INTEGER NOT NULL,
    "checkpoint" INTEGER NOT NULL DEFAULT 0,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "player_quests_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "player_quests_userId_questId_key" ON "player_quests"("userId", "questId");

-- CreateIndex
CREATE INDEX "player_quests_userId_idx" ON "player_quests"("userId");

-- CreateIndex
CREATE INDEX "player_quests_questId_idx" ON "player_quests"("questId");

-- CreateIndex
CREATE INDEX "player_quests_userId_questId_idx" ON "player_quests"("userId", "questId");

-- AddForeignKey
ALTER TABLE "player_quests" ADD CONSTRAINT "player_quests_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
