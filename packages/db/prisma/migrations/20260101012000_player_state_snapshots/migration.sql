-- CreateTable
CREATE TABLE "player_state_snapshots" (
    "userId" INTEGER NOT NULL,
    "state" JSON NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "player_state_snapshots_pkey" PRIMARY KEY ("userId")
);

-- AddForeignKey
ALTER TABLE "player_state_snapshots" ADD CONSTRAINT "player_state_snapshots_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
