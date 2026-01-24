/**
 * EnvironmentSystem.ts - Handles in-game environment updates.
 * 
 * Manages the in-game clock and broadcasts hour changes to all players.
 */

import { GameAction } from "../../protocol/enums/GameAction";
import { InGameClock } from "../../world/InGameClock";
import { buildInGameHourChangedPayload } from "../../protocol/packets/actions/InGameHourChanged";

type BroadcastCallback = (action: GameAction, payload: unknown[]) => void;

export type EnvironmentSystemConfig = {
  clock: InGameClock;
  tickMs: number;
  onBroadcast: BroadcastCallback;
};

export class EnvironmentSystem {
  private lastTickAtMs: number | null = null;

  constructor(private readonly config: EnvironmentSystemConfig) {}

  /**
   * Updates the environment (in-game clock) and broadcasts hour changes.
   * Should be called once per server tick.
   */
  update(): void {
    const nowMs = Date.now();
    const dtMs =
      this.lastTickAtMs === null
        ? this.config.tickMs
        : Math.max(0, nowMs - this.lastTickAtMs);
    this.lastTickAtMs = nowMs;

    const hourSteps = this.config.clock.advance(dtMs);
    for (const hour of hourSteps) {
      this.config.onBroadcast(
        GameAction.InGameHourChanged,
        buildInGameHourChangedPayload({ CurrentHour: hour })
      );
    }
  }

  /**
   * Resets the internal tick tracking (called when server stops).
   */
  reset(): void {
    this.lastTickAtMs = null;
  }
}
