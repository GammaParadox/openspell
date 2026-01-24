-- AlterTable
ALTER TABLE "users" ADD COLUMN "lastLoginAt" TIMESTAMP(3);

-- CreateIndex (optional, for performance if querying by lastLoginAt)
CREATE INDEX "users_lastLoginAt_idx" ON "users"("lastLoginAt");
