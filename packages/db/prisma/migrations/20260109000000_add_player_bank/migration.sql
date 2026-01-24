-- CreateTable
CREATE TABLE "player_banks" (
    "userId" INTEGER NOT NULL,
    "items" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "player_banks_pkey" PRIMARY KEY ("userId")
);

-- AddForeignKey
ALTER TABLE "player_banks" ADD CONSTRAINT "player_banks_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
