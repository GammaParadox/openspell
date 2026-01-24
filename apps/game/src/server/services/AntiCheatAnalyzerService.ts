import { getPrisma } from "../../db";

type AnalyzerSeverity = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

type AnalyzerAlert = {
  userId: number;
  severity: AnalyzerSeverity;
  category: string;
  description: string;
  evidence: Record<string, unknown>;
  serverId?: number | null;
};

type AnalyzerConfig = {
  enabled: boolean;
  intervalMs: number;
  dedupeWindowMs: number;
  packetSpikeThreshold: number;
  packetSpikeCriticalThreshold: number;
  packetUniqueReasonsThreshold: number;
  dropWindowMinutes: number;
  dropMinCount: number;
  dropNeverPickupRatio: number;
  tradeWindowMinutes: number;
  tradeMinCount: number;
  wealthWindowMinutes: number;
  wealthAmountThreshold: number;
  shopWindowMinutes: number;
  shopMinCount: number;
  shopGoldThreshold: number;
  ipSharedWindowMinutes: number;
  ipSharedMinUsers: number;
  overrideRefreshMs: number;
};

function parseNumber(value: string | undefined, fallback: number): number {
  if (!value) return fallback;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function parseBoolean(value: string | undefined, fallback: boolean): boolean {
  if (value === undefined) return fallback;
  return value.toLowerCase() === "true" || value === "1";
}

export class AntiCheatAnalyzerService {
  private readonly config: AnalyzerConfig;
  private readonly overrides = new Map<string, number>();
  private timer: NodeJS.Timeout | null = null;
  private overrideTimer: NodeJS.Timeout | null = null;

  constructor(private readonly serverId: number | null, private readonly dbEnabled: boolean) {
    this.config = {
      enabled: parseBoolean(process.env.ANTI_CHEAT_ANALYZER_ENABLED, true),
      intervalMs: parseNumber(process.env.ANTI_CHEAT_ANALYZER_INTERVAL_MS, 5 * 60 * 1000),
      dedupeWindowMs: parseNumber(process.env.ANTI_CHEAT_ANALYZER_DEDUPE_WINDOW_MS, 24 * 60 * 60 * 1000),
      packetSpikeThreshold: parseNumber(process.env.ANTI_CHEAT_PACKET_SPIKE_THRESHOLD, 50),
      packetSpikeCriticalThreshold: parseNumber(process.env.ANTI_CHEAT_PACKET_SPIKE_CRITICAL_THRESHOLD, 200),
      packetUniqueReasonsThreshold: parseNumber(process.env.ANTI_CHEAT_PACKET_UNIQUE_REASONS_THRESHOLD, 5),
      dropWindowMinutes: parseNumber(process.env.ANTI_CHEAT_DROP_WINDOW_MINUTES, 60),
      dropMinCount: parseNumber(process.env.ANTI_CHEAT_DROP_MIN_COUNT, 20),
      dropNeverPickupRatio: parseNumber(process.env.ANTI_CHEAT_DROP_NEVER_PICKUP_RATIO, 0.8),
      tradeWindowMinutes: parseNumber(process.env.ANTI_CHEAT_TRADE_WINDOW_MINUTES, 10),
      tradeMinCount: parseNumber(process.env.ANTI_CHEAT_TRADE_MIN_COUNT, 5),
      wealthWindowMinutes: parseNumber(process.env.ANTI_CHEAT_WEALTH_WINDOW_MINUTES, 30),
      wealthAmountThreshold: parseNumber(process.env.ANTI_CHEAT_WEALTH_AMOUNT_THRESHOLD, 1000000),
      shopWindowMinutes: parseNumber(process.env.ANTI_CHEAT_SHOP_WINDOW_MINUTES, 60),
      shopMinCount: parseNumber(process.env.ANTI_CHEAT_SHOP_MIN_COUNT, 10),
      shopGoldThreshold: parseNumber(process.env.ANTI_CHEAT_SHOP_GOLD_THRESHOLD, 100000),
      ipSharedWindowMinutes: parseNumber(process.env.ANTI_CHEAT_IP_SHARED_WINDOW_MINUTES, 60 * 24),
      ipSharedMinUsers: parseNumber(process.env.ANTI_CHEAT_IP_SHARED_MIN_USERS, 3),
      overrideRefreshMs: parseNumber(process.env.ANTI_CHEAT_OVERRIDE_REFRESH_MS, 60_000)
    };
  }

  start(): void {
    if (!this.shouldRun() || this.timer) return;
    this.timer = setInterval(() => void this.runAnalysis(), this.config.intervalMs);
    if (this.dbEnabled) {
      void this.refreshOverrides();
      this.overrideTimer = setInterval(() => void this.refreshOverrides(), this.config.overrideRefreshMs);
    }
  }

  async shutdown(): Promise<void> {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    if (this.overrideTimer) {
      clearInterval(this.overrideTimer);
      this.overrideTimer = null;
    }
  }

  async runAnalysis(): Promise<void> {
    if (!this.shouldRun()) return;
    const alerts: AnalyzerAlert[] = [];

    alerts.push(...(await this.detectPacketAbuse()));
    alerts.push(...(await this.detectPacketExploration()));
    alerts.push(...(await this.detectDropWithoutPickup()));
    alerts.push(...(await this.detectCircularTrades()));
    alerts.push(...(await this.detectWealthSpikes()));
    alerts.push(...(await this.detectShopManipulation()));
    alerts.push(...(await this.detectSharedIpClusters()));

    if (alerts.length === 0) return;
    await this.saveAlerts(alerts);
  }

  private shouldRun(): boolean {
    return this.config.enabled && this.dbEnabled;
  }

  private async detectPacketAbuse(): Promise<AnalyzerAlert[]> {
    const prisma = getPrisma() as any;
    const since = new Date(Date.now() - this.config.intervalMs);
    const packetSpikeThreshold = this.getOverride(
      "ANTI_CHEAT_PACKET_SPIKE_THRESHOLD",
      this.config.packetSpikeThreshold
    );
    const packetSpikeCriticalThreshold = this.getOverride(
      "ANTI_CHEAT_PACKET_SPIKE_CRITICAL_THRESHOLD",
      this.config.packetSpikeCriticalThreshold
    );
    const spikes = await prisma.$queryRaw<
      Array<{ userId: number; count: number; unique_reasons: number }>
    >`
      SELECT
        "userId",
        SUM(count)::int as count,
        COUNT(DISTINCT reason)::int as unique_reasons
      FROM invalid_packet_event_rollups
      WHERE "bucketStart" >= ${since}
        AND "userId" IS NOT NULL
      GROUP BY "userId"
      HAVING SUM(count) > ${packetSpikeThreshold}
    `;

    return spikes.map((spike: { userId: number; count: number; unique_reasons: number }) => ({
      userId: spike.userId,
      severity: spike.count > packetSpikeCriticalThreshold ? "CRITICAL" : "HIGH",
      category: "PACKET_ABUSE",
      description: `${spike.count} invalid packets in last ${Math.round(this.config.intervalMs / 60000)} minutes`,
      evidence: {
        count: spike.count,
        uniqueReasons: spike.unique_reasons,
        windowMinutes: Math.round(this.config.intervalMs / 60000),
        threshold: packetSpikeThreshold
      },
      serverId: this.serverId
    }));
  }

  private async detectPacketExploration(): Promise<AnalyzerAlert[]> {
    const prisma = getPrisma() as any;
    const since = new Date(Date.now() - this.config.intervalMs);
    const uniqueReasonsThreshold = this.getOverride(
      "ANTI_CHEAT_PACKET_UNIQUE_REASONS_THRESHOLD",
      this.config.packetUniqueReasonsThreshold
    );
    const explorers = await prisma.$queryRaw<
      Array<{ userId: number; unique_reasons: number; count: number }>
    >`
      SELECT
        "userId",
        COUNT(DISTINCT reason)::int as unique_reasons,
        SUM(count)::int as count
      FROM invalid_packet_event_rollups
      WHERE "bucketStart" >= ${since}
        AND "userId" IS NOT NULL
      GROUP BY "userId"
      HAVING COUNT(DISTINCT reason) > ${uniqueReasonsThreshold}
    `;

    return explorers.map((explorer: { userId: number; unique_reasons: number; count: number }) => ({
      userId: explorer.userId,
      severity: "MEDIUM",
      category: "PACKET_EXPLORATION",
      description: `Multiple invalid packet reasons (${explorer.unique_reasons}) in last ${Math.round(
        this.config.intervalMs / 60000
      )} minutes`,
      evidence: {
        uniqueReasons: explorer.unique_reasons,
        count: explorer.count,
        threshold: uniqueReasonsThreshold
      },
      serverId: this.serverId
    }));
  }

  private async detectDropWithoutPickup(): Promise<AnalyzerAlert[]> {
    const prisma = getPrisma() as any;
    const since = new Date(Date.now() - this.config.dropWindowMinutes * 60 * 1000);
    const dropMinCount = this.getOverride("ANTI_CHEAT_DROP_MIN_COUNT", this.config.dropMinCount);
    const dropNeverPickupRatio = this.getOverride(
      "ANTI_CHEAT_DROP_NEVER_PICKUP_RATIO",
      this.config.dropNeverPickupRatio
    );
    const results = await prisma.$queryRaw<
      Array<{ dropperUserId: number; itemId: number; totalDropped: number; neverPickedUp: number }>
    >`
      SELECT
        d."dropperUserId",
        d."itemId",
        COUNT(*)::int as "totalDropped",
        COUNT(*) FILTER (WHERE p.id IS NULL)::int as "neverPickedUp"
      FROM item_drop_events d
      LEFT JOIN item_pickup_events p
        ON d."groundItemId" = p."groundItemId"
      WHERE d."droppedAt" >= ${since}
        AND d."groundItemId" IS NOT NULL
      GROUP BY d."dropperUserId", d."itemId"
      HAVING COUNT(*) >= ${dropMinCount}
         AND (COUNT(*) FILTER (WHERE p.id IS NULL)::float / COUNT(*)) >= ${dropNeverPickupRatio}
    `;

    return results.map((drop: { dropperUserId: number; itemId: number; totalDropped: number; neverPickedUp: number }) => ({
      userId: drop.dropperUserId,
      severity: "HIGH",
      category: "ITEM_DELETION",
      description: `Dropped ${drop.totalDropped} items with ${drop.neverPickedUp} never picked up`,
      evidence: {
        itemId: drop.itemId,
        droppedCount: drop.totalDropped,
        neverPickedUpCount: drop.neverPickedUp,
        windowMinutes: this.config.dropWindowMinutes,
        minCount: dropMinCount,
        ratioThreshold: dropNeverPickupRatio
      },
      serverId: this.serverId
    }));
  }

  private async detectCircularTrades(): Promise<AnalyzerAlert[]> {
    const prisma = getPrisma() as any;
    const since = new Date(Date.now() - this.config.tradeWindowMinutes * 60 * 1000);
    const tradeMinCount = this.getOverride("ANTI_CHEAT_TRADE_MIN_COUNT", this.config.tradeMinCount);
    const trades = await prisma.$queryRaw<
      Array<{ userA: number; userB: number; itemId: number; cycles: number }>
    >`
      WITH trade_pairs AS (
        SELECT
          d."dropperUserId" as "userA",
          p."pickerUserId" as "userB",
          d."itemId" as "itemId",
          COUNT(*)::int as exchanges
        FROM item_drop_events d
        JOIN item_pickup_events p ON d."groundItemId" = p."groundItemId"
        WHERE d."droppedAt" >= ${since}
        GROUP BY d."dropperUserId", p."pickerUserId", d."itemId"
        HAVING COUNT(*) >= ${tradeMinCount}
      )
      SELECT
        a."userA",
        a."userB",
        a."itemId",
        LEAST(a.exchanges, b.exchanges)::int as cycles
      FROM trade_pairs a
      JOIN trade_pairs b
        ON a."userA" = b."userB"
       AND a."userB" = b."userA"
       AND a."itemId" = b."itemId"
      WHERE a."userA" < a."userB"
    `;

    return trades.map((trade: { userA: number; userB: number; itemId: number; cycles: number }) => ({
      userId: trade.userA,
      severity: "CRITICAL",
      category: "ITEM_DUPE_SUSPECTED",
      description: `Rapid back-and-forth item transfers (${trade.cycles} cycles)`,
      evidence: {
        accomplice: trade.userB,
        itemId: trade.itemId,
        cycleCount: trade.cycles,
        windowMinutes: this.config.tradeWindowMinutes,
        minCount: tradeMinCount
      },
      serverId: this.serverId
    }));
  }

  private async detectWealthSpikes(): Promise<AnalyzerAlert[]> {
    const prisma = getPrisma() as any;
    const since = new Date(Date.now() - this.config.wealthWindowMinutes * 60 * 1000);
    const wealthAmountThreshold = this.getOverride(
      "ANTI_CHEAT_WEALTH_AMOUNT_THRESHOLD",
      this.config.wealthAmountThreshold
    );
    const spikes = await prisma.$queryRaw<
      Array<{ pickerUserId: number; itemId: number; totalAmount: number; sourceCount: number }>
    >`
      SELECT
        p."pickerUserId",
        p."itemId",
        SUM(p.amount)::bigint::text as "totalAmount",
        COUNT(DISTINCT p."dropperUserId")::int as "sourceCount"
      FROM item_pickup_events p
      WHERE p."pickedUpAt" >= ${since}
      GROUP BY p."pickerUserId", p."itemId"
      HAVING SUM(p.amount) > ${wealthAmountThreshold}
    `;

    return spikes.map((spike: { pickerUserId: number; itemId: number; totalAmount: number; sourceCount: number }) => {
      const amount = Number(spike.totalAmount);
      return {
        userId: spike.pickerUserId,
        severity: spike.sourceCount === 1 ? "CRITICAL" : "HIGH",
        category: "WEALTH_SPIKE",
        description: `Acquired ${amount} of item ${spike.itemId} within ${this.config.wealthWindowMinutes} minutes`,
        evidence: {
          itemId: spike.itemId,
          amount,
          uniqueSources: spike.sourceCount,
          windowMinutes: this.config.wealthWindowMinutes,
          threshold: wealthAmountThreshold
        },
        serverId: this.serverId
      };
    });
  }

  private async detectShopManipulation(): Promise<AnalyzerAlert[]> {
    const prisma = getPrisma() as any;
    const since = new Date(Date.now() - this.config.shopWindowMinutes * 60 * 1000);
    const shopMinCount = this.getOverride("ANTI_CHEAT_SHOP_MIN_COUNT", this.config.shopMinCount);
    const shopGoldThreshold = this.getOverride(
      "ANTI_CHEAT_SHOP_GOLD_THRESHOLD",
      this.config.shopGoldThreshold
    );
    const trades = await prisma.$queryRaw<
      Array<{ sellerUserId: number; buyerUserId: number; totalGold: number; itemCount: number }>
    >`
      SELECT
        "sellerUserId",
        "buyerUserId",
        SUM("totalPrice")::int as "totalGold",
        COUNT(*)::int as "itemCount"
      FROM shop_item_sale_events
      WHERE "soldAt" >= ${since}
      GROUP BY "sellerUserId", "buyerUserId"
      HAVING COUNT(*) >= ${shopMinCount}
         OR SUM("totalPrice") >= ${shopGoldThreshold}
    `;

    return trades.map((trade: { sellerUserId: number; buyerUserId: number; totalGold: number; itemCount: number }) => ({
      userId: trade.sellerUserId,
      severity: "MEDIUM",
      category: "SHOP_ABUSE",
      description: `High-volume shop trades between users ${trade.sellerUserId} and ${trade.buyerUserId}`,
      evidence: {
        otherAccount: trade.buyerUserId,
        goldTransferred: trade.totalGold,
        transactions: trade.itemCount,
          windowMinutes: this.config.shopWindowMinutes,
          minCount: shopMinCount,
          goldThreshold: shopGoldThreshold
      },
      serverId: this.serverId
    }));
  }

  private async detectSharedIpClusters(): Promise<AnalyzerAlert[]> {
    const prisma = getPrisma() as any;
    const since = new Date(Date.now() - this.config.ipSharedWindowMinutes * 60 * 1000);
    const ipSharedMinUsers = this.getOverride(
      "ANTI_CHEAT_IP_SHARED_MIN_USERS",
      this.config.ipSharedMinUsers
    );
    const clusters = await prisma.$queryRaw<
      Array<{ ip: string; userIds: number[] }>
    >`
      SELECT
        ui.ip,
        ARRAY_AGG(DISTINCT ui."userId") as "userIds"
      FROM user_ips ui
      JOIN anomaly_alerts aa ON aa."userId" = ui."userId"
      WHERE aa."detectedAt" >= ${since}
        AND aa.dismissed = false
      GROUP BY ui.ip
      HAVING COUNT(DISTINCT ui."userId") >= ${ipSharedMinUsers}
    `;

    return clusters.flatMap((cluster: { ip: string; userIds: number[] }) =>
      cluster.userIds.map((userId: number) => ({
        userId,
        severity: "MEDIUM",
        category: "SHARED_IP_CLUSTER",
        description: `IP ${cluster.ip} shared by ${cluster.userIds.length} flagged users`,
        evidence: {
          ip: cluster.ip,
          usersOnIp: cluster.userIds,
          windowMinutes: this.config.ipSharedWindowMinutes,
          minUsers: ipSharedMinUsers
        },
        serverId: this.serverId
      }))
    );
  }

  private async saveAlerts(alerts: AnalyzerAlert[]): Promise<void> {
    if (alerts.length === 0) return;
    const prisma = getPrisma() as any;
    const dedupeCutoff = new Date(Date.now() - this.config.dedupeWindowMs);
    const userIds = Array.from(new Set(alerts.map((alert) => alert.userId)));

    const existing = (await prisma.anomalyAlert.findMany({
      where: {
        userId: { in: userIds },
        dismissed: false,
        detectedAt: { gte: dedupeCutoff }
      },
      select: { userId: true, category: true }
    })) as Array<{ userId: number; category: string }>;

    const existingKeys = new Set(existing.map((alert) => `${alert.userId}:${alert.category}`));
    const newAlerts = alerts.filter((alert) => !existingKeys.has(`${alert.userId}:${alert.category}`));

    if (newAlerts.length === 0) return;

    await prisma.anomalyAlert.createMany({
      data: newAlerts.map((alert) => ({
        userId: alert.userId,
        severity: alert.severity,
        category: alert.category,
        description: alert.description,
        evidence: alert.evidence,
        detectedAt: new Date(),
        source: "ANALYZER",
        serverId: alert.serverId ?? null
      }))
    });
  }

  private getOverride(key: string, fallback: number): number {
    return this.overrides.get(key) ?? fallback;
  }

  private async refreshOverrides(): Promise<void> {
    try {
      const prisma = getPrisma() as any;
      const records = await prisma.antiCheatThresholdOverride.findMany();
      this.overrides.clear();
      for (const record of records) {
        if (typeof record.value === "number" && Number.isFinite(record.value)) {
          this.overrides.set(record.key, record.value);
        }
      }
    } catch (error) {
      console.warn("[AntiCheatAnalyzerService] Failed to refresh overrides:", error);
    }
  }
}
