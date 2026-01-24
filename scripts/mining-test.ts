// mining-system.ts

enum PickaxeTier {
    BRONZE = 'bronze',
    IRON = 'iron',
    STEEL = 'steel',
    PALLADIUM = 'palladium',
    CORONIUM = 'coronium',
    CELADON = 'celadon'
  }
  
  interface PickaxeConfig {
    tier: PickaxeTier;
    requiredLevel: number;
    minimumMineTime: number; // Ticks before first roll
    probabilityBonus: number; // Small bonus to success rate
  }
  
  interface OreConfig {
    level: number;
    name: string;
    xpGained: number;
    respawnTicks: number;
    baseProbability: number; // Base chance per tick after delay
  }
  
  const PICKAXE_CONFIGS: Record<PickaxeTier, PickaxeConfig> = {
    [PickaxeTier.BRONZE]: {
      tier: PickaxeTier.BRONZE,
      requiredLevel: 1,
      minimumMineTime: 9,
      probabilityBonus: 0
    },
    [PickaxeTier.IRON]: {
      tier: PickaxeTier.IRON,
      requiredLevel: 10,
      minimumMineTime: 7,
      probabilityBonus: 0.01 // +1%
    },
    [PickaxeTier.STEEL]: {
      tier: PickaxeTier.STEEL,
      requiredLevel: 20,
      minimumMineTime: 6,
      probabilityBonus: 0.02 // +2%
    },
    [PickaxeTier.PALLADIUM]: {
      tier: PickaxeTier.PALLADIUM,
      requiredLevel: 30,
      minimumMineTime: 5,
      probabilityBonus: 0.03 // +3%
    },
    [PickaxeTier.CORONIUM]: {
      tier: PickaxeTier.CORONIUM,
      requiredLevel: 40,
      minimumMineTime: 4,
      probabilityBonus: 0.04 // +4%
    },
    [PickaxeTier.CELADON]: {
      tier: PickaxeTier.CELADON,
      requiredLevel: 70,
      minimumMineTime: 3,
      probabilityBonus: 0.05 // +5%
    }
  };
  
  const ORE_CONFIGS: Record<string, OreConfig> = {
    copper: {
      level: 1,
      name: 'Copper Ore',
      xpGained: 20,
      respawnTicks: 10,
      baseProbability: 0.15 // Was 0.30, now halved
    },
    tin: {
      level: 1,
      name: 'Tin Ore',
      xpGained: 20,
      respawnTicks: 10,
      baseProbability: 0.15
    },
    iron: {
      level: 20,
      name: 'Iron Ore',
      xpGained: 30,
      respawnTicks: 10,
      baseProbability: 0.12 // Was 0.25
    },
    coal: {
      level: 35,
      name: 'Coal',
      xpGained: 60,
      respawnTicks: 50,
      baseProbability: 0.10 // Was 0.20, now halved
    },
    silver: {
      level: 45,
      name: 'Silver Nugget',
      xpGained: 75,
      respawnTicks: 250,
      baseProbability: 0.04 // Was 0.08
    },
    palladium: {
      level: 56,
      name: 'Palladium Ore',
      xpGained: 150,
      respawnTicks: 350,
      baseProbability: 0.015 // Was 0.04, now much lower for wider range
    },
    gold: {
      level: 72,
      name: 'Gold Nugget',
      xpGained: 150,
      respawnTicks: 500,
      baseProbability: 0.012 // Was 0.03
    },
    coronium: {
      level: 82,
      name: 'Coronium Ore',
      xpGained: 300,
      respawnTicks: 1350,
      baseProbability: 0.008 // Was 0.02
    },
    celadium: {
      level: 101,
      name: 'Celadium Ore',
      xpGained: 600,
      respawnTicks: 3000,
      baseProbability: 0.005 // Was 0.01
    }
  };
  
  class MiningSystem {
    // Minimal level scaling (you said level doesn't matter much)
    private static readonly LEVEL_SCALING_FACTOR = 0.0001; // 0.01% per level
  
    /**
     * Calculate mining success probability per tick (after minimum delay)
     * 
     * Formula: ore.baseProbability + pickaxe.bonus + (level × LEVEL_SCALING)
     */
    static calculateMineProbability(
      playerLevel: number,
      pickaxeTier: PickaxeTier,
      ore: OreConfig
    ): number {
      const pickaxe = PICKAXE_CONFIGS[pickaxeTier];
      
      // Base probability from ore
      let probability = ore.baseProbability;
      
      // Add pickaxe bonus (small improvement)
      probability += pickaxe.probabilityBonus;
      
      // Add minimal level scaling
      probability += playerLevel * this.LEVEL_SCALING_FACTOR;
      
      // Cap between 1% and 50%
      return Math.max(0.01, Math.min(0.50, probability));
    }
  
    /**
     * Calculate expected time to mine one ore (in ticks)
     */
    static calculateTicksPerOre(
      playerLevel: number,
      pickaxeTier: PickaxeTier,
      ore: OreConfig
    ): number {
      const pickaxe = PICKAXE_CONFIGS[pickaxeTier];
      const probability = this.calculateMineProbability(playerLevel, pickaxeTier, ore);
      
      // Minimum delay + expected rolls until success
      const expectedRolls = 1 / probability;
      return pickaxe.minimumMineTime + expectedRolls;
    }
  
    /**
     * Calculate ores per hour (assuming you move between nodes instantly)
     * This is the theoretical max if you're hopping between nodes
     */
    static calculateOresPerHour(
      playerLevel: number,
      pickaxeTier: PickaxeTier,
      ore: OreConfig,
      tickDuration: number = 0.6
    ): number {
      const ticksPerOre = this.calculateTicksPerOre(playerLevel, pickaxeTier, ore);
      const ticksPerHour = 3600 / tickDuration;
      return ticksPerHour / ticksPerOre;
    }
  
    /**
     * Calculate XP per hour
     */
    static calculateXpPerHour(
      playerLevel: number,
      pickaxeTier: PickaxeTier,
      ore: OreConfig
    ): number {
      const oresPerHour = this.calculateOresPerHour(playerLevel, pickaxeTier, ore);
      return oresPerHour * ore.xpGained;
    }
  
    /**
     * Get mining time range (min/max in seconds)
     * Useful for showing the variance in rare ores
     */
    static getMiningTimeRange(
      playerLevel: number,
      pickaxeTier: PickaxeTier,
      ore: OreConfig
    ): { min: number; avg: number; max: number } {
      const pickaxe = PICKAXE_CONFIGS[pickaxeTier];
      const probability = this.calculateMineProbability(playerLevel, pickaxeTier, ore);
      
      // Minimum: Just the delay time (lucky first roll)
      const minTicks = pickaxe.minimumMineTime + 1;
      const minSeconds = minTicks * 0.6;
      
      // Average: delay + geometric mean
      const avgTicks = pickaxe.minimumMineTime + (1 / probability);
      const avgSeconds = avgTicks * 0.6;
      
      // Maximum: Use 95th percentile (5% chance to take this long)
      // For geometric distribution: P(X ≤ k) = 1 - (1-p)^k
      // Solving for 95%: k = ln(0.05) / ln(1-p)
      const percentile95Rolls = Math.log(0.05) / Math.log(1 - probability);
      const maxTicks = pickaxe.minimumMineTime + percentile95Rolls;
      const maxSeconds = maxTicks * 0.6;
      
      return {
        min: minSeconds,
        avg: avgSeconds,
        max: maxSeconds
      };
    }
  
    /**
     * Get detailed statistics
     */
    static getDetailedStats(
      playerLevel: number,
      pickaxeTier: PickaxeTier,
      ore: OreConfig
    ) {
      const pickaxe = PICKAXE_CONFIGS[pickaxeTier];
      const probability = this.calculateMineProbability(playerLevel, pickaxeTier, ore);
      const ticksPerOre = this.calculateTicksPerOre(playerLevel, pickaxeTier, ore);
      const oresPerHour = this.calculateOresPerHour(playerLevel, pickaxeTier, ore);
      const xpPerHour = this.calculateXpPerHour(playerLevel, pickaxeTier, ore);
      const timeRange = this.getMiningTimeRange(playerLevel, pickaxeTier, ore);
      
      return {
        playerLevel,
        pickaxeTier,
        oreName: ore.name,
        minDelay: pickaxe.minimumMineTime + ' ticks',
        mineProbability: (probability * 100).toFixed(2) + '%',
        avgTicksPerOre: ticksPerOre.toFixed(1),
        oresPerHour: Math.round(oresPerHour),
        xpPerHour: Math.round(xpPerHour).toLocaleString(),
        timeRange: `${timeRange.min.toFixed(1)}s - ${timeRange.avg.toFixed(1)}s (avg) - ${timeRange.max.toFixed(1)}s (95%)`
      };
    }
  
    /**
     * Roll for mining success on this tick (call after minimum delay)
     */
    static rollForMine(
      playerLevel: number,
      pickaxeTier: PickaxeTier,
      ore: OreConfig
    ): boolean {
      const probability = this.calculateMineProbability(playerLevel, pickaxeTier, ore);
      return Math.random() < probability;
    }
  }
  
  // Testing
  console.log('=== Coal Verification (Target: ~25k XP/hr with Celadon) ===\n');
  const coal = ORE_CONFIGS.coal;
  
  for (const level of [35, 50, 70, 90]) {
    const stats = MiningSystem.getDetailedStats(level, PickaxeTier.CELADON, coal);
    console.log(`Level ${level}: ${stats.oresPerHour} coal/hr | ${stats.xpPerHour} XP/hr | ${stats.timeRange}`);
  }
  
  console.log('\n=== Palladium Verification (Target: 10-60s range with Celadon) ===\n');
  const palladium = ORE_CONFIGS.palladium;
  
  for (const level of [56, 70, 90]) {
    const stats = MiningSystem.getDetailedStats(level, PickaxeTier.CELADON, palladium);
    console.log(`Level ${level}: ${stats.oresPerHour} ore/hr | ${stats.xpPerHour} XP/hr | Time: ${stats.timeRange}`);
  }
  
  console.log('\n=== Pickaxe Progression at Level 70, Coal ===\n');
  for (const tier of Object.values(PickaxeTier)) {
    const stats = MiningSystem.getDetailedStats(70, tier as PickaxeTier, coal);
    console.log(`${tier.padEnd(10)} ${stats.oresPerHour.toString().padStart(3)} coal/hr | ${stats.xpPerHour.padStart(8)} XP/hr | ${stats.minDelay}`);
  }
  
  console.log('\n=== All Ores at Level 90, Celadon Pickaxe ===\n');
  for (const oreKey of Object.keys(ORE_CONFIGS)) {
    const ore = ORE_CONFIGS[oreKey];
    if (90 < ore.level) continue;
    
    const stats = MiningSystem.getDetailedStats(90, PickaxeTier.CELADON, ore);
    console.log(`${ore.name.padEnd(20)} ${stats.oresPerHour.toString().padStart(3)}/hr | ${stats.xpPerHour.padStart(8)} XP/hr | ${stats.timeRange}`);
  }
  
  console.log('\n=== Level Progression with Bronze Pickaxe, Copper ===\n');
  const copper = ORE_CONFIGS.copper;
  for (const level of [1, 20, 40, 60, 80, 100]) {
    const stats = MiningSystem.getDetailedStats(level, PickaxeTier.BRONZE, copper);
    console.log(`Level ${level.toString().padStart(3)}: ${stats.oresPerHour.toString().padStart(3)} ore/hr | ${stats.xpPerHour.padStart(7)} XP/hr`);
  }