import { assertIsArray, type PacketArray } from "../../codec/arrayCodec";
import { RemovedItemFromInventoryAtSlotFields } from "../../fields/actions/RemovedItemFromInventoryAtSlotFields";

/** Auto-generated from `apps/game/gameActionFactory.js` (RemovedItemFromInventoryAtSlot) */
export type RemovedItemFromInventoryAtSlotPayload = {
  MenuType: unknown;
  Slot: unknown;
  ItemID: unknown;
  Amount: unknown;
  IsIOU: boolean;
  RemainingAmountAtSlot: unknown;
};

export function decodeRemovedItemFromInventoryAtSlotPayload(payload: unknown): RemovedItemFromInventoryAtSlotPayload {
  assertIsArray(payload, "RemovedItemFromInventoryAtSlot payload");
  const arr = payload as PacketArray;
  return {
    MenuType: arr[RemovedItemFromInventoryAtSlotFields.MenuType] as any,
    Slot: arr[RemovedItemFromInventoryAtSlotFields.Slot] as any,
    ItemID: arr[RemovedItemFromInventoryAtSlotFields.ItemID] as any,
    Amount: arr[RemovedItemFromInventoryAtSlotFields.Amount] as any,
    IsIOU: arr[RemovedItemFromInventoryAtSlotFields.IsIOU] as any,
    RemainingAmountAtSlot: arr[RemovedItemFromInventoryAtSlotFields.RemainingAmountAtSlot] as any,
  };
}

export function buildRemovedItemFromInventoryAtSlotPayload(data: RemovedItemFromInventoryAtSlotPayload): unknown[] {
  const arr: unknown[] = new Array(6);
  arr[RemovedItemFromInventoryAtSlotFields.MenuType] = data.MenuType;
  arr[RemovedItemFromInventoryAtSlotFields.Slot] = data.Slot;
  arr[RemovedItemFromInventoryAtSlotFields.ItemID] = data.ItemID;
  arr[RemovedItemFromInventoryAtSlotFields.Amount] = data.Amount;
  arr[RemovedItemFromInventoryAtSlotFields.IsIOU] = data.IsIOU ? 1 : 0;
  arr[RemovedItemFromInventoryAtSlotFields.RemainingAmountAtSlot] = data.RemainingAmountAtSlot;
  return arr;
}
