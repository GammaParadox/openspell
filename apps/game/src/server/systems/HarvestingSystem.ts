/**
 * HarvestingSystem.ts - Tick-based harvesting processor
 *
 * Processes active harvesting sessions every tick, mirroring WoodcuttingSystem.
 */

import type { HarvestingService } from "../services/HarvestingService";

export interface HarvestingSystemConfig {
  harvestingService: HarvestingService;
  getCurrentTick: () => number;
}

/**
 * System that processes harvesting attempts every tick.
 */
export class HarvestingSystem {
  constructor(private readonly config: HarvestingSystemConfig) {}

  /**
   * Called every server tick to process active harvesting sessions.
   */
  update(): void {
    const currentTick = this.config.getCurrentTick();
    this.config.harvestingService.processTick(currentTick);
  }
}
