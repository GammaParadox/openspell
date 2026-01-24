export type InGameClockOptions = {
  /** Starting hour (1..24). Defaults to 1. */
  initialHour?: number;
  /** Milliseconds per in-game hour. Defaults to 150_000 (150 seconds). */
  msPerHour?: number;
};

export class InGameClock {
  private hour: number;
  private readonly msPerHour: number;
  private carryMs = 0;

  constructor(opts: InGameClockOptions = {}) {
    const initialHour = opts.initialHour ?? 1;
    if (!Number.isInteger(initialHour) || initialHour < 1 || initialHour > 24) {
      throw new Error("initialHour must be an integer in [1, 24]");
    }
    const msPerHour = opts.msPerHour ?? 150_000;
    if (!Number.isFinite(msPerHour) || msPerHour <= 0) {
      throw new Error("msPerHour must be > 0");
    }

    this.hour = initialHour;
    this.msPerHour = msPerHour;
  }

  /** Current in-game hour (1..24). */
  getCurrentHour(): number {
    return this.hour;
  }

  /**
   * Advance the clock by dtMs and return a list of hour values that were stepped into.
   * If dtMs is large enough to skip multiple hours, the list will include each step in order.
   */
  advance(dtMs: number): number[] {
    if (!Number.isFinite(dtMs) || dtMs <= 0) return [];
    this.carryMs += dtMs;

    const changed: number[] = [];
    while (this.carryMs >= this.msPerHour) {
      this.carryMs -= this.msPerHour;
      this.hour++;
      if (this.hour > 24) this.hour = 1;
      changed.push(this.hour);
    }
    return changed;
  }
}

