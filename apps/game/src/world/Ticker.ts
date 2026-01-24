export type TickHandler = (tick: number) => void | Promise<void>;

export class Ticker {
  private tick = 0;
  private timer: NodeJS.Timeout | null = null;

  constructor(
    private readonly tickMs: number,
    private readonly onTick: TickHandler
  ) {
    if (!Number.isFinite(tickMs) || tickMs <= 0) throw new Error("tickMs must be > 0");
  }

  start() {
    if (this.timer) return;
    this.timer = setInterval(() => {
      void this.onTick(++this.tick);
    }, this.tickMs);
  }

  stop() {
    if (!this.timer) return;
    clearInterval(this.timer);
    this.timer = null;
  }
}

