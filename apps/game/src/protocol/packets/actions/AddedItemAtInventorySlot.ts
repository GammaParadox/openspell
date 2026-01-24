import { assertIsArray, type PacketArray } from "../../codec/arrayCodec";
import { AddedItemAtInventorySlotFields } from "../../fields/actions/AddedItemAtInventorySlotFields";

/** Auto-generated from `apps/game/gameActionFactory.js` (AddedItemAtInventorySlot) */
export type AddedItemAtInventorySlotPayload = {
  MenuType: unknown;
  Slot: unknown;
  ItemID: unknown;
  Amount: unknown;
  IsIOU: boolean;
  PreviousAmountAtSlot: unknown;
};

export function decodeAddedItemAtInventorySlotPayload(payload: unknown): AddedItemAtInventorySlotPayload {
  assertIsArray(payload, "AddedItemAtInventorySlot payload");
  const arr = payload as PacketArray;
  return {
    MenuType: arr[AddedItemAtInventorySlotFields.MenuType] as any,
    Slot: arr[AddedItemAtInventorySlotFields.Slot] as any,
    ItemID: arr[AddedItemAtInventorySlotFields.ItemID] as any,
    Amount: arr[AddedItemAtInventorySlotFields.Amount] as any,
    IsIOU: arr[AddedItemAtInventorySlotFields.IsIOU] as any,
    PreviousAmountAtSlot: arr[AddedItemAtInventorySlotFields.PreviousAmountAtSlot] as any,
  };
}

export function buildAddedItemAtInventorySlotPayload(data: AddedItemAtInventorySlotPayload): unknown[] {
  const arr: unknown[] = new Array(6);
  arr[AddedItemAtInventorySlotFields.MenuType] = data.MenuType;
  arr[AddedItemAtInventorySlotFields.Slot] = data.Slot;
  arr[AddedItemAtInventorySlotFields.ItemID] = data.ItemID;
  arr[AddedItemAtInventorySlotFields.Amount] = data.Amount;
  arr[AddedItemAtInventorySlotFields.IsIOU] = data.IsIOU ? 1 : 0;
  arr[AddedItemAtInventorySlotFields.PreviousAmountAtSlot] = data.PreviousAmountAtSlot;
  return arr;
}
