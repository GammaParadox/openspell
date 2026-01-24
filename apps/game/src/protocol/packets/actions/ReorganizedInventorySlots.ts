import { assertIsArray, type PacketArray } from "../../codec/arrayCodec";
import { ReorganizedInventorySlotsFields } from "../../fields/actions/ReorganizedInventorySlotsFields";

/** Auto-generated from `apps/game/gameActionFactory.js` (ReorganizedInventorySlots) */
export type ReorganizedInventorySlotsPayload = {
  Menu: unknown;
  Slot1: unknown;
  ItemID1: unknown;
  IsIOU1: boolean;
  Slot2: unknown;
  ItemID2: unknown;
  IsIOU2: boolean;
  Type: unknown;
  Success: boolean;
};

export function decodeReorganizedInventorySlotsPayload(payload: unknown): ReorganizedInventorySlotsPayload {
  assertIsArray(payload, "ReorganizedInventorySlots payload");
  const arr = payload as PacketArray;
  return {
    Menu: arr[ReorganizedInventorySlotsFields.Menu] as any,
    Slot1: arr[ReorganizedInventorySlotsFields.Slot1] as any,
    ItemID1: arr[ReorganizedInventorySlotsFields.ItemID1] as any,
    IsIOU1: arr[ReorganizedInventorySlotsFields.IsIOU1] as any,
    Slot2: arr[ReorganizedInventorySlotsFields.Slot2] as any,
    ItemID2: arr[ReorganizedInventorySlotsFields.ItemID2] as any,
    IsIOU2: arr[ReorganizedInventorySlotsFields.IsIOU2] as any,
    Type: arr[ReorganizedInventorySlotsFields.Type] as any,
    Success: arr[ReorganizedInventorySlotsFields.Success] as any,
  };
}

export function buildReorganizedInventorySlotsPayload(data: ReorganizedInventorySlotsPayload): unknown[] {
  const arr: unknown[] = new Array(9);
  arr[ReorganizedInventorySlotsFields.Menu] = data.Menu;
  arr[ReorganizedInventorySlotsFields.Slot1] = data.Slot1;
  arr[ReorganizedInventorySlotsFields.ItemID1] = data.ItemID1;
  arr[ReorganizedInventorySlotsFields.IsIOU1] = data.IsIOU1 ? 1 : 0;
  arr[ReorganizedInventorySlotsFields.Slot2] = data.Slot2;
  arr[ReorganizedInventorySlotsFields.ItemID2] = data.ItemID2;
  arr[ReorganizedInventorySlotsFields.IsIOU2] = data.IsIOU2 ? 1 : 0;
  arr[ReorganizedInventorySlotsFields.Type] = data.Type;
  arr[ReorganizedInventorySlotsFields.Success] = data.Success ? 1 : 0;
  return arr;
}
