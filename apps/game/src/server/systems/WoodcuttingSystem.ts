/**
 * WoodcuttingSystem.ts - Tick-based woodcutting processor
 * 
 * This system processes active woodcutting sessions every tick instead of
 * creating thousands of 1-tick delays. Much more efficient than the old
 * delay-based approach.
 * 
 * Architecture:
 * - Initial delay handled by DelaySystem (axe-dependent)
 * - After initial delay, this system takes over
 * - Ticks every tick, checks if session is ready to roll
 * - On failure: nextAttemptTick = currentTick + 1
 * - On success: nextAttemptTick = currentTick + axeConfig.initialDelay
 */

import type { WoodcuttingService } from "../services/WoodcuttingService";

export interface WoodcuttingSystemConfig {
  woodcuttingService: WoodcuttingService;
  getCurrentTick: () => number;
}

/**
 * System that processes woodcutting attempts every tick.
 * Much more efficient than creating 1-tick delays for every failed roll.
 */
export class WoodcuttingSystem {
  constructor(private readonly config: WoodcuttingSystemConfig) {}

  /**
   * Called every server tick to process active woodcutting sessions.
   */
  update(): void {
    const currentTick = this.config.getCurrentTick();
    this.config.woodcuttingService.processTick(currentTick);
  }
}
