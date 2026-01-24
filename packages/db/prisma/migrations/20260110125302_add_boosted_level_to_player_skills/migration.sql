-- AlterTable
ALTER TABLE "player_inventory" ALTER COLUMN "amount" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "player_skills" ADD COLUMN     "boostedLevel" INTEGER NOT NULL DEFAULT 1;
