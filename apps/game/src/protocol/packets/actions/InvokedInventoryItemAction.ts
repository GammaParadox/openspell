import { assertIsArray, type PacketArray } from "../../codec/arrayCodec";
import { InvokedInventoryItemActionFields } from "../../fields/actions/InvokedInventoryItemActionFields";

/** Auto-generated from `apps/game/gameActionFactory.js` (InvokedInventoryItemAction) */
export type InvokedInventoryItemActionPayload = {
  Action: unknown;
  MenuType: unknown;
  Slot: unknown;
  ItemID: unknown;
  Amount: unknown;
  IsIOU: boolean;
  Success: boolean;
  Data: unknown;
};

export function decodeInvokedInventoryItemActionPayload(payload: unknown): InvokedInventoryItemActionPayload {
  assertIsArray(payload, "InvokedInventoryItemAction payload");
  const arr = payload as PacketArray;
  return {
    Action: arr[InvokedInventoryItemActionFields.Action] as any,
    MenuType: arr[InvokedInventoryItemActionFields.MenuType] as any,
    Slot: arr[InvokedInventoryItemActionFields.Slot] as any,
    ItemID: arr[InvokedInventoryItemActionFields.ItemID] as any,
    Amount: arr[InvokedInventoryItemActionFields.Amount] as any,
    IsIOU: arr[InvokedInventoryItemActionFields.IsIOU] as any,
    Success: arr[InvokedInventoryItemActionFields.Success] as any,
    Data: arr[InvokedInventoryItemActionFields.Data] as any,
  };
}

export function buildInvokedInventoryItemActionPayload(data: InvokedInventoryItemActionPayload): unknown[] {
  const arr: unknown[] = new Array(8);
  arr[InvokedInventoryItemActionFields.Action] = data.Action;
  arr[InvokedInventoryItemActionFields.MenuType] = data.MenuType;
  arr[InvokedInventoryItemActionFields.Slot] = data.Slot;
  arr[InvokedInventoryItemActionFields.ItemID] = data.ItemID;
  arr[InvokedInventoryItemActionFields.Amount] = data.Amount;
  arr[InvokedInventoryItemActionFields.IsIOU] = data.IsIOU ? 1 : 0;
  arr[InvokedInventoryItemActionFields.Success] = data.Success ? 1 : 0;
  arr[InvokedInventoryItemActionFields.Data] = data.Data;
  return arr;
}
