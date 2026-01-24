// harvesting-system.ts

enum GloveTier {
    BRONZE = 'bronze',
    IRON = 'iron',
    STEEL = 'steel',
    PALLADIUM = 'palladium',
    CORONIUM = 'coronium',
    CORONIUM_SILVER = 'coronium_silver',
    CORONIUM_GOLD = 'coronium_gold',
    CELADON = 'celadon',
    CELADON_SILVER = 'celadon_silver',
    CELADON_GOLD = 'celadon_gold',
    LEGENDARY = 'legendary'
  }
  
  interface GloveConfig {
    tier: GloveTier;
    requiredLevel: number;
    levelBonus: number; // Virtual level bonus (OSRS-style)
  }
  
  interface HarvestableConfig {
    level: number;
    name: string;
    category: 'produce' | 'root';
    xpGained: number;
    respawnTicks: number;
    minResourcesPerSpawn: number;
    maxResourcesPerSpawn: number;
  }
  
  const GLOVE_CONFIGS: Record<GloveTier, GloveConfig> = {
    [GloveTier.BRONZE]: {
      tier: GloveTier.BRONZE,
      requiredLevel: 1,
      levelBonus: 0
    },
    [GloveTier.IRON]: {
      tier: GloveTier.IRON,
      requiredLevel: 10,
      levelBonus: 5
    },
    [GloveTier.STEEL]: {
      tier: GloveTier.STEEL,
      requiredLevel: 20,
      levelBonus: 10
    },
    [GloveTier.PALLADIUM]: {
      tier: GloveTier.PALLADIUM,
      requiredLevel: 30,
      levelBonus: 20
    },
    [GloveTier.CORONIUM]: {
      tier: GloveTier.CORONIUM,
      requiredLevel: 40,
      levelBonus: 30
    },
    [GloveTier.CORONIUM_SILVER]: {
      tier: GloveTier.CORONIUM_SILVER,
      requiredLevel: 40,
      levelBonus: 32
    },
    [GloveTier.CORONIUM_GOLD]: {
      tier: GloveTier.CORONIUM_GOLD,
      requiredLevel: 40,
      levelBonus: 35
    },
    [GloveTier.CELADON]: {
      tier: GloveTier.CELADON,
      requiredLevel: 70,
      levelBonus: 40
    },
    [GloveTier.CELADON_SILVER]: {
      tier: GloveTier.CELADON_SILVER,
      requiredLevel: 70,
      levelBonus: 42
    },
    [GloveTier.CELADON_GOLD]: {
      tier: GloveTier.CELADON_GOLD,
      requiredLevel: 70,
      levelBonus: 45
    },
    [GloveTier.LEGENDARY]: {
      tier: GloveTier.LEGENDARY,
      requiredLevel: 80,
      levelBonus: 50
    }
  };
  
  const HARVESTABLE_CONFIGS: Record<string, HarvestableConfig> = {
    // Roots
    arubaroot: {
      level: 8,
      name: 'Aruba Root',
      category: 'root',
      xpGained: 60,
      respawnTicks: 100,
      minResourcesPerSpawn: 2,
      maxResourcesPerSpawn: 8
    },
    fijiroot: {
      level: 16,
      name: 'Fiji Root',
      category: 'root',
      xpGained: 80,
      respawnTicks: 100,
      minResourcesPerSpawn: 2,
      maxResourcesPerSpawn: 8
    },
    sardinianroot: {
      level: 24,
      name: 'Sardinian Root',
      category: 'root',
      xpGained: 100,
      respawnTicks: 150,
      minResourcesPerSpawn: 2,
      maxResourcesPerSpawn: 7
    },
    mauiroot: {
      level: 32,
      name: 'Maui Root',
      category: 'root',
      xpGained: 120,
      respawnTicks: 150,
      minResourcesPerSpawn: 2,
      maxResourcesPerSpawn: 7
    },
    grenadaroot: {
      level: 40,
      name: 'Grenada Root',
      category: 'root',
      xpGained: 140,
      respawnTicks: 200,
      minResourcesPerSpawn: 2,
      maxResourcesPerSpawn: 6
    },
    tongaroot: {
      level: 48,
      name: 'Tonga Root',
      category: 'root',
      xpGained: 160,
      respawnTicks: 200,
      minResourcesPerSpawn: 2,
      maxResourcesPerSpawn: 6
    },
    naururoot: {
      level: 56,
      name: 'Nauru Root',
      category: 'root',
      xpGained: 180,
      respawnTicks: 250,
      minResourcesPerSpawn: 2,
      maxResourcesPerSpawn: 5
    },
    samoanroot: {
      level: 64,
      name: 'Samoan Root',
      category: 'root',
      xpGained: 200,
      respawnTicks: 250,
      minResourcesPerSpawn: 2,
      maxResourcesPerSpawn: 5
    },
    vanuaroot: {
      level: 72,
      name: 'Vanua Root',
      category: 'root',
      xpGained: 220,
      respawnTicks: 300,
      minResourcesPerSpawn: 2,
      maxResourcesPerSpawn: 4
    },
    marianaroot: {
      level: 80,
      name: 'Mariana Root',
      category: 'root',
      xpGained: 240,
      respawnTicks: 500,
      minResourcesPerSpawn: 2,
      maxResourcesPerSpawn: 3
    },
    
    // Produce
    flax: {
      level: 1,
      name: 'Flax',
      category: 'produce',
      xpGained: 10,
      respawnTicks: 100,
      minResourcesPerSpawn: 10,
      maxResourcesPerSpawn: 30
    },
    potato: {
      level: 1,
      name: 'Potato',
      category: 'produce',
      xpGained: 10,
      respawnTicks: 40,
      minResourcesPerSpawn: 1,
      maxResourcesPerSpawn: 2
    },
    wheat: {
      level: 3,
      name: 'Wheat',
      category: 'produce',
      xpGained: 15,
      respawnTicks: 60,
      minResourcesPerSpawn: 1,
      maxResourcesPerSpawn: 1
    },
    carrot: {
      level: 5,
      name: 'Carrot',
      category: 'produce',
      xpGained: 20,
      respawnTicks: 100,
      minResourcesPerSpawn: 1,
      maxResourcesPerSpawn: 1
    },
    corn: {
      level: 6,
      name: 'Corn',
      category: 'produce',
      xpGained: 25,
      respawnTicks: 80,
      minResourcesPerSpawn: 1,
      maxResourcesPerSpawn: 3
    },
    onion: {
      level: 20,
      name: 'Onion',
      category: 'produce',
      xpGained: 60,
      respawnTicks: 80,
      minResourcesPerSpawn: 1,
      maxResourcesPerSpawn: 3
    },
    redmushroom: {
      level: 26,
      name: 'Red Mushroom',
      category: 'produce',
      xpGained: 80,
      respawnTicks: 100,
      minResourcesPerSpawn: 1,
      maxResourcesPerSpawn: 1
    },
    strawberry: {
      level: 30,
      name: 'Strawberry',
      category: 'produce',
      xpGained: 80,
      respawnTicks: 100,
      minResourcesPerSpawn: 1,
      maxResourcesPerSpawn: 3
    },
    watermelon: {
      level: 40,
      name: 'Watermelon',
      category: 'produce',
      xpGained: 110,
      respawnTicks: 120,
      minResourcesPerSpawn: 1,
      maxResourcesPerSpawn: 1
    },
    pumpkin: {
      level: 50,
      name: 'Pumpkin',
      category: 'produce',
      xpGained: 150,
      respawnTicks: 150,
      minResourcesPerSpawn: 1,
      maxResourcesPerSpawn: 1
    },
    grapes: {
      level: 65,
      name: 'Grapes',
      category: 'produce',
      xpGained: 180,
      respawnTicks: 160,
      minResourcesPerSpawn: 1,
      maxResourcesPerSpawn: 1
    }
  };
  
  class HarvestingSystem {
    private static readonly BASE_PROBABILITY = 0.045;  
  private static readonly PROBABILITY_SCALE = 2400;   
  private static readonly MIN_PROBABILITY = 0.01;
  private static readonly MAX_PROBABILITY = 0.35;
  

   // Difficulty scaling - higher level requirements reduce base success rate
   private static readonly DIFFICULTY_FACTOR = 0.0008; // 0.08% penalty per required level

    /**
     * Calculate per-tick harvest probability
     */
    static calculateHarvestProbability(
        playerLevel: number,
        gloveTier: GloveTier,
        harvestable: HarvestableConfig
      ): number {
        const gloveConfig = GLOVE_CONFIGS[gloveTier];
        const effectiveLevel = playerLevel + gloveConfig.levelBonus;
        
        // Apply difficulty penalty based on resource level requirement
        const difficultyPenalty = harvestable.level * this.DIFFICULTY_FACTOR;
        
        // Calculate probability with difficulty
        const rawProbability = 
          this.BASE_PROBABILITY - 
          difficultyPenalty + 
          (effectiveLevel / this.PROBABILITY_SCALE);
        
        return Math.max(
          this.MIN_PROBABILITY,
          Math.min(this.MAX_PROBABILITY, rawProbability)
        );
      }
  
    /**
     * Calculate resources per hour (ASSUMING RESOURCE IS ALWAYS AVAILABLE)
     * This is the pure harvesting speed without respawn timers
     */
    static calculateResourcesPerHour(
      playerLevel: number,
      gloveTier: GloveTier,
      harvestable: HarvestableConfig,
      tickDuration: number = 0.6
    ): number {
      const probability = this.calculateHarvestProbability(
        playerLevel,
        gloveTier,
        harvestable
      );
      
      // Expected ticks per resource (geometric distribution)
      const expectedTicksPerResource = 1 / probability;
      
      // Calculate resources per hour (no respawn considered)
      const ticksPerHour = 3600 / tickDuration;
      const resourcesPerHour = ticksPerHour / expectedTicksPerResource;
      
      return resourcesPerHour;
    }
  
    /**
     * Calculate expected XP per hour (assuming always harvesting)
     */
    static calculateXpPerHour(
      playerLevel: number,
      gloveTier: GloveTier,
      harvestable: HarvestableConfig
    ): number {
      const resourcesPerHour = this.calculateResourcesPerHour(
        playerLevel,
        gloveTier,
        harvestable
      );
      return resourcesPerHour * harvestable.xpGained;
    }
  
    /**
     * Get detailed statistics
     */
    static getDetailedStats(
      playerLevel: number,
      gloveTier: GloveTier,
      harvestable: HarvestableConfig
    ) {
      const gloveConfig = GLOVE_CONFIGS[gloveTier];
      const effectiveLevel = playerLevel + gloveConfig.levelBonus;
      const probability = this.calculateHarvestProbability(
        playerLevel,
        gloveTier,
        harvestable
      );
      const resourcesPerHour = this.calculateResourcesPerHour(
        playerLevel,
        gloveTier,
        harvestable
      );
      const xpPerHour = this.calculateXpPerHour(
        playerLevel,
        gloveTier,
        harvestable
      );
      
      const expectedTicksPerResource = 1 / probability;
      
      return {
        playerLevel,
        gloveTier,
        itemName: harvestable.name,
        effectiveLevel,
        harvestProbability: (probability * 100).toFixed(2) + '%',
        ticksPerResource: expectedTicksPerResource.toFixed(1),
        resourcesPerHour: Math.round(resourcesPerHour),
        xpPerHour: Math.round(xpPerHour).toLocaleString(),
        secondsPerResource: (expectedTicksPerResource * 0.6).toFixed(1) + 's'
      };
    }
  
    /**
     * Roll for harvest success on this tick
     */
    static rollForHarvest(
      playerLevel: number,
      gloveTier: GloveTier,
      harvestable: HarvestableConfig
    ): boolean {
      const probability = this.calculateHarvestProbability(
        playerLevel,
        gloveTier,
        harvestable
      );
      return Math.random() < probability;
    }
  }
  
  // Verification
  console.log('=== Aruba Root Verification ===\n');
  const arubaRoot = HARVESTABLE_CONFIGS.arubaroot;
  
  console.log('Level 8, Bronze (Target: ~300 roots/hr):');
  console.log(HarvestingSystem.getDetailedStats(8, GloveTier.BRONZE, arubaRoot));
  
  console.log('\nLevel 70, Celadon (Target: ~600 roots/hr):');
  console.log(HarvestingSystem.getDetailedStats(70, GloveTier.CELADON, arubaRoot));
  
  console.log('\n=== Maui Root Verification ===\n');
  const mauiRoot = HARVESTABLE_CONFIGS.mauiroot;
  
  console.log('Level 70, Celadon (Target: ~375 roots/hr):');
  console.log(HarvestingSystem.getDetailedStats(70, GloveTier.CELADON, mauiRoot));
  
  console.log('\n=== Glove Progression at Level 50, Aruba Root ===\n');
  for (const tier of [
    GloveTier.BRONZE,
    GloveTier.IRON,
    GloveTier.STEEL,
    GloveTier.PALLADIUM,
    GloveTier.CORONIUM,
    GloveTier.CELADON
  ]) {
    const stats = HarvestingSystem.getDetailedStats(50, tier, arubaRoot);
    console.log(`${tier.padEnd(15)} ${stats.resourcesPerHour.toString().padStart(3)} roots/hr | ${stats.harvestProbability}`);
  }
  
  console.log('\n=== Level Progression with Bronze Gloves, Aruba Root ===\n');
  for (const level of [8, 20, 40, 60, 80, 100]) {
    const stats = HarvestingSystem.getDetailedStats(level, GloveTier.BRONZE, arubaRoot);
    console.log(`Level ${level.toString().padStart(3)}: ${stats.resourcesPerHour.toString().padStart(3)} roots/hr | ${stats.xpPerHour.padStart(8)} XP/hr`);
  }
  
  console.log('\n=== All Roots at Level 70, Celadon Gloves ===\n');
  for (const rootKey of Object.keys(HARVESTABLE_CONFIGS)) {
    const root = HARVESTABLE_CONFIGS[rootKey];
    if (root.category !== 'root') continue;
    if (70 < root.level) continue;
    
    const stats = HarvestingSystem.getDetailedStats(70, GloveTier.CELADON, root);
    console.log(`${root.name.padEnd(20)} ${stats.resourcesPerHour.toString().padStart(3)} /hr | ${stats.xpPerHour.padStart(8)} XP/hr`);
  }