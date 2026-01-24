import { MenuType } from "../../protocol/enums/MenuType";
import { GameAction } from "../../protocol/enums/GameAction";
import { decodeUseItemOnItemPayload } from "../../protocol/packets/actions/UseItemOnItem";
import { buildUsedItemOnItemPayload } from "../../protocol/packets/actions/UsedItemOnItem";
import type { ActionContext, ActionHandler } from "./types";

const DEFAULT_INTERACTION_MESSAGE = "Nothing interesting happens.";

export const handleUseItemOnItem: ActionHandler = (ctx, actionData) => {
  const payload = decodeUseItemOnItemPayload(actionData);

  if (!ctx.userId) {
    console.warn("[handleUseItemOnItem] No userId - action ignored");
    return;
  }

  const playerState = ctx.playerStatesByUserId.get(ctx.userId);
  if (!playerState) {
    console.warn(`[handleUseItemOnItem] No player state for user ${ctx.userId}`);
    return;
  }

  const menuType = Number(payload.MenuType);
  if (menuType !== MenuType.Inventory) {
    console.warn(`[handleUseItemOnItem] Unsupported menu type: ${menuType}`);
    return;
  }

  const usingSlot = Number(payload.UsingItemSlot);
  const targetSlot = Number(payload.TargetItemSlot);
  if (!Number.isInteger(usingSlot) || !Number.isInteger(targetSlot)) {
    console.warn("[handleUseItemOnItem] Invalid slot indices:", payload);
    return;
  }

  const usingItem = playerState.inventory[usingSlot];
  const targetItem = playerState.inventory[targetSlot];
  if (!usingItem || !targetItem) {
    console.warn("[handleUseItemOnItem] Missing inventory item(s) for slots");
    return;
  }

  const usingItemId = usingItem[0];
  const targetItemId = targetItem[0];
  const usingIsIOU = usingItem[2] === 1;
  const targetIsIOU = targetItem[2] === 1;
  const payloadUsingIsIOU = Boolean(payload.UsingItemIsIOU);
  const payloadTargetIsIOU = Boolean(payload.TargetItemIsIOU);

  if (usingItemId !== Number(payload.UsingItemID) || usingIsIOU !== payloadUsingIsIOU) {
    console.warn("[handleUseItemOnItem] Using item mismatch:", payload);
    return;
  }

  if (targetItemId !== Number(payload.TargetItemID) || targetIsIOU !== payloadTargetIsIOU) {
    console.warn("[handleUseItemOnItem] Target item mismatch:", payload);
    return;
  }

  const actionIndex = Number(payload.ItemOnItemActionResultIndex);
  const amountToCreate = Number(payload.AmountToCreate);

  const result = ctx.itemInteractionService.handleItemOnItem(
    playerState,
    usingItemId,
    targetItemId,
    Number.isFinite(actionIndex) ? actionIndex : undefined,
    Number.isFinite(amountToCreate) ? amountToCreate : undefined
  );

  const usedPayload = buildUsedItemOnItemPayload({
    MenuType: payload.MenuType,
    UsingItemSlot: payload.UsingItemSlot,
    UsingItemID: payload.UsingItemID,
    UsingItemIsIOU: payloadUsingIsIOU,
    TargetItemSlot: payload.TargetItemSlot,
    TargetItemID: payload.TargetItemID,
    TargetItemIsIOU: payloadTargetIsIOU,
    ItemOnItemActionResultIndex: payload.ItemOnItemActionResultIndex,
    AmountToCreate: payload.AmountToCreate,
    Success: result.success
  });
  ctx.enqueueUserMessage(playerState.userId, GameAction.UsedItemOnItem, usedPayload);

  if (!result.handled) {
    ctx.messageService.sendServerInfo(playerState.userId, DEFAULT_INTERACTION_MESSAGE);
  }
};
