// fishing-system.ts

enum RodTier {
    BASIC = 'basic',
    GREAT = 'great',
    ULTRA = 'ultra',
    MASTER = 'master'
  }
  
  interface RodConfig {
    tier: RodTier;
    requiredLevel: number;
    castDelay: number; // Ticks between attempts (1-4 range)
  }
  
  interface FishConfig {
    level: number;
    name: string;
    fishingSpot: string;
    rodRequired: RodTier;
    xpGained: number;
    probability: number; // Base catch probability from table
  }
  
  // All rods have similar cast times (1-4 ticks)
  const ROD_CONFIGS: Record<RodTier, RodConfig> = {
    [RodTier.BASIC]: {
      tier: RodTier.BASIC,
      requiredLevel: 1,
      castDelay: 3 // 1.8 seconds
    },
    [RodTier.GREAT]: {
      tier: RodTier.GREAT,
      requiredLevel: 10,
      castDelay: 3
    },
    [RodTier.ULTRA]: {
      tier: RodTier.ULTRA,
      requiredLevel: 35,
      castDelay: 3
    },
    [RodTier.MASTER]: {
      tier: RodTier.MASTER,
      requiredLevel: 50,
      castDelay: 3
    }
  };
  
  const FISH_CONFIGS: Record<string, FishConfig> = {
    bass: {
      level: 1,
      name: 'Raw Bass',
      fishingSpot: 'Beachside',
      rodRequired: RodTier.BASIC,
      xpGained: 15,
      probability: 1.0
    },
    bluegill: {
      level: 1,
      name: 'Raw Bluegill',
      fishingSpot: 'Lake',
      rodRequired: RodTier.BASIC,
      xpGained: 20,
      probability: 0.98
    },
    salmon: {
      level: 5,
      name: 'Raw Salmon',
      fishingSpot: 'River',
      rodRequired: RodTier.BASIC,
      xpGained: 30,
      probability: 0.95
    },
    carp: {
      level: 10,
      name: 'Raw Carp',
      fishingSpot: 'Lake',
      rodRequired: RodTier.GREAT,
      xpGained: 40,
      probability: 0.94
    },
    stingray: {
      level: 20,
      name: 'Raw Stingray',
      fishingSpot: 'Beachside',
      rodRequired: RodTier.GREAT,
      xpGained: 50,
      probability: 0.925
    },
    piranha: {
      level: 25,
      name: 'Raw Piranha',
      fishingSpot: 'River',
      rodRequired: RodTier.GREAT,
      xpGained: 60,
      probability: 0.92
    },
    walleye: {
      level: 35,
      name: 'Raw Walleye',
      fishingSpot: 'Lake',
      rodRequired: RodTier.ULTRA,
      xpGained: 75,
      probability: 0.89
    },
    crab: {
      level: 40,
      name: 'Raw Crab',
      fishingSpot: 'Beachside',
      rodRequired: RodTier.ULTRA,
      xpGained: 105,
      probability: 0.885
    },
    koi: {
      level: 45,
      name: 'Raw Koi',
      fishingSpot: 'River',
      rodRequired: RodTier.ULTRA,
      xpGained: 110,
      probability: 0.85
    },
    goldenkoi: {
      level: 45,
      name: 'Golden Koi',
      fishingSpot: 'Golden Lake',
      rodRequired: RodTier.ULTRA,
      xpGained: 110,
      probability: 0.85
    },
    tuna: {
      level: 48,
      name: 'Raw Tuna',
      fishingSpot: 'Ocean',
      rodRequired: RodTier.BASIC,
      xpGained: 110,
      probability: 0.85
    },
    frog: {
      level: 50,
      name: 'Raw Frog',
      fishingSpot: 'Lake',
      rodRequired: RodTier.MASTER,
      xpGained: 111,
      probability: 0.75
    },
    marlin: {
      level: 60,
      name: 'Raw Marlin',
      fishingSpot: 'Ocean',
      rodRequired: RodTier.GREAT,
      xpGained: 115,
      probability: 0.675
    },
    turtle: {
      level: 65,
      name: 'Raw Turtle',
      fishingSpot: 'River',
      rodRequired: RodTier.MASTER,
      xpGained: 130,
      probability: 0.6
    },
    clownfish: {
      level: 70,
      name: 'Raw Clownfish',
      fishingSpot: 'Beachside',
      rodRequired: RodTier.MASTER,
      xpGained: 225,
      probability: 0.45
    },
    whaleshark: {
      level: 80,
      name: 'Raw Whaleshark',
      fishingSpot: 'Ocean',
      rodRequired: RodTier.ULTRA,
      xpGained: 150,
      probability: 0.4
    },
    octopus: {
      level: 91,
      name: 'Raw Octopus',
      fishingSpot: 'Ocean',
      rodRequired: RodTier.MASTER,
      xpGained: 175,
      probability: 0.325
    }
  };
  
  class FishingSystem {
  // Minimal level scaling - level doesn't influence much
  private static readonly LEVEL_SCALING_FACTOR = 0.0005; // 0.05% per level
  
  // Scale down the base probabilities significantly
  private static readonly PROBABILITY_SCALE = 20; // Divide all probabilities by 10
  
  // Floor and ceiling
  private static readonly MIN_PROBABILITY = 0.01; // 1% minimum
  private static readonly MAX_PROBABILITY = 0.15; // 15% maximum (prevent too fast)

  /**
   * Calculate catch probability per attempt
   * 
   * Formula: (fish.probability / SCALE) × (1 + level × LEVEL_SCALING_FACTOR)
   * 
   * Level has minimal impact compared to woodcutting
   */
  static calculateCatchProbability(
    playerLevel: number,
    fish: FishConfig
  ): number {
    // Scale down the base probability
    const baseProbability = fish.probability / this.PROBABILITY_SCALE;
    
    // Minimal level bonus (e.g., level 100 = +5% bonus)
    const levelBonus = playerLevel * this.LEVEL_SCALING_FACTOR;
    
    // Apply level scaling
    const rawProbability = baseProbability * (1 + levelBonus);
    
    // Clamp
    return Math.max(
      this.MIN_PROBABILITY,
      Math.min(this.MAX_PROBABILITY, rawProbability)
    );
  }
  
    /**
     * Calculate fish per hour
     */
    static calculateFishPerHour(
      playerLevel: number,
      rod: RodConfig,
      fish: FishConfig,
      tickDuration: number = 0.6
    ): number {
      const probability = this.calculateCatchProbability(playerLevel, fish);
      
      // Expected attempts until success (geometric distribution)
      const expectedAttemptsToSuccess = 1 / probability;
      
      // Total ticks per fish (cast delay + rolling period)
      const totalTicksPerFish = rod.castDelay + expectedAttemptsToSuccess;
      
      // Calculate fish per hour
      const ticksPerHour = 3600 / tickDuration;
      return ticksPerHour / totalTicksPerFish;
    }
  
    /**
     * Calculate XP per hour
     */
    static calculateXpPerHour(
      playerLevel: number,
      rod: RodConfig,
      fish: FishConfig
    ): number {
      const fishPerHour = this.calculateFishPerHour(playerLevel, rod, fish);
      return fishPerHour * fish.xpGained;
    }
  
    /**
     * Get detailed statistics
     */
    static getDetailedStats(
      playerLevel: number,
      rod: RodConfig,
      fish: FishConfig
    ) {
      const probability = this.calculateCatchProbability(playerLevel, fish);
      const fishPerHour = this.calculateFishPerHour(playerLevel, rod, fish);
      const xpPerHour = this.calculateXpPerHour(playerLevel, rod, fish);
      const expectedAttemptsToSuccess = 1 / probability;
      const totalTicksPerFish = rod.castDelay + expectedAttemptsToSuccess;
      
      return {
        playerLevel,
        rodTier: rod.tier,
        fishName: fish.name,
        fishLevel: fish.level,
        baseProbability: fish.probability,
        catchProbability: (probability * 100).toFixed(2) + '%',
        castDelay: rod.castDelay + ' ticks',
        avgAttemptsToSuccess: expectedAttemptsToSuccess.toFixed(1),
        totalTicksPerFish: totalTicksPerFish.toFixed(1) + ' ticks',
        fishPerHour: Math.round(fishPerHour),
        xpPerHour: Math.round(xpPerHour).toLocaleString(),
        secondsPerFish: (totalTicksPerFish * 0.6).toFixed(1) + 's'
      };
    }
  }
  
  // Testing and verification
  console.log('=== Turtle Verification (Target: 100-150 fish/hr, 15-20k XP/hr) ===\n');
  const turtle = FISH_CONFIGS.turtle;
  const masterRod = ROD_CONFIGS[RodTier.MASTER];
  
  for (const level of [65, 70, 80, 90, 100]) {
    const stats = FishingSystem.getDetailedStats(level, masterRod, turtle);
    console.log(`Level ${level}: ${stats.fishPerHour} fish/hr | ${stats.xpPerHour} XP/hr | ${stats.catchProbability}`);
  }
  
  console.log('\n=== Clownfish Verification (Target: 100-150 fish/hr, 30-35k XP/hr) ===\n');
  const clownfish = FISH_CONFIGS.clownfish;
  
  for (const level of [70, 75, 80, 90, 100]) {
    const stats = FishingSystem.getDetailedStats(level, masterRod, clownfish);
    console.log(`Level ${level}: ${stats.fishPerHour} fish/hr | ${stats.xpPerHour} XP/hr | ${stats.catchProbability}`);
  }
  
  console.log('\n=== All Fish at Level 80 ===\n');
  for (const fishKey of Object.keys(FISH_CONFIGS)) {
    const fish = FISH_CONFIGS[fishKey];
    const requiredRod = ROD_CONFIGS[fish.rodRequired];
    
    // Skip if player doesn't meet level requirement
    if (80 < fish.level) continue;
    
    const stats = FishingSystem.getDetailedStats(80, requiredRod, fish);
    console.log(`${fish.name.padEnd(20)} ${stats.fishPerHour.toString().padStart(3)} fish/hr | ${stats.xpPerHour.padStart(8)} XP/hr | ${stats.catchProbability}`);
  }
  
  console.log('\n=== Level Progression with Bass (easiest fish) ===\n');
  const bass = FISH_CONFIGS.bass;
  const basicRod = ROD_CONFIGS[RodTier.BASIC];
  
  for (const level of [1, 20, 40, 60, 80, 100]) {
    const stats = FishingSystem.getDetailedStats(level, basicRod, bass);
    console.log(`Level ${level.toString().padStart(3)}: ${stats.fishPerHour.toString().padStart(3)} fish/hr | ${stats.xpPerHour.padStart(7)} XP/hr | ${stats.catchProbability}`);
  }
  
  console.log('\n=== Level Progression with Octopus (hardest fish) ===\n');
  const octopus = FISH_CONFIGS.octopus;
  
  for (const level of [91, 95, 100]) {
    const stats = FishingSystem.getDetailedStats(level, masterRod, octopus);
    console.log(`Level ${level}: ${stats.fishPerHour} fish/hr | ${stats.xpPerHour} XP/hr | ${stats.catchProbability}`);
  }