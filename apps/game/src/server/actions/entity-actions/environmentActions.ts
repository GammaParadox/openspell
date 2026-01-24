/**
 * Environment (world entity) action handlers.
 * 
 * SIMPLIFIED ARCHITECTURE:
 * 1. handleEnvironmentAction - Entry point: validates action, sets pendingAction, starts pathfinding
 * 2. processPendingEnvironmentActions - Called each tick: handles ALL state (moving, waiting, executing)
 * 3. executeEnvironmentAction - Actual execution: checks override, runs action
 * 
 * Flow:
 * - Player clicks entity → handleEnvironmentAction sets pendingAction
 * - Each tick → processPendingEnvironmentActions checks state and progresses
 * - When ready (in position + wait complete) → executeEnvironmentAction runs
 */

import { Action } from "../../../protocol/enums/Actions";
import { EntityType } from "../../../protocol/enums/EntityType";
import { PlayerSetting } from "../../../protocol/enums/PlayerSetting";
import { MenuType } from "../../../protocol/enums/MenuType";
import type { ActionContext } from "../types";
import type { PlayerState } from "../../../world/PlayerState";
import type { WorldEntityState } from "../../state/EntityState";
import type { EntityRef } from "../../events/GameEvents";
import { createPlayerWentThroughDoorEvent } from "../../events/GameEvents";
import { buildMovementPathAdjacent } from "../utils/pathfinding";
import { checkAdjacentToEnvironment, checkAdjacentToDirectionalBlockingEntity } from "./shared";
import type { WorldEntityActionLocation } from "../../services/WorldEntityActionService";
import type { MapLevel } from "../../../world/Location";
import { TargetingService } from "../../services/TargetingService";
import type { RequirementCheckContext } from "../../services/RequirementsChecker";

// =============================================================================
// Constants
// =============================================================================

/**
 * Maps Action enum values to their string names used in worldentityactions.4.carbon
 */
const ACTION_TO_STRING: Partial<Record<Action, string>> = {
  [Action.Open]: "open",
  [Action.Close]: "close",
  [Action.Fish]: "fish",
  [Action.Mine]: "mine",
  [Action.Chop]: "chop",
  [Action.Shake]: "shake",
  [Action.Comb]: "comb",
  [Action.Climb]: "climb",
  [Action.ClimbSameMapLevel]: "climb_same_map_level",
  [Action.Enter]: "enter",
  [Action.Exit]: "exit",
  [Action.Harvest]: "harvest",
  [Action.Smelt]: "smelt",
  [Action.Smith]: "smith",
  [Action.Search]: "search",
  [Action.Picklock]: "picklock",
  [Action.Unlock]: "unlock",
  [Action.Brew]: "brew",
  [Action.MineThrough]: "mine_through",
  [Action.GoThrough]: "go_through",
  [Action.SleepIn]: "sleep_in",
  [Action.Touch]: "touch",
  [Action.CraftAt]: "craft_at",
  [Action.WalkAcross]: "walk_across",
  [Action.SwingOn]: "swing_on",
  [Action.JumpOver]: "jump_over",
  [Action.ClimbOver]: "climb_over",
  [Action.SqueezeThrough]: "squeeze_through",
  [Action.JumpTo]: "jump_to",
  [Action.JumpIn]: "jump_in",
  [Action.JumpOn]: "jump_on",
  [Action.LeapFrom]: "leap_from",
  [Action.WalkAlong]: "walk_along",
  [Action.BankAt]: "bank_at",
  [Action.Craft]: "craft",
  [Action.WalkHere]: "walk_here",
};

/** Door-like entity types that use directional blocking */
const DOOR_LIKE_TYPES = new Set(["door", "opendoor", "gate"]);

function isDoorLikeEntity(entityState: WorldEntityState): boolean {
  return DOOR_LIKE_TYPES.has(entityState.type);
}

/**
 * Determines if an action requires a 1-tick wait before executing.
 * This ensures the player visibly stops before teleporting/transitioning.
 * 
 * Actions that require wait:
 * - Door interactions (GoThroughDoor)
 * - Teleport actions (TeleportTo) - cave entrances, ladders, etc.
 * - Mining through rocks (MineThroughRocks)
 * - Climbing ladders (ClimbSameMapLevel)
 */
function requiresWaitTick(
  ctx: ActionContext,
  entityState: WorldEntityState,
  actionName: string
): boolean {
  // Doors always require wait
  if (isDoorLikeEntity(entityState)) {
    return true;
  }
  
  // Check if this entity has an override with TeleportTo, GoThroughDoor, MineThroughRocks, or ClimbSameMapLevel
  const hasOverride = ctx.worldEntityActionService.hasAction(entityState.id, actionName);
  if (hasOverride) {
    const config = ctx.worldEntityActionService.getActionConfig(entityState.id, actionName);
    if (config) {
      for (const eventAction of config.playerEventActions) {
        if (
          eventAction.type === "TeleportTo" || 
          eventAction.type === "GoThroughDoor" || 
          eventAction.type === "MineThroughRocks" ||
          eventAction.type === "ClimbSameMapLevel"
        ) {
          return true;
        }
      }
    }
  }
  
  return false;
}

// =============================================================================
// Entry Point
// =============================================================================

/**
 * Main entry point for environment actions.
 * Validates the action and sets up pendingAction for tick-based processing.
 * 
 * This function DOES NOT execute the action - it only sets up the state.
 * The actual execution happens in processPendingEnvironmentActions.
 */
export function handleEnvironmentAction(
  ctx: ActionContext,
  playerState: PlayerState,
  action: Action,
  environmentId: number
): void {
  const entityState = ctx.worldEntityStates.get(environmentId);
  if (!entityState) {
    ctx.messageService.sendServerInfo(playerState.userId, "That doesn't exist anymore");
    return;
  }

  if (entityState.mapLevel !== playerState.mapLevel) {
    return;
  }

  const actionName = ACTION_TO_STRING[action];
  if (!actionName) {
    console.warn(`[handleEnvironmentAction] Unknown action: ${action}`);
    return;
  }

  // Validate action is supported
  const supportedActions = entityState.definition.actions || [];
  const hasOverride = ctx.worldEntityActionService.hasAction(entityState.id, actionName);
  
  if (!supportedActions.includes(actionName) && !hasOverride) {
    ctx.messageService.sendServerInfo(playerState.userId, "Supported action but lacks override. Please contact an administrator.");
      ctx.messageService.sendServerInfo(playerState.userId, "Environment ID: " + entityState.id + " Action: " + actionName);
    //console.warn(`[handleEnvironmentAction] Supported action but lacks override. Please contact an administrator. Environment ID: ${entityState.id}`);
    return;
  }

  // Set up pending action - tick processor handles the rest
  playerState.pendingAction = {
    action,
    entityType: EntityType.Environment,
    entityId: entityState.id,
    // waitTicks: undefined means "not in position yet"
  };

  // Check if already in valid position
  const isDoor = isDoorLikeEntity(entityState);
  const isInPosition = checkPosition(ctx, playerState, entityState, isDoor);

  ctx.targetingService.setPlayerTarget(playerState.userId, { type: EntityType.Environment, id: entityState.id });
  if (isInPosition) {
    // Already in position - set initial wait ticks
    // Teleports and doors wait 1 tick, others execute immediately
    const needsWait = requiresWaitTick(ctx, entityState, actionName);
    playerState.pendingAction.waitTicks = needsWait ? 1 : 0;
  } else {
    // Need to pathfind - start it
    startPathfinding(ctx, playerState, entityState, isDoor);
  }
}

// =============================================================================
// Tick Processor - THE SINGLE PLACE that handles all state transitions
// =============================================================================

/**
 * Process pending environment actions for all players.
 * Called once per tick from GameServer.
 * 
 * This is THE ONLY PLACE that:
 * - Checks if player finished pathfinding
 * - Checks if player is in valid position
 * - Handles wait tick countdown
 * - Executes the action
 */
export function processPendingEnvironmentActions(ctx: ActionContext): void {
  for (const playerState of ctx.playerStatesByUserId.values()) {
    const pending = playerState.pendingAction;
    if (!pending || pending.entityType !== EntityType.Environment) {
      continue;
    }

    const entityState = ctx.worldEntityStates.get(pending.entityId);
    if (!entityState) {
      // Entity gone
      playerState.pendingAction = null;
      continue;
    }

    const isDoor = isDoorLikeEntity(entityState);

    // If waitTicks is undefined, player hasn't reached position yet
    if (pending.waitTicks === undefined) {
      // Check if still moving
      const entityRef: EntityRef = { type: EntityType.Player, id: playerState.userId };
      const isMoving = ctx.pathfindingSystem.hasMovementPlan(entityRef);
      
      if (isMoving) {
        // Still pathfinding, wait for next tick
        continue;
      }

      // Movement finished - check if in valid position
      const isInPosition = checkPosition(ctx, playerState, entityState, isDoor);
      
      if (!isInPosition) {
        // Not in position and not moving - failed to reach
        ctx.messageService.sendServerInfo(playerState.userId, "Can't reach that");
        playerState.pendingAction = null;
        continue;
      }

      // Just arrived at position - set wait ticks
      // Teleports and doors wait 1 tick for clean stop, others execute immediately
      const actionName = ACTION_TO_STRING[pending.action];
      const needsWait = actionName ? requiresWaitTick(ctx, entityState, actionName) : false;
      pending.waitTicks = needsWait ? 1 : 0;
      continue; // Process on next tick
    }

    // Has waitTicks set - count down
    if (pending.waitTicks > 0) {
      pending.waitTicks--;
      continue;
    }

    // waitTicks === 0, ready to execute
    const actionName = ACTION_TO_STRING[pending.action];
    if (!actionName) {
      playerState.pendingAction = null;
      continue;
    }

    // Final position check before execution
    const isInPosition = checkPosition(ctx, playerState, entityState, isDoor);
    if (!isInPosition) {
      ctx.messageService.sendServerInfo(playerState.userId, "You moved away");
      playerState.pendingAction = null;
      continue;
    }

    ctx.targetingService.clearPlayerTarget(playerState.userId);

    const hasOverride = ctx.worldEntityActionService.hasAction(entityState.id, actionName);
    executeEnvironmentAction(ctx, playerState, entityState, pending.action, actionName, hasOverride);
    playerState.pendingAction = null;
  }
}

// =============================================================================
// Helper Functions
// =============================================================================

/**
 * Single position check function - THE ONLY adjacency check in this file.
 * 
 * Logic:
 * - Doors: Use directional blocking check (cardinal only, based on blocked directions)
 * - Small entities (1x1): Cardinal only (diagonal feels wrong for ladders, etc.)
 * - Large entities (2x2+): Allow diagonals (caves, large objects)
 */
function checkPosition(
  ctx: ActionContext,
  playerState: PlayerState,
  entityState: WorldEntityState,
  isDoor: boolean
): boolean {
  // Doors use special directional blocking logic
  if (isDoor) {
    return checkAdjacentToDirectionalBlockingEntity(ctx, playerState, entityState);
  }
  
  // Small entities (1x1): Cardinal adjacency only
  // Large entities (2x2+): Allow diagonal adjacency
  const isSmallEntity = entityState.width <= 1 && entityState.length <= 1;
  const allowDiagonal = !isSmallEntity;
  
  return checkAdjacentToEnvironment(ctx, playerState, entityState, false, allowDiagonal);
}

/**
 * Starts pathfinding to an entity.
 * Pathfinding logic matches position checking:
 * - Doors: Try direct path first (if accessible), cardinal adjacency fallback
 * - Small entities (1x1): Cardinal adjacency only
 * - Large entities (2x2+): Allow diagonal adjacency
 */
function startPathfinding(
  ctx: ActionContext,
  playerState: PlayerState,
  entityState: WorldEntityState,
  isDoor: boolean
): void {
  // Determine adjacency rules based on entity size
  const isSmallEntity = entityState.width <= 1 && entityState.length <= 1;
  const allowDiagonal = isDoor ? false : !isSmallEntity; // Doors: false, Small: false, Large: true
  
  const path = buildMovementPathAdjacent(
    ctx,
    playerState.x,
    playerState.y,
    entityState.x,
    entityState.y,
    playerState.mapLevel,
    !isDoor, // forceAdjacent: true for non-doors
    null,
    allowDiagonal // Cardinal only for doors and small entities
  );

  if (!path || path.length <= 1) {
    ctx.messageService.sendServerInfo(playerState.userId, "Can't reach that");
    playerState.pendingAction = null;
    return;
  }

  const speed = playerState.settings[PlayerSetting.IsSprinting] === 1 ? 2 : 1;
  const entityRef: EntityRef = { type: EntityType.Player, id: playerState.userId };
  
  // Schedule movement - NO CALLBACK needed, tick processor handles completion
  ctx.pathfindingSystem.scheduleMovementPlan(
    entityRef,
    playerState.mapLevel,
    path,
    speed
  );
}

// =============================================================================
// Action Execution
// =============================================================================

/**
 * Executes an environment action.
 * First checks for override behavior, then falls back to default.
 */
function executeEnvironmentAction(
  ctx: ActionContext,
  playerState: PlayerState,
  entityState: WorldEntityState,
  action: Action,
  actionName: string,
  hasOverride: boolean
): void {
  if (hasOverride) {
    executeOverrideAction(ctx, playerState, entityState, actionName);
  } else {
    executeDefaultAction(ctx, playerState, entityState, action, actionName);
  }
}

/**
 * Executes override behavior from worldentityactions.4.carbon.
 */
function executeOverrideAction(
  ctx: ActionContext,
  playerState: PlayerState,
  entityState: WorldEntityState,
  actionName: string
): void {
  console.log(`[executeOverrideAction] Player ${playerState.userId} "${actionName}" on ${entityState.type} (${entityState.id})`);

  const actionConfig = ctx.worldEntityActionService.getActionConfig(entityState.id, actionName);
  if (!actionConfig) {
    console.error(`[executeOverrideAction] Config disappeared for entity ${entityState.id}`);
    return;
  }

  // Check requirements - player has walked up to the entity and is now trying to use it
  const context: RequirementCheckContext = {
    playerState
  };

  const requirementCheck = ctx.worldEntityActionService.checkActionRequirements(actionConfig, context);
  if (!requirementCheck.passed) {
    // Player tried to use the entity but doesn't meet requirements
    // Use custom message from action config, or fall back to action-specific defaults
    let failureMessage;
    let detailedFailureMessage: string = requirementCheck.failureReason ?? "";
    
    if (!failureMessage) {
      // Default messages based on action type
      switch (actionName) {
        case "open":
        case "close":
          failureMessage = "It's locked.";
          break;
        case "enter":
        case "exit":
          failureMessage = "It doesn't budge.";
          break;
        case "mine":
        case "mine_through":
          failureMessage = "You are not skilled enough to mine this.";
          break;
        case "chop":
          failureMessage = "You are not skilled enough to chop this.";
          break;
        case "fish":
          failureMessage = "You are not skilled enough to fish here.";
          break;
        case "climb":
        case "climb_over":
        case "climb_same_map_level":
          failureMessage = "You cannot climb this.";
          break;
        case "go_through":
          failureMessage = "You cannot pass through.";
          break;
        case "unlock":
          failureMessage = "You don't have the key.";
          break;
        case "picklock":
          failureMessage = "You are not skilled enough to pick this lock.";
          break;
        case "search":
          failureMessage = "You cannot search this.";
          break;
        case "touch":
          failureMessage = "Nothing happens.";
          break;
        default:
          // Fall back to detailed requirement failure reason
          failureMessage = requirementCheck.failureReason || "You don't meet the requirements.";
      }
    }
    
    ctx.messageService.sendServerInfo(playerState.userId, failureMessage);
    ctx.messageService.sendServerInfo(playerState.userId, detailedFailureMessage);
    console.log(
      `[executeOverrideAction] Player ${playerState.userId} failed requirements for ${actionName} on entity ${entityState.id}: ${failureMessage}`
    );
    return;
  }

  for (const eventAction of actionConfig.playerEventActions) {
    switch (eventAction.type) {
      case "TeleportTo":
        if (eventAction.location) {
          const { x, y, lvl } = eventAction.location;
          const result = ctx.teleportService.changeMapLevel(
            playerState.userId,
            x,
            y,
            lvl as MapLevel
          );
          if (!result.success) {
            ctx.messageService.sendServerInfo(playerState.userId, "Unable to teleport");
          }
        }
        break;

      case "GoThroughDoor":
        executeGoThroughDoor(ctx, playerState, entityState, eventAction.insideLocation, eventAction.outsideLocation);
        break;

      case "MineThroughRocks":
        executeMineThroughRocks(ctx, playerState, entityState, actionConfig, eventAction.sideOne, eventAction.sideTwo);
        break;

      case "ClimbSameMapLevel":
        executeClimbSameMapLevel(ctx, playerState, entityState, eventAction.sideOne, eventAction.sideTwo);
        break;

      default:
        console.warn(`[executeOverrideAction] Unknown event type: ${eventAction.type}`);
    }
  }
}

/**
 * Executes default behavior for environment actions.
 */
function executeDefaultAction(
  ctx: ActionContext,
  playerState: PlayerState,
  entityState: WorldEntityState,
  action: Action,
  actionName: string
): void {
  console.log(`[executeDefaultAction] Player ${playerState.userId} "${actionName}" on ${entityState.type} (${entityState.id})`);

  switch (action) {
    case Action.BankAt:
      // Open the bank - handled by BankingService
      // Pass world entity ID (e.g., 2907) as the bank ID in the packet
      ctx.bankingService.openBank(playerState.userId, entityState.id).catch((err) => {
        console.error(`[banking] Error opening bank for user ${playerState.userId}:`, err);
        ctx.messageService.sendServerInfo(playerState.userId, "Unable to access the bank at this time.");
      });
      break;
    case Action.Chop:
      // Woodcutting - handled by WoodcuttingService
      if (ctx.woodcuttingService) {
        ctx.woodcuttingService.initiateChop(playerState, entityState);
      } else {
        ctx.messageService.sendServerInfo(playerState.userId, "Woodcutting is not available.");
      }
      break;
    case Action.Fish:
      // Fishing - handled by FishingService
      if (ctx.fishingService) {
        ctx.fishingService.initiateFish(playerState, entityState);
      } else {
        ctx.messageService.sendServerInfo(playerState.userId, "Fishing is not available.");
      }
      break;
    case Action.Mine:
      // Mining - handled by MiningService
      if (ctx.miningService) {
        ctx.miningService.initiateMine(playerState, entityState);
      } else {
        ctx.messageService.sendServerInfo(playerState.userId, "Mining is not available.");
      }
      break;
    case Action.Harvest:
      // Harvesting - handled by HarvestingService
      if (ctx.harvestingService) {
        ctx.harvestingService.initiateHarvest(playerState, entityState);
      } else {
        ctx.messageService.sendServerInfo(playerState.userId, "Harvesting is not available.");
      }
      break;
    case Action.Open:
    case Action.Close:
    case Action.Shake:
    case Action.Comb:
    case Action.Smelt: {
      ctx.skillingMenuService.openMenu(playerState.userId, entityState.id, MenuType.Smelting);
      break;
    }
    case Action.Smith: {
      ctx.skillingMenuService.openMenu(playerState.userId, entityState.id, MenuType.Smithing);
      break;
    }
    case Action.Craft: {
      ctx.skillingMenuService.openMenu(playerState.userId, entityState.id, MenuType.SmeltingKiln);
      break;
    }
    case Action.CraftAt: {
      ctx.skillingMenuService.openMenu(playerState.userId, entityState.id, MenuType.CraftingTable);
      break;
    }
    case Action.Brew: {
      ctx.skillingMenuService.openMenu(playerState.userId, entityState.id, MenuType.PotionMaking);
      break;
    }
    case Action.Search:
    case Action.SleepIn:
    case Action.Picklock:
    case Action.Unlock:
      ctx.messageService.sendServerInfo(playerState.userId, `${actionName} not yet implemented`);
      break;
    default:
      // Actions without default behavior (require override)
      ctx.messageService.sendServerInfo(playerState.userId, "Nothing interesting happens.");
  }
}

// =============================================================================
// GoThroughDoor
// =============================================================================

/**
 * Checks if a location is reachable within a maximum number of steps.
 * Used for determining which side of a ladder/obstacle the player is on.
 * 
 * @param ctx - Action context
 * @param playerState - The player
 * @param targetX - Target X coordinate
 * @param targetY - Target Y coordinate
 * @param maxSteps - Maximum number of steps to allow
 * @returns true if reachable within maxSteps, false otherwise
 */
function isReachableWithinSteps(
  ctx: ActionContext,
  playerState: PlayerState,
  targetX: number,
  targetY: number,
  maxSteps: number
): boolean {
  // If already at target, it's reachable
  if (playerState.x === targetX && playerState.y === targetY) {
    return true;
  }

  // Build path to target
  const path = buildMovementPathAdjacent(
    ctx,
    playerState.x,
    playerState.y,
    targetX,
    targetY,
    playerState.mapLevel,
    false, // forceAdjacent
    maxSteps + 1, // maxSearchRadius: +1 for radius to allow checking
    true // allowDiagonal
  );

  // Check if path exists and is within max steps
  // Path includes starting position, so length-1 is the number of moves
  return path !== null && path.length > 0 && (path.length - 1) <= maxSteps;
}

/**
 * Climbs a ladder that stays on the same map level.
 * Determines which side of the ladder the player is on by checking reachability,
 * then teleports them to the other side.
 * 
 * @param ctx - Action context
 * @param playerState - The player climbing
 * @param entityState - The ladder entity
 * @param sideOne - First side location
 * @param sideTwo - Second side location
 */
function executeClimbSameMapLevel(
  ctx: ActionContext,
  playerState: PlayerState,
  entityState: WorldEntityState,
  sideOne?: WorldEntityActionLocation,
  sideTwo?: WorldEntityActionLocation
): void {
  if (!sideOne || !sideTwo) {
    console.error(`[executeClimbSameMapLevel] Missing side locations for entity ${entityState.id}`);
    return;
  }

  // Determine which side the player is on by checking reachability within 2 steps
  const canReachSideOne = isReachableWithinSteps(ctx, playerState, sideOne.x, sideOne.y, 2);
  const canReachSideTwo = isReachableWithinSteps(ctx, playerState, sideTwo.x, sideTwo.y, 2);

  let targetSide: WorldEntityActionLocation | null = null;

  if (canReachSideOne && !canReachSideTwo) {
    // Player is near sideOne, teleport to sideTwo
    targetSide = sideTwo;
    console.log(`[executeClimbSameMapLevel] Player ${playerState.userId} near sideOne, climbing to sideTwo`);
  } else if (canReachSideTwo && !canReachSideOne) {
    // Player is near sideTwo, teleport to sideOne
    targetSide = sideOne;
    console.log(`[executeClimbSameMapLevel] Player ${playerState.userId} near sideTwo, climbing to sideOne`);
  } else if (canReachSideOne && canReachSideTwo) {
    // Player can reach both sides (unlikely but possible if very close)
    // Choose the closer one
    const distToSideOne = Math.abs(playerState.x - sideOne.x) + Math.abs(playerState.y - sideOne.y);
    const distToSideTwo = Math.abs(playerState.x - sideTwo.x) + Math.abs(playerState.y - sideTwo.y);
    
    if (distToSideOne <= distToSideTwo) {
      targetSide = sideTwo;
      console.log(`[executeClimbSameMapLevel] Player ${playerState.userId} equidistant, climbing from sideOne to sideTwo`);
    } else {
      targetSide = sideOne;
      console.log(`[executeClimbSameMapLevel] Player ${playerState.userId} equidistant, climbing from sideTwo to sideOne`);
    }
  } else {
    // Player cannot reach either side within 2 steps
    console.log(`[executeClimbSameMapLevel] Player ${playerState.userId} too far from ladder`);
    ctx.messageService.sendServerInfo(playerState.userId, "You cannot reach the ladder from here.");
    return;
  }

  // Teleport to the target side
  if (targetSide) {
    const result = ctx.teleportService.changeMapLevel(
      playerState.userId,
      targetSide.x,
      targetSide.y,
      targetSide.lvl as MapLevel
    );

    if (!result.success) {
      ctx.messageService.sendServerInfo(playerState.userId, "Unable to climb.");
    }
  }
}

