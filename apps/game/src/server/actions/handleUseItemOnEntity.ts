import { EntityType } from "../../protocol/enums/EntityType";
import { PlayerSetting } from "../../protocol/enums/PlayerSetting";
import { decodeUseItemOnEntityPayload } from "../../protocol/packets/actions/UseItemOnEntity";
import type { ActionContext, ActionHandler } from "./types";
import type { NPCState, WorldEntityState } from "../state/EntityState";
import type { PlayerState } from "../../world/PlayerState";
import type { EntityRef } from "../events/GameEvents";
import { buildMovementPathAdjacent } from "./utils/pathfinding";
import { checkAdjacentToEnvironment, checkAdjacentToNPC } from "./entity-actions/shared";

const DEFAULT_INTERACTION_MESSAGE = "Nothing interesting happens.";

export const handleUseItemOnEntity: ActionHandler = (ctx, actionData) => {
  const payload = decodeUseItemOnEntityPayload(actionData);

  if (!ctx.userId) {
    console.warn("[handleUseItemOnEntity] No userId - action ignored");
    return;
  }

  const playerState = ctx.playerStatesByUserId.get(ctx.userId);
  if (!playerState) {
    console.warn(`[handleUseItemOnEntity] No player state for user ${ctx.userId}`);
    return;
  }

  //lol? The packets from the client are backwards. This needs to stay.
  const itemId = Number(payload.ItemID);
  const entityId = Number(payload.EntityType);
  const entityType = Number(payload.EntityID);

  if (!Number.isInteger(itemId) || !Number.isInteger(entityType) || !Number.isInteger(entityId)) {
    console.warn("[handleUseItemOnEntity] Invalid payload:", payload);
    return;
  }

  if (!playerState.hasItem(itemId)) {
    ctx.messageService.sendServerInfo(playerState.userId, "You don't have that item.");
    return;
  }

  switch (entityType) {
    case EntityType.Environment: {
      const entityState = ctx.worldEntityStates.get(entityId);
      if (!entityState) {
        ctx.messageService.sendServerInfo(playerState.userId, "That doesn't exist anymore.");
        return;
      }
      if (entityState.mapLevel !== playerState.mapLevel) {
        return;
      }
      handleItemOnEnvironment(ctx, playerState, itemId, entityState);
      break;
    }
    case EntityType.NPC: {
      const npcState = ctx.npcStates.get(entityId);
      if (!npcState) {
        ctx.messageService.sendServerInfo(playerState.userId, "They aren't here.");
        return;
      }
      if (npcState.mapLevel !== playerState.mapLevel) {
        return;
      }
      handleItemOnNpc(ctx, playerState, itemId, npcState);
      break;
    }
    case EntityType.Item:
      ctx.messageService.sendServerInfo(playerState.userId, DEFAULT_INTERACTION_MESSAGE);
      break;
    default:
      console.warn(`[handleUseItemOnEntity] Unknown entity type: ${entityType}`);
      break;
  }
};

function handleItemOnEnvironment(
  ctx: ActionContext,
  playerState: PlayerState,
  itemId: number,
  entityState: WorldEntityState
): void {
  const executeInteraction = () => {
    ctx.targetingService.clearPlayerTarget(playerState.userId);
    ctx.itemInteractionService.handleItemOnWorldEntity(playerState, itemId, entityState);
  };

  const isSmallEntity = entityState.width <= 1 && entityState.length <= 1;
  const allowDiagonal = !isSmallEntity;
  const isAdjacent = checkAdjacentToEnvironment(ctx, playerState, entityState, false, allowDiagonal);

  if (isAdjacent) {
    executeInteraction();
    return;
  }

  ctx.targetingService.setPlayerTarget(playerState.userId, { type: EntityType.Environment, id: entityState.id });

  const path = buildMovementPathAdjacent(
    ctx,
    playerState.x,
    playerState.y,
    entityState.x,
    entityState.y,
    playerState.mapLevel,
    true,
    null,
    allowDiagonal
  );

  if (!path || path.length <= 1) {
    ctx.messageService.sendServerInfo(playerState.userId, "Can't reach that.");
    ctx.targetingService.clearPlayerTarget(playerState.userId);
    return;
  }

  const speed = playerState.settings[PlayerSetting.IsSprinting] === 1 ? 2 : 1;
  const entityRef: EntityRef = { type: EntityType.Player, id: playerState.userId };

  ctx.pathfindingSystem.scheduleMovementPlan(entityRef, playerState.mapLevel, path, speed, () => {
    const inPosition = checkAdjacentToEnvironment(ctx, playerState, entityState, false, allowDiagonal);
    if (!inPosition) {
      ctx.messageService.sendServerInfo(playerState.userId, "Can't reach that.");
      ctx.targetingService.clearPlayerTarget(playerState.userId);
      return;
    }
    executeInteraction();
  });
}

function handleItemOnNpc(
  ctx: ActionContext,
  playerState: PlayerState,
  itemId: number,
  npcState: NPCState
): void {
  const executeInteraction = () => {
    ctx.targetingService.clearPlayerTarget(playerState.userId);
    const handled = ctx.itemInteractionService.handleItemOnNpc(playerState, itemId, npcState);
    if (!handled) {
      ctx.messageService.sendServerInfo(playerState.userId, DEFAULT_INTERACTION_MESSAGE);
    }
  };

  const isAdjacent = checkAdjacentToNPC(ctx, playerState, npcState);
  if (isAdjacent) {
    executeInteraction();
    return;
  }

  ctx.targetingService.setPlayerTarget(playerState.userId, { type: EntityType.NPC, id: npcState.id });

  const path = buildMovementPathAdjacent(
    ctx,
    playerState.x,
    playerState.y,
    npcState.x,
    npcState.y,
    playerState.mapLevel,
    true,
    128
  );

  if (!path || path.length <= 1) {
    ctx.messageService.sendServerInfo(playerState.userId, "Can't reach them.");
    ctx.targetingService.clearPlayerTarget(playerState.userId);
    return;
  }

  const speed = playerState.settings[PlayerSetting.IsSprinting] === 1 ? 2 : 1;
  const entityRef: EntityRef = { type: EntityType.Player, id: playerState.userId };

  ctx.pathfindingSystem.scheduleMovementPlan(entityRef, playerState.mapLevel, path, speed, () => {
    const inPosition = checkAdjacentToNPC(ctx, playerState, npcState);
    if (!inPosition) {
      ctx.messageService.sendServerInfo(playerState.userId, "Can't reach them.");
      ctx.targetingService.clearPlayerTarget(playerState.userId);
      return;
    }
    executeInteraction();
  });
}
