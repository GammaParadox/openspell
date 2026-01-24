/**
 * EntityState.ts - Runtime game state types for entities.
 * 
 * These types represent the full runtime state of game entities (NPCs, items, world entities).
 * They extend SpatialEntity for convenience (entities have spatial properties), but contain
 * additional game logic fields like aggro, respawn timers, etc.
 * 
 * Note: These are separate from SpatialIndexManager's entry types (NPCSpatialEntry, etc.)
 * which are minimal types used only for spatial indexing. Conversion between game state
 * and spatial entries happens at the boundary when needed.
 */

import type { SpatialEntity } from "../../world/SpatialIndex";
import type { MapLevel } from "../../world/Location";
import type { States } from "../../protocol/enums/States";
import type { EntityDefinition, EntityMovementArea } from "../../world/entities/EntityCatalog";
import type { WorldEntityDefinition } from "../../world/entities/WorldEntityCatalog";
import type { Target } from "../../world/targeting/Target";

/**
 * Runtime state for an NPC.
 * Contains full game state including aggro, movement area, etc.
 */
export interface NPCState extends SpatialEntity {
  id: number;
  definitionId: number;
  definition: EntityDefinition;
  mapLevel: MapLevel;
  x: number;
  y: number;
  /** Original spawn position (never changes, used for respawning after death) */
  respawnX: number;
  respawnY: number;
  movementArea: EntityMovementArea;
  conversationId: number | null;
  shopId: number | null;
  hitpointsLevel: number;
  nextWanderAtMs: number;
  currentState: States;
  /** Aggro radius from definition, cached for spatial queries */
  aggroRadius: number;
  /** Current aggro target (player or other entity). Null if not aggro'd. Uses shared Target type. */
  aggroTarget: Target | null;
  /** 
   * When target leaves movement area, we drop aggro and set this flag.
   * Prevents re-aggro until the target fully exits the aggro detection window.
   */
  aggroDroppedTargetId: number | null;
  /** 
   * Combat cooldown in ticks. Decrements each tick until 0, 
   * then the NPC can attack again. 
   */
  combatDelay: number;
}

/**
 * Runtime state for a ground item spawn.
 */
export interface GroundItemState extends SpatialEntity {
  id: number;
  itemId: number;
  isIOU: boolean;
  amount: number;
  respawnTicks: number;
  mapLevel: MapLevel;
  x: number;
  y: number;
  /** Whether the item is currently visible (not picked up). */
  isPresent: boolean;
  /** Tick when the item will respawn (if picked up). */
  respawnAtTick: number | null;
  /** How many ticks until item despawns (0 = never despawns). */
  despawnTicks: number;
  /** Tick when the item will despawn (if despawn timer is set). */
  despawnAtTick: number | null;
  /** UserId of player who can see this item (null = visible to all). */
  visibleToUserId: number | null;
  /** Tick when item becomes visible to all players (null = already visible to all). */
  visibleToAllAtTick: number | null;
}

/**
 * Runtime state for a world entity (environment object like trees, rocks, doors, etc.).
 * World entities are static - they don't move like NPCs.
 * They may have resources that can be depleted and respawn over time.
 */
export interface WorldEntityState extends SpatialEntity {
  id: number;
  definitionId: number;
  definition: WorldEntityDefinition;
  type: string;
  mapLevel: MapLevel;
  x: number;
  y: number;
  /** Size of the entity in tiles (for multi-tile entities like trees) */
  length: number;
  width: number;
  /** Current resource count remaining (for harvestable entities). Null if not harvestable. */
  resourcesRemaining: number | null;
  /** Tick when resources will respawn (if depleted). Null if not depleted or not harvestable. */
  respawnAtTick: number | null;
}

/**
 * Union type of all tracked entity states.
 */
export type TrackedEntityState = NPCState | GroundItemState | WorldEntityState;
