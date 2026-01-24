import { assertIsArray, type PacketArray } from "../../codec/arrayCodec";
import { InvokeInventoryItemActionFields } from "../../fields/actions/InvokeInventoryItemActionFields";

/** Auto-generated from `apps/game/gameActionFactory.js` (InvokeInventoryItemAction) */
export type InvokeInventoryItemActionPayload = {
  Action: unknown;
  MenuType: unknown;
  Slot: unknown;
  ItemID: unknown;
  Amount: unknown;
  IsIOU: boolean;
};

export function decodeInvokeInventoryItemActionPayload(payload: unknown): InvokeInventoryItemActionPayload {
  assertIsArray(payload, "InvokeInventoryItemAction payload");
  const arr = payload as PacketArray;
  return {
    Action: arr[InvokeInventoryItemActionFields.Action] as any,
    MenuType: arr[InvokeInventoryItemActionFields.MenuType] as any,
    Slot: arr[InvokeInventoryItemActionFields.Slot] as any,
    ItemID: arr[InvokeInventoryItemActionFields.ItemID] as any,
    Amount: arr[InvokeInventoryItemActionFields.Amount] as any,
    IsIOU: arr[InvokeInventoryItemActionFields.IsIOU] as any,
  };
}

export function buildInvokeInventoryItemActionPayload(data: InvokeInventoryItemActionPayload): unknown[] {
  const arr: unknown[] = new Array(6);
  arr[InvokeInventoryItemActionFields.Action] = data.Action;
  arr[InvokeInventoryItemActionFields.MenuType] = data.MenuType;
  arr[InvokeInventoryItemActionFields.Slot] = data.Slot;
  arr[InvokeInventoryItemActionFields.ItemID] = data.ItemID;
  arr[InvokeInventoryItemActionFields.Amount] = data.Amount;
  arr[InvokeInventoryItemActionFields.IsIOU] = data.IsIOU ? 1 : 0;
  return arr;
}
