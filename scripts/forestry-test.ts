// config/axes.ts
export enum AxeTier {
    BRONZE = 'bronze',
    IRON = 'iron',
    STEEL = 'steel',
    PALLADIUM = 'palladium',
    CORONIUM = 'coronium',
    CELADON = 'celadon'
  }
  
  export interface AxeConfig {
    tier: AxeTier;
    requiredLevel: number;
    initialDelay: number;      // Ticks before first roll
    levelBonus: number;        // Virtual level bonus (OSRS style)
  }
  
  export const AXE_CONFIGS: Record<AxeTier, AxeConfig> = {
    [AxeTier.BRONZE]: {
      tier: AxeTier.BRONZE,
      requiredLevel: 1,
      initialDelay: 17,
      levelBonus: 0
    },
    [AxeTier.IRON]: {
      tier: AxeTier.IRON,
      requiredLevel: 10,
      initialDelay: 15,
      levelBonus: 5
    },
    [AxeTier.STEEL]: {
      tier: AxeTier.STEEL,
      requiredLevel: 20,
      initialDelay: 12,
      levelBonus: 10
    },
    [AxeTier.PALLADIUM]: {
      tier: AxeTier.PALLADIUM,
      requiredLevel: 30,
      initialDelay: 9,
      levelBonus: 20
    },
    [AxeTier.CORONIUM]: {
      tier: AxeTier.CORONIUM,
      requiredLevel: 40,
      initialDelay: 7,
      levelBonus: 30
    },
    [AxeTier.CELADON]: {
      tier: AxeTier.CELADON,
      requiredLevel: 70,
      initialDelay: 5,
      levelBonus: 40
    }
  };
  
  // Tree configurations from your table
  export interface TreeConfig {
    _id: number;
    type: string;
    name: string;
    product: string;
    xpGained: number;
    respawnTicks: number;
    minResourcesPerSpawn: number;
    maxResourcesPerSpawn: number;
    resourceProbability: number;
    requiredLevel: number;
  }
  
  export const TREE_CONFIGS: Record<string, TreeConfig> = {
    normaltree: {
      _id: 3,
      type: "normaltree",
      name: "Normal Tree",
      product: "Logs",
      xpGained: 20,
      respawnTicks: 30,
      minResourcesPerSpawn: 3,
      maxResourcesPerSpawn: 10,
      resourceProbability: 0.825,
      requiredLevel: 1
    },
    pinetree: {
      _id: 4,
      type: "pinetree",
      name: "Pine Tree",
      product: "Pine Logs",
      xpGained: 50,
      respawnTicks: 50,
      minResourcesPerSpawn: 3,
      maxResourcesPerSpawn: 10,
      resourceProbability: 0.750,
      requiredLevel: 10
    },
    oaktree: {
      _id: 5,
      type: "oaktree",
      name: "Oak Tree",
      product: "Oak Logs",
      xpGained: 100,
      respawnTicks: 100,
      minResourcesPerSpawn: 8,
      maxResourcesPerSpawn: 30,
      resourceProbability: 0.725,
      requiredLevel: 20
    },
    palmtree: {
      _id: 6,
      type: "palmtree",
      name: "Palm Tree",
      product: "Palm Logs",
      xpGained: 150,
      respawnTicks: 150,
      minResourcesPerSpawn: 3,
      maxResourcesPerSpawn: 10,
      resourceProbability: 0.600,
      requiredLevel: 35
    },
    cherrytree: {
      _id: 7,
      type: "cherrytree",
      name: "Cherry Blossom",
      product: "Cherry Logs",
      xpGained: 225,
      respawnTicks: 300,
      minResourcesPerSpawn: 10,
      maxResourcesPerSpawn: 60,
      resourceProbability: 0.250,
      requiredLevel: 45
    },
    moneytree: {
      _id: 8,
      type: "moneytree",
      name: "Money Tree",
      product: "Lucky Logs + Coins",
      xpGained: 80,
      respawnTicks: 450,
      minResourcesPerSpawn: 10,
      maxResourcesPerSpawn: 50,
      resourceProbability: 0.125,
      requiredLevel: 60
    },
    wizardtree: {
      _id: 9,
      type: "wizardtree",
      name: "Wizard's Tree",
      product: "Wizard Logs",
      xpGained: 265,
      respawnTicks: 400,
      minResourcesPerSpawn: 10,
      maxResourcesPerSpawn: 60,
      resourceProbability: 0.175,
      requiredLevel: 70
    },
    deadwoodtree: {
      _id: 10,
      type: "deadwoodtree",
      name: "Deadwood Tree",
      product: "Deadwood Logs",
      xpGained: 300,
      respawnTicks: 500,
      minResourcesPerSpawn: 5,
      maxResourcesPerSpawn: 30,
      resourceProbability: 0.100,
      requiredLevel: 85
    }
  };

