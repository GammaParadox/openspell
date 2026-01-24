-- CreateTable
CREATE TABLE "player_abilities" (
    "userId" INTEGER NOT NULL,
    "values" JSON NOT NULL DEFAULT '[]',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "player_abilities_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "player_settings" (
    "userId" INTEGER NOT NULL,
    "data" JSON NOT NULL DEFAULT '[]',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "player_settings_pkey" PRIMARY KEY ("userId")
);

-- AddForeignKey
ALTER TABLE "player_abilities" ADD CONSTRAINT "player_abilities_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "player_settings" ADD CONSTRAINT "player_settings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
