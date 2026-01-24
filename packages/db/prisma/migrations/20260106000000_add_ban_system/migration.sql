-- Add ban fields to users table
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "bannedUntil" TIMESTAMP(3);
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "banReason" TEXT;

-- Create user_ips table to track IP addresses per user
CREATE TABLE IF NOT EXISTS "user_ips" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "ip" TEXT NOT NULL,
    "firstSeen" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastSeen" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_ips_pkey" PRIMARY KEY ("id")
);

-- Create unique constraint for user_ips (one record per user per unique IP)
CREATE UNIQUE INDEX IF NOT EXISTS "user_ips_userId_ip_key" ON "user_ips"("userId", "ip");

-- Create indexes for user_ips
CREATE INDEX IF NOT EXISTS "user_ips_userId_idx" ON "user_ips"("userId");
CREATE INDEX IF NOT EXISTS "user_ips_ip_idx" ON "user_ips"("ip");
CREATE INDEX IF NOT EXISTS "user_ips_lastSeen_idx" ON "user_ips"("lastSeen");

-- Add foreign key constraint for user_ips
ALTER TABLE "user_ips" ADD CONSTRAINT "user_ips_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Create ip_bans table for IP-based bans
CREATE TABLE IF NOT EXISTS "ip_bans" (
    "id" SERIAL NOT NULL,
    "ip" TEXT NOT NULL,
    "bannedUntil" TIMESTAMP(3),
    "banReason" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ip_bans_pkey" PRIMARY KEY ("id")
);

-- Create unique constraint for ip_bans
CREATE UNIQUE INDEX IF NOT EXISTS "ip_bans_ip_key" ON "ip_bans"("ip");

-- Create indexes for ip_bans
CREATE INDEX IF NOT EXISTS "ip_bans_ip_idx" ON "ip_bans"("ip");
CREATE INDEX IF NOT EXISTS "ip_bans_bannedUntil_idx" ON "ip_bans"("bannedUntil");