/**
 * Executes the GoThroughDoor action.
 * Player must be at exactly insideLocation or outsideLocation.
 */
function executeGoThroughDoor(
  ctx: ActionContext,
  playerState: PlayerState,
  entityState: WorldEntityState,
  insideLocation: WorldEntityActionLocation | undefined,
  outsideLocation: WorldEntityActionLocation | undefined
): void {
  if (!insideLocation || !outsideLocation) {
    ctx.messageService.sendServerInfo(playerState.userId, "The door seems stuck");
    return;
  }

  const { x: px, y: py, mapLevel: pl } = playerState;

  const isAtInside = px === insideLocation.x && py === insideLocation.y && pl === insideLocation.lvl;
  const isAtOutside = px === outsideLocation.x && py === outsideLocation.y && pl === outsideLocation.lvl;

  if (!isAtInside && !isAtOutside) {
    ctx.messageService.sendServerInfo(playerState.userId, "You need to be at the door to go through it");
    return;
  }

  const destination = isAtInside ? outsideLocation : insideLocation;

  console.log(`[executeGoThroughDoor] Player ${playerState.userId} through door to (${destination.x}, ${destination.y})`);

  const oldPosition = { x: px, y: py, mapLevel: pl };

  // Update player position (this also sets the dirty flag for persistence)
  playerState.updateLocation(destination.lvl as MapLevel, destination.x, destination.y);

  const newPosition = { x: playerState.x, y: playerState.y, mapLevel: playerState.mapLevel };

  // Emit event for VisibilitySystem to handle packets
  ctx.eventBus.emit(createPlayerWentThroughDoorEvent(
    playerState.userId,
    oldPosition,
    newPosition,
    entityState.id
  ));
}

// =============================================================================
// MineThroughRocks
// =============================================================================

/**
 * Executes the MineThroughRocks action.
 * Player must have a pickaxe equipped and the required mining level.
 * The player must be at exactly sideOne or sideTwo to mine through.
 */
