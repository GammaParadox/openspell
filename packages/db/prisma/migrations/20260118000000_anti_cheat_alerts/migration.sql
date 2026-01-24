-- Anti-cheat alerts tables

CREATE TABLE "anomaly_alerts" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "severity" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "evidence" JSONB NOT NULL,
    "detectedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "source" TEXT NOT NULL,
    "serverId" INTEGER,
    "relatedEntityId" INTEGER,
    "dismissed" BOOLEAN NOT NULL DEFAULT false,
    "dismissedBy" INTEGER,
    "dismissedAt" TIMESTAMP(3),
    "discordNotifiedAt" TIMESTAMP(3),
    "emailNotifiedAt" TIMESTAMP(3),
    CONSTRAINT "anomaly_alerts_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "anomaly_alert_actions" (
    "id" SERIAL NOT NULL,
    "alertId" INTEGER NOT NULL,
    "actorUserId" INTEGER NOT NULL,
    "action" TEXT NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "anomaly_alert_actions_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "anti_cheat_threshold_overrides" (
    "key" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "source" TEXT,
    "reason" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "anti_cheat_threshold_overrides_pkey" PRIMARY KEY ("key")
);

CREATE INDEX "anomaly_alerts_userId_dismissed_idx" ON "anomaly_alerts"("userId", "dismissed");
CREATE INDEX "anomaly_alerts_severity_dismissed_idx" ON "anomaly_alerts"("severity", "dismissed");
CREATE INDEX "anomaly_alerts_category_dismissed_idx" ON "anomaly_alerts"("category", "dismissed");
CREATE INDEX "anomaly_alerts_detectedAt_idx" ON "anomaly_alerts"("detectedAt");

CREATE INDEX "anomaly_alert_actions_alertId_idx" ON "anomaly_alert_actions"("alertId");
CREATE INDEX "anomaly_alert_actions_actorUserId_idx" ON "anomaly_alert_actions"("actorUserId");
CREATE INDEX "anomaly_alert_actions_createdAt_idx" ON "anomaly_alert_actions"("createdAt");

ALTER TABLE "anomaly_alerts"
ADD CONSTRAINT "anomaly_alerts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "anomaly_alerts"
ADD CONSTRAINT "anomaly_alerts_dismissedBy_fkey" FOREIGN KEY ("dismissedBy") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "anomaly_alert_actions"
ADD CONSTRAINT "anomaly_alert_actions_alertId_fkey" FOREIGN KEY ("alertId") REFERENCES "anomaly_alerts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "anomaly_alert_actions"
ADD CONSTRAINT "anomaly_alert_actions_actorUserId_fkey" FOREIGN KEY ("actorUserId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
