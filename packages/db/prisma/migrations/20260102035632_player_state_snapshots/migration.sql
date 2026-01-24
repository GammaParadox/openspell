-- AlterTable
ALTER TABLE "player_state_snapshots" ALTER COLUMN "state" SET DATA TYPE JSONB;

-- AlterTable
ALTER TABLE "skills" ADD COLUMN     "clientReference" INTEGER;

-- CreateIndex
CREATE INDEX "player_locations_userId_idx" ON "player_locations"("userId");
