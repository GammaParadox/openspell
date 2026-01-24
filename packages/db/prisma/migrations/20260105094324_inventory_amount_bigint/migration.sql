-- AlterTable: Change amount from INTEGER to BIGINT
-- First drop the check constraint that references the column
ALTER TABLE "player_inventory" DROP CONSTRAINT IF EXISTS "player_inventory_amount_check";

-- Alter the column type from INTEGER to BIGINT
ALTER TABLE "player_inventory" ALTER COLUMN "amount" TYPE BIGINT;

-- Re-add the check constraint
ALTER TABLE "player_inventory" ADD CONSTRAINT "player_inventory_amount_check" CHECK ("amount" >= 1);