// systems/woodcutting.ts
export class WoodcuttingSystem {
    // Base probability - everyone starts with at least this much
    private static readonly BASE_PROBABILITY = 0.0228;
    
    // Scaling factor for level contribution
    private static readonly PROBABILITY_SCALE = 1747;
    
    // Floor: minimum probability (prevent impossibly long grinds)
    private static readonly MIN_PROBABILITY = 0.01; // 1%
    
    // Ceiling: maximum probability (prevent guaranteed success)
    private static readonly MAX_PROBABILITY = 0.60; // 60%
  
    /**
     * Calculate per-tick success probability
     * 
     * Formula: base + (tree.resourceProbability × effectiveLevel) / scale
     * Then clamp between MIN and MAX
     * 
     * Where effectiveLevel = playerLevel + axe.levelBonus
     */
    static calculateTickSuccessProbability(
      playerLevel: number,
      axeTier: AxeTier,
      tree: TreeConfig
    ): number {
      const axeConfig = AXE_CONFIGS[axeTier];
      
      // Calculate effective level (OSRS style)
      const effectiveLevel = playerLevel + axeConfig.levelBonus;
      
      // Apply formula with base rate
      const rawProbability = 
        this.BASE_PROBABILITY + 
        (tree.resourceProbability * effectiveLevel) / this.PROBABILITY_SCALE;
      
      // Clamp between floor and ceiling
      return Math.max(
        this.MIN_PROBABILITY,
        Math.min(this.MAX_PROBABILITY, rawProbability)
      );
    }
  
    /**
     * Get initial delay before first roll
     */
    static getInitialDelay(axeTier: AxeTier): number {
      return AXE_CONFIGS[axeTier].initialDelay;
    }
  
    /**
     * Calculate expected logs per hour
     */
    static calculateLogsPerHour(
      playerLevel: number,
      axeTier: AxeTier,
      tree: TreeConfig,
      tickDuration: number = 0.6
    ): number {
      const probability = this.calculateTickSuccessProbability(playerLevel, axeTier, tree);
      const initialDelay = this.getInitialDelay(axeTier);
      
      // Expected ticks until success (geometric distribution)
      const expectedTicksToSuccess = 1 / probability;
      
      // Total ticks per log (delay + rolling period)
      const totalTicksPerLog = initialDelay + expectedTicksToSuccess;
      
      // Calculate logs per hour
      const ticksPerHour = 3600 / tickDuration;
      const logsPerHour = ticksPerHour / totalTicksPerLog;
      
      // Apply the 450 logs/hr cap you mentioned
      return Math.min(logsPerHour, 450);
    }
  
    /**
     * Calculate expected XP per hour
     */
    static calculateXpPerHour(
      playerLevel: number,
      axeTier: AxeTier,
      tree: TreeConfig
    ): number {
      const logsPerHour = this.calculateLogsPerHour(playerLevel, axeTier, tree);
      return logsPerHour * tree.xpGained;
    }
  
    /**
     * Get detailed statistics
     */
    static getDetailedStats(
      playerLevel: number,
      axeTier: AxeTier,
      tree: TreeConfig
    ) {
      const axeConfig = AXE_CONFIGS[axeTier];
      const effectiveLevel = playerLevel + axeConfig.levelBonus;
      const probability = this.calculateTickSuccessProbability(playerLevel, axeTier, tree);
      const logsPerHour = this.calculateLogsPerHour(playerLevel, axeTier, tree);
      const xpPerHour = this.calculateXpPerHour(playerLevel, axeTier, tree);
      const expectedTicksToSuccess = 1 / probability;
      const totalTicksPerLog = axeConfig.initialDelay + expectedTicksToSuccess;
      
      // Show if hitting floor or ceiling
      const rawProb = this.BASE_PROBABILITY + 
                     (tree.resourceProbability * effectiveLevel) / this.PROBABILITY_SCALE;
      let probNote = '';
      if (rawProb < this.MIN_PROBABILITY) probNote = ' (floor)';
      if (rawProb > this.MAX_PROBABILITY) probNote = ' (ceiling)';
      if (logsPerHour >= 450) probNote += ' [logs capped]';
      
      return {
        playerLevel,
        axeTier,
        treeName: tree.name,
        effectiveLevel,
        treeProbability: tree.resourceProbability,
        combinedProbability: (probability * 100).toFixed(2) + '%' + probNote,
        initialDelay: axeConfig.initialDelay + ' ticks',
        avgTicksToSuccess: expectedTicksToSuccess.toFixed(1) + ' ticks',
        totalTicksPerLog: totalTicksPerLog.toFixed(1) + ' ticks',
        logsPerHour: Math.round(logsPerHour),
        xpPerHour: Math.round(xpPerHour).toLocaleString(),
        secondsPerLog: (totalTicksPerLog * 0.6).toFixed(1) + 's'
      };
    }
  
