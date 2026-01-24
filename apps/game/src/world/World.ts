import { Player } from "./entities/Player";
import { InventorySystem } from "./systems/InventorySystem";

export class World {
  private readonly playersByUserId = new Map<number, Player>();

  public playerCount = 0;

  readonly inventorySystem = new InventorySystem();

  // Back-compat: older code constructed World(tickMs). World is now tick-driven by the server loop.
  constructor(_tickMs?: number) {}

  upsertPlayer(userId: number, username: string): Player {
    const existing = this.playersByUserId.get(userId);
    if (existing) {
      existing.username = username;
      this.playerCount = this.playersByUserId.size;
      return existing;
    }
    const p = new Player(userId, username);
    this.playersByUserId.set(userId, p);
    this.playerCount = this.playersByUserId.size;
    return p;
  }

  removePlayer(userId: number) {
    this.playersByUserId.delete(userId);
    this.playerCount = this.playersByUserId.size;
  }

  public tick(tick: number) {
    this.updateInternal(tick);
  }

  // Back-compat for callers expecting `update`.
  public update(tick: number) {
    this.updateInternal(tick);
  }

  // Internal impl hook for future (systems/pipelines); currently same as update.
  private updateInternal(tick: number) {
    for (const p of this.playersByUserId.values()) {
      p.update(tick);
    }
  }
}

