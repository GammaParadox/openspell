import { EntityType } from "../../protocol/enums/EntityType";

/**
 * Represents a target reference that can be used by any entity (NPC, Player, etc.)
 * This is the shared targeting primitive used throughout the game.
 * 
 * The target can be any entity type: Player, NPC, Item, or Environment (world objects).
 */
export interface Target {
  /** The type of entity being targeted */
  type: EntityType;
  /** The unique identifier of the target within its entity type */
  id: number;
}

/**
 * Creates a new target reference.
 */
export function createTarget(type: EntityType, id: number): Target {
  return { type, id };
}

/**
 * Creates a target reference for a player.
 */
export function createPlayerTarget(userId: number): Target {
  return { type: EntityType.Player, id: userId };
}

/**
 * Creates a target reference for an NPC.
 */
export function createNPCTarget(npcId: number): Target {
  return { type: EntityType.NPC, id: npcId };
}

/**
 * Creates a target reference for an item (ground item).
 */
export function createItemTarget(itemId: number): Target {
  return { type: EntityType.Item, id: itemId };
}

/**
 * Creates a target reference for an environment/world entity.
 */
export function createEnvironmentTarget(entityId: number): Target {
  return { type: EntityType.Environment, id: entityId };
}

/**
 * Type guard to check if a value is a valid Target.
 */
export function isTarget(value: unknown): value is Target {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.type === "number" &&
    typeof candidate.id === "number" &&
    Number.isInteger(candidate.type) &&
    Number.isInteger(candidate.id) &&
    candidate.type >= EntityType.Environment &&
    candidate.type <= EntityType.Player
  );
}

/**
 * Checks if two targets reference the same entity.
 */
export function isSameTarget(a: Target | null, b: Target | null): boolean {
  if (a === null && b === null) return true;
  if (a === null || b === null) return false;
  return a.type === b.type && a.id === b.id;
}

/**
 * Serializes a target to a string key for use in maps/sets.
 */
export function targetToKey(target: Target): string {
  return `${target.type}:${target.id}`;
}

/**
 * Deserializes a target from a string key.
 * Returns null if the key is invalid.
 */
export function keyToTarget(key: string): Target | null {
  const [typeStr, idStr] = key.split(":");
  if (!typeStr || !idStr) return null;
  const type = Number(typeStr);
  const id = Number(idStr);
  if (!Number.isInteger(type) || !Number.isInteger(id)) return null;
  if (type < EntityType.Environment || type > EntityType.Player) return null;
  return { type: type as EntityType, id };
}

/**
 * Returns a human-readable description of a target for debugging/logging.
 */
export function describeTarget(target: Target | null): string {
  if (!target) return "none";
  const typeNames: Record<EntityType, string> = {
    [EntityType.Environment]: "Environment",
    [EntityType.Item]: "Item",
    [EntityType.NPC]: "NPC",
    [EntityType.Player]: "Player"
  };
  return `${typeNames[target.type]}(${target.id})`;
}
