-- AlterTable: Add playerType column to users table
-- PlayerType values: 0=Default, 1=Admin, 2=Mod, 3=PlayerMod
ALTER TABLE "users" ADD COLUMN "playerType" INTEGER NOT NULL DEFAULT 0;

-- Set existing admin users to playerType 1 (Admin)
UPDATE "users" SET "playerType" = 1 WHERE "isAdmin" = true;

-- Add a CHECK constraint to ensure valid playerType values (0-3)
ALTER TABLE "users" ADD CONSTRAINT "users_playerType_check" CHECK ("playerType" >= 0 AND "playerType" <= 3);