    /**
     * Roll for a log on this tick (call after initial delay)
     */
    static rollForLog(
      playerLevel: number,
      axeTier: AxeTier,
      tree: TreeConfig
    ): boolean {
      const probability = this.calculateTickSuccessProbability(playerLevel, axeTier, tree);
      return Math.random() < probability;
    }
  }
  
  // Comprehensive verification
  console.log('=== Primary Constraints ===\n');
  
  const normalTree = TREE_CONFIGS.normaltree;
  const cherryTree = TREE_CONFIGS.cherrytree;
  
  console.log('Level 1, Bronze, Normal (Target: 100 logs/hr):');
  console.log(WoodcuttingSystem.getDetailedStats(1, AxeTier.BRONZE, normalTree));
  
  console.log('\nLevel 80, Celadon, Cherry (Target: 200 logs/hr, 45k XP/hr):');
  console.log(WoodcuttingSystem.getDetailedStats(80, AxeTier.CELADON, cherryTree));
  
  console.log('\nLevel 100, Bronze, Normal (Target: ≤450 logs/hr):');
  console.log(WoodcuttingSystem.getDetailedStats(100, AxeTier.BRONZE, normalTree));
  
  // Test ceiling behavior
  console.log('\n=== Testing Ceiling (60%) ===\n');
  console.log('Level 100, Celadon, Normal:');
  console.log(WoodcuttingSystem.getDetailedStats(100, AxeTier.CELADON, normalTree));
  
  // Test floor behavior on hard trees
  console.log('\n=== Testing Floor (1%) on Hard Trees ===\n');
  const deadwoodTree = TREE_CONFIGS.deadwoodtree;
  console.log('Level 1, Bronze, Deadwood:');
  console.log(WoodcuttingSystem.getDetailedStats(1, AxeTier.BRONZE, deadwoodTree));
  
  // Show progression across all trees at level 80, Celadon
  console.log('\n=== Level 80, Celadon, All Trees ===\n');
  for (const treeKey of Object.keys(TREE_CONFIGS)) {
    const tree = TREE_CONFIGS[treeKey];
    const stats = WoodcuttingSystem.getDetailedStats(80, AxeTier.CELADON, tree);
    console.log(`${tree.name.padEnd(20)} ${stats.logsPerHour.toString().padStart(3)} logs/hr | ${stats.xpPerHour.padStart(8)} XP/hr | ${stats.combinedProbability}`);
  }
  
  // Show axe progression at level 50 on Normal Tree
  console.log('\n=== Level 50, All Axes, Normal Tree ===\n');
  for (const axeTier of Object.values(AxeTier)) {
    const stats = WoodcuttingSystem.getDetailedStats(50, axeTier as AxeTier, normalTree);
    console.log(`${axeTier.padEnd(10)} ${stats.logsPerHour.toString().padStart(3)} logs/hr | ${stats.combinedProbability.padStart(12)} | ${stats.initialDelay}`);
  }

  // Show axe progression at level 50 on Normal Tree
  console.log('\n=== Level 70, All Axes, Oak Tree ===\n');
  for (const axeTier of Object.values(AxeTier)) {
    const stats = WoodcuttingSystem.getDetailedStats(70, axeTier as AxeTier, TREE_CONFIGS.oaktree);
    console.log(`${axeTier.padEnd(10)} ${stats.logsPerHour.toString().padStart(3)} logs/hr | ${stats.combinedProbability.padStart(12)} | ${stats.initialDelay}`);
  }
  
  // Show level progression with Bronze on Normal Tree
  console.log('\n=== Bronze, Normal Tree, Level Progression ===\n');
  for (const level of [1, 20, 40, 60, 80, 100]) {
    const stats = WoodcuttingSystem.getDetailedStats(level, AxeTier.BRONZE, normalTree);
    console.log(`Level ${level.toString().padStart(3)}: ${stats.logsPerHour.toString().padStart(3)} logs/hr | ${stats.xpPerHour.padStart(7)} XP/hr | ${stats.combinedProbability}`);
  }