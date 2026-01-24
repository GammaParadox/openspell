import { assertIsArray, type PacketArray } from "../../codec/arrayCodec";
import { CreatedUseItemOnItemActionItemsFields } from "../../fields/actions/CreatedUseItemOnItemActionItemsFields";

/** Auto-generated from `apps/game/gameActionFactory.js` (CreatedUseItemOnItemActionItems) */
export type CreatedUseItemOnItemActionItemsPayload = {
  UseItemID: unknown;
  UsedItemOnID: unknown;
  UseItemOnItemIndex: unknown;
};

export function decodeCreatedUseItemOnItemActionItemsPayload(payload: unknown): CreatedUseItemOnItemActionItemsPayload {
  assertIsArray(payload, "CreatedUseItemOnItemActionItems payload");
  const arr = payload as PacketArray;
  return {
    UseItemID: arr[CreatedUseItemOnItemActionItemsFields.UseItemID] as any,
    UsedItemOnID: arr[CreatedUseItemOnItemActionItemsFields.UsedItemOnID] as any,
    UseItemOnItemIndex: arr[CreatedUseItemOnItemActionItemsFields.UseItemOnItemIndex] as any,
  };
}

export function buildCreatedUseItemOnItemActionItemsPayload(data: CreatedUseItemOnItemActionItemsPayload): unknown[] {
  const arr: unknown[] = new Array(3);
  arr[CreatedUseItemOnItemActionItemsFields.UseItemID] = data.UseItemID;
  arr[CreatedUseItemOnItemActionItemsFields.UsedItemOnID] = data.UsedItemOnID;
  arr[CreatedUseItemOnItemActionItemsFields.UseItemOnItemIndex] = data.UseItemOnItemIndex;
  return arr;
}
