import { Entity } from "./Entity";

export class Player extends Entity {
  constructor(
    id: number,
    public username: string
  ) {
    super(id);
  }

  update(_tick: number): void {
    // tick-based updates for movement, regen, etc will go here.
  }
}

