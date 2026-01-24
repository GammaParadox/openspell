/**
 * MiningSystem.ts - Tick-based mining processor
 *
 * Processes active mining sessions every tick, mirroring WoodcuttingSystem.
 */

import type { MiningService } from "../services/MiningService";

export interface MiningSystemConfig {
  miningService: MiningService;
  getCurrentTick: () => number;
}

/**
 * System that processes mining attempts every tick.
 */
export class MiningSystem {
  constructor(private readonly config: MiningSystemConfig) {}

  /**
   * Called every server tick to process active mining sessions.
   */
  update(): void {
    const currentTick = this.config.getCurrentTick();
    this.config.miningService.processTick(currentTick);
  }
}
