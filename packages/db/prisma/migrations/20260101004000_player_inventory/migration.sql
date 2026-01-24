-- CreateTable
CREATE TABLE "player_inventory" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "slot" INTEGER NOT NULL,
    "itemId" INTEGER NOT NULL,
    "amount" INTEGER NOT NULL,
    "isIOU" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "player_inventory_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "player_inventory_slot_check" CHECK ("slot" >= 0 AND "slot" <= 27),
    CONSTRAINT "player_inventory_amount_check" CHECK ("amount" >= 1),
    CONSTRAINT "player_inventory_isIOU_check" CHECK ("isIOU" IN (0, 1))
);

-- CreateIndex
CREATE UNIQUE INDEX "player_inventory_userId_slot_key" ON "player_inventory"("userId", "slot");

-- CreateIndex
CREATE INDEX "player_inventory_userId_idx" ON "player_inventory"("userId");

-- CreateIndex
CREATE INDEX "player_inventory_userId_slot_idx" ON "player_inventory"("userId", "slot");

-- CreateIndex
CREATE INDEX "player_inventory_updatedAt_idx" ON "player_inventory"("updatedAt");

-- AddForeignKey
ALTER TABLE "player_inventory" ADD CONSTRAINT "player_inventory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
