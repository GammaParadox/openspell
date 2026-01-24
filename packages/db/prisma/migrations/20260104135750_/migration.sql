-- AlterTable
ALTER TABLE "player_abilities" ALTER COLUMN "values" DROP DEFAULT,
ALTER COLUMN "values" SET DATA TYPE JSONB;

-- AlterTable
ALTER TABLE "player_settings" ALTER COLUMN "data" DROP DEFAULT,
ALTER COLUMN "data" SET DATA TYPE JSONB;
