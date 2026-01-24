export type EntityId = number;

export abstract class Entity {
  constructor(public readonly id: EntityId) {}

  abstract update(tick: number): void;
}

