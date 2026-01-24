import { GameAction } from "../../protocol/enums/GameAction";
import { States } from "../../protocol/enums/States";
import { decodeReorganizeInventorySlotsPayload } from "../../protocol/packets/actions/ReorganizeInventorySlots";
import { buildReorganizedInventorySlotsPayload } from "../../protocol/packets/actions/ReorganizedInventorySlots";
import { InventoryManager, InventoryMenuType } from "../../world/systems/InventoryManager";
import { applyWeightChange } from "../../world/systems/WeightCalculator";
import type { ActionHandler, ActionContext } from "./types";
import type { PlayerState } from "../../world/PlayerState";
import { ItemCatalog } from "../../world/items/ItemCatalog";

enum ReorganizeInventorySlotsType {
  Swap = 0,
  Insert = 1,
}

/**
 * Handles the ReorganizeInventorySlots action (slot swap/move request from client).
 * Only trusts menuType, slot1, and slot2 from the packet - all other data is derived server-side.
 */
export const handleReorganizeInventorySlots: ActionHandler = (ctx, actionData) => {
  if (ctx.userId === null) return;

  const pkt = decodeReorganizeInventorySlotsPayload(actionData);
  const logInvalid = (reason: string, details?: Record<string, unknown>) => {
    ctx.packetAudit?.logInvalidPacket({
      userId: ctx.userId,
      packetName: "ReorganizeInventorySlots",
      reason,
      payload: pkt,
      details
    });
  };
  const playerState = ctx.playerStatesByUserId.get(ctx.userId);
  if (!playerState) return;

  const menuType = Number(pkt.Menu);
  const slot1 = Number(pkt.Slot1);
  const slot2 = Number(pkt.Slot2);
  const reorganizeType = Number(pkt.Type);

  // Validate reorganize type
  if (reorganizeType !== ReorganizeInventorySlotsType.Swap && reorganizeType !== ReorganizeInventorySlotsType.Insert) {
    return; // Unknown type, silently ignore
  }

  // Route to appropriate handler based on menu type
  if (menuType === InventoryMenuType.Bank) {
    handleBankReorganize(ctx, playerState, slot1, slot2, reorganizeType);
  } else if (menuType === InventoryMenuType.PlayerInventory) {
    handleInventoryReorganize(ctx, playerState, slot1, slot2, reorganizeType);
  } else {
    // Unknown menu type, silently ignore
    logInvalid("reorganize_invalid_menu", { menuType });
    return;
  }
};

/**
 * Handles bank slot reorganization (swap or insert)
 */
function handleBankReorganize(
  ctx: ActionContext,
  playerState: PlayerState,
  slot1: number,
  slot2: number,
  reorganizeType: number
): void {
  const userId = ctx.userId!;
  
  // Security check: Player must be in banking state
  if (playerState.currentState !== States.BankingState) {
    sendReorganizeFailure(ctx, InventoryMenuType.Bank, slot1, slot2, reorganizeType);
    return;
  }
  
  // Perform the operation via BankingService
  const result = reorganizeType === ReorganizeInventorySlotsType.Swap
    ? ctx.bankingService.swapBankSlots(userId, slot1, slot2)
    : ctx.bankingService.insertAtBankSlot(userId, slot1, slot2);
  
  if (!result.success) {
    sendReorganizeFailure(ctx, InventoryMenuType.Bank, slot1, slot2, reorganizeType);
    return;
  }
  
  // Send success response
  // Bank items don't have IOU flag (always false)
  ctx.enqueueUserMessage(userId, GameAction.ReorganizedInventorySlots, buildReorganizedInventorySlotsPayload({
    Menu: InventoryMenuType.Bank,
    Slot1: slot1,
    ItemID1: result.item2 ? result.item2[0] : -1,
    IsIOU1: false, // Bank items are never IOUs
    Slot2: slot2,
    ItemID2: result.item1 ? result.item1[0] : -1,
    IsIOU2: false, // Bank items are never IOUs
    Type: reorganizeType,
    Success: true,
  }));
}

/**
 * Handles player inventory slot reorganization (swap only for now)
 */
function handleInventoryReorganize(
  ctx: ActionContext,
  playerState: PlayerState,
  slot1: number,
  slot2: number,
  reorganizeType: number
): void {
  const userId = ctx.userId!;
  
  // Inventory only supports swap for now
  // (Insert would require shifting 28 slots which isn't implemented)
  if (reorganizeType !== ReorganizeInventorySlotsType.Swap) {
    sendReorganizeFailure(ctx, InventoryMenuType.PlayerInventory, slot1, slot2, reorganizeType);
    return;
  }
  
  if (!ctx.itemCatalog) return;
  
  // Create inventory manager with weight tracking
  const inventoryManager = new InventoryManager(
    playerState.inventory,
    ctx.itemCatalog,
    (changes) => applyWeightChange(playerState, changes, ctx.itemCatalog!)
  );
  
  // Perform the swap
  const result = inventoryManager.swapSlots(slot1, slot2);
  
  if (!result.success) {
    sendReorganizeFailure(ctx, InventoryMenuType.PlayerInventory, slot1, slot2, reorganizeType);
    return;
  }
  
  // Mark inventory as dirty for persistence
  playerState.markInventoryDirty();
  
  // Get items at each slot after swap
  const newItem1 = inventoryManager.getSlot(slot2);
  const newItem2 = inventoryManager.getSlot(slot1);
  
  // Send success response
  ctx.enqueueUserMessage(userId, GameAction.ReorganizedInventorySlots, buildReorganizedInventorySlotsPayload({
    Menu: InventoryMenuType.PlayerInventory,
    Slot1: slot1,
    ItemID1: newItem1 ? newItem1[0] : -1,
    IsIOU1: newItem1 ? newItem1[2] === 1 : false,
    Slot2: slot2,
    ItemID2: newItem2 ? newItem2[0] : -1,
    IsIOU2: newItem2 ? newItem2[2] === 1 : false,
    Type: reorganizeType,
    Success: true,
  }));
}

/**
 * Sends a failure response for reorganize operation
 */
function sendReorganizeFailure(
  ctx: ActionContext,
  menuType: number,
  slot1: number,
  slot2: number,
  reorganizeType: number
): void {
  ctx.enqueueUserMessage(ctx.userId!, GameAction.ReorganizedInventorySlots, buildReorganizedInventorySlotsPayload({
    Menu: menuType,
    Slot1: slot1,
    ItemID1: -1,
    IsIOU1: false,
    Slot2: slot2,
    ItemID2: -1,
    IsIOU2: false,
    Type: reorganizeType,
    Success: false,
  }));
}
