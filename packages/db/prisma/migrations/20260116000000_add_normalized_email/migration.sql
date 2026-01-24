-- AlterTable: Add normalizedEmail column (nullable initially)
ALTER TABLE "users" ADD COLUMN "normalizedEmail" TEXT;

-- Populate normalizedEmail with normalized version of existing emails
-- This handles Gmail dot removal and lowercasing
UPDATE "users"
SET "normalizedEmail" = CASE
  -- For Gmail/Googlemail, remove dots from local part
  WHEN LOWER("email") LIKE '%@gmail.com' OR LOWER("email") LIKE '%@googlemail.com' THEN
    LOWER(
      REPLACE(SPLIT_PART("email", '@', 1), '.', '') || '@' || SPLIT_PART("email", '@', 2)
    )
  -- For all other emails, just lowercase and remove plus addressing
  ELSE
    LOWER(
      SPLIT_PART("email", '+', 1) || '@' || SPLIT_PART("email", '@', 2)
    )
END
WHERE "normalizedEmail" IS NULL;

-- Make normalizedEmail NOT NULL
ALTER TABLE "users" ALTER COLUMN "normalizedEmail" SET NOT NULL;

-- Add unique constraint
CREATE UNIQUE INDEX "users_normalizedEmail_key" ON "users"("normalizedEmail");
