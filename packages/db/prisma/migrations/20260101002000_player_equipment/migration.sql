-- CreateEnum
CREATE TYPE "EquipmentSlot" AS ENUM ('helmet', 'chest', 'legs', 'boots', 'neck', 'weapon', 'shield', 'back', 'gloves', 'projectile');

-- CreateTable
CREATE TABLE "player_equipment" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "slot" "EquipmentSlot" NOT NULL,
    "itemDefId" INTEGER,
    "amount" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "player_equipment_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "player_equipment_item_pair_check" CHECK ((("itemDefId" IS NULL AND "amount" IS NULL) OR ("itemDefId" IS NOT NULL AND "amount" IS NOT NULL))),
    CONSTRAINT "player_equipment_amount_check" CHECK (("amount" IS NULL OR "amount" >= 1))
);

-- CreateIndex
CREATE UNIQUE INDEX "player_equipment_userId_slot_key" ON "player_equipment"("userId", "slot");

-- CreateIndex
CREATE INDEX "player_equipment_userId_idx" ON "player_equipment"("userId");

-- CreateIndex
CREATE INDEX "player_equipment_slot_idx" ON "player_equipment"("slot");

-- CreateIndex
CREATE INDEX "player_equipment_updatedAt_idx" ON "player_equipment"("updatedAt");

-- AddForeignKey
ALTER TABLE "player_equipment" ADD CONSTRAINT "player_equipment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
