/**
 * FishingSystem.ts - Tick-based fishing processor
 *
 * Processes active fishing sessions every tick, mirroring WoodcuttingSystem.
 */

import type { FishingService } from "../services/FishingService";

export interface FishingSystemConfig {
  fishingService: FishingService;
  getCurrentTick: () => number;
}

/**
 * System that processes fishing attempts every tick.
 */
export class FishingSystem {
  constructor(private readonly config: FishingSystemConfig) {}

  /**
   * Called every server tick to process active fishing sessions.
   */
  update(): void {
    const currentTick = this.config.getCurrentTick();
    this.config.fishingService.processTick(currentTick);
  }
}
