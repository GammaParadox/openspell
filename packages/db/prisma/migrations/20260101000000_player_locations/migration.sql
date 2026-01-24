-- CreateTable
CREATE TABLE "player_locations" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "mapLevel" INTEGER NOT NULL,
    "x" INTEGER NOT NULL,
    "y" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "player_locations_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "player_locations_mapLevel_check" CHECK ("mapLevel" IN (0, 1, 2)),
    CONSTRAINT "player_locations_x_check" CHECK ("x" BETWEEN -1000 AND 1000),
    CONSTRAINT "player_locations_y_check" CHECK ("y" BETWEEN -1000 AND 1000)
);

-- CreateIndex
CREATE UNIQUE INDEX "player_locations_userId_key" ON "player_locations"("userId");

-- CreateIndex
CREATE INDEX "player_locations_updatedAt_idx" ON "player_locations"("updatedAt");

-- AddForeignKey
ALTER TABLE "player_locations" ADD CONSTRAINT "player_locations_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