function executeMineThroughRocks(
  ctx: ActionContext,
  playerState: PlayerState,
  entityState: WorldEntityState,
  actionConfig: any,
  sideOne: WorldEntityActionLocation | undefined,
  sideTwo: WorldEntityActionLocation | undefined
): void {
  if (!sideOne || !sideTwo) {
    ctx.messageService.sendServerInfo(playerState.userId, "The rocks are too thick to mine through");
    return;
  }

  // Check if player has a pickaxe equipped
  const weaponItemId = ctx.equipmentService.getEquippedItemId(playerState.userId, "weapon");
  
  if (!weaponItemId || !ctx.itemCatalog) {
    ctx.messageService.sendServerInfo(playerState.userId, "You need to equip a pickaxe to do that");
    return;
  }

  const weaponDef = ctx.itemCatalog.getDefinitionById(weaponItemId);
  
  if (!weaponDef || !weaponDef.equippableRequirements) {
    ctx.messageService.sendServerInfo(playerState.userId, "You need to equip a pickaxe to do that");
    return;
  }

  // Check if the equipped weapon is a pickaxe (has mining requirement)
  const hasPickaxe = weaponDef.equippableRequirements.some(
    (req: any) => req.skill === "mining"
  );

  if (!hasPickaxe) {
    ctx.messageService.sendServerInfo(playerState.userId, "You need to equip a pickaxe to do that");
    return;
  }

  // Check skill level requirements
  if (actionConfig.requirements && Array.isArray(actionConfig.requirements)) {
    for (const requirement of actionConfig.requirements) {
      if (requirement.type === "skill") {
        // Use effective level (includes potions - equipment bonuses)
        const playerLevel = playerState.getSkillBoostedLevel(requirement.skill);
        const requiredLevel = requirement.level;
        
        // Check operator (default to >=)
        const operator = requirement.operator || ">=";
        let meetsRequirement = false;
        
        switch (operator) {
          case ">=":
            meetsRequirement = playerLevel >= requiredLevel;
            break;
          case ">":
            meetsRequirement = playerLevel > requiredLevel;
            break;
          case "==":
          case "=":
            meetsRequirement = playerLevel === requiredLevel;
            break;
          case "<=":
            meetsRequirement = playerLevel <= requiredLevel;
            break;
          case "<":
            meetsRequirement = playerLevel < requiredLevel;
            break;
          default:
            meetsRequirement = playerLevel >= requiredLevel;
        }
        
        if (!meetsRequirement) {
          ctx.messageService.sendServerInfo(
            playerState.userId, 
            `You need a ${requirement.skill} level of ${requiredLevel} to do that`
          );
          return;
        }
      }
    }
  }

  const { x: px, y: py, mapLevel: pl } = playerState;

  const isAtSideOne = px === sideOne.x && py === sideOne.y && pl === sideOne.lvl;
  const isAtSideTwo = px === sideTwo.x && py === sideTwo.y && pl === sideTwo.lvl;

  if (!isAtSideOne && !isAtSideTwo) {
    ctx.messageService.sendServerInfo(playerState.userId, "You need to be at the rocks to mine through them");
    return;
  }

  const destination = isAtSideOne ? sideTwo : sideOne;

  console.log(`[executeMineThroughRocks] Player ${playerState.userId} mining through rocks to (${destination.x}, ${destination.y})`);

  // Send message
  ctx.messageService.sendServerInfo(playerState.userId, "You mine your way through the rocks");

  const oldPosition = { x: px, y: py, mapLevel: pl };

  // Update player position (this also sets the dirty flag for persistence)
  playerState.updateLocation(destination.lvl as MapLevel, destination.x, destination.y);

  const newPosition = { x: playerState.x, y: playerState.y, mapLevel: playerState.mapLevel };

  // Emit event for VisibilitySystem to handle packets
  // Reuse the PlayerWentThroughDoor event since it has the exact same behavior
  // (movement via SendMovementPath packet instead of teleport)
  ctx.eventBus.emit(createPlayerWentThroughDoorEvent(
    playerState.userId,
    oldPosition,
    newPosition,
    entityState.id
  ));
}

// =============================================================================
// Legacy Exports (for backward compatibility)
// =============================================================================

/** @deprecated - No longer needed, tick processor handles everything */
export function handleEnvironmentMovementComplete(): void {
  console.warn("[handleEnvironmentMovementComplete] DEPRECATED - use processPendingEnvironmentActions");
}

/** @deprecated - Use processPendingEnvironmentActions instead */
export function executeDelayedEnvironmentAction(): void {
  console.warn("[executeDelayedEnvironmentAction] DEPRECATED - use processPendingEnvironmentActions");
}
