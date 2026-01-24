import { assertIsArray, type PacketArray } from "../../codec/arrayCodec";
import { UsedItemOnItemFields } from "../../fields/actions/UsedItemOnItemFields";

/** Auto-generated from `apps/game/gameActionFactory.js` (UsedItemOnItem) */
export type UsedItemOnItemPayload = {
  MenuType: unknown;
  UsingItemSlot: unknown;
  UsingItemID: unknown;
  UsingItemIsIOU: boolean;
  TargetItemSlot: unknown;
  TargetItemID: unknown;
  TargetItemIsIOU: boolean;
  ItemOnItemActionResultIndex: unknown;
  AmountToCreate: unknown;
  Success: boolean;
};

export function decodeUsedItemOnItemPayload(payload: unknown): UsedItemOnItemPayload {
  assertIsArray(payload, "UsedItemOnItem payload");
  const arr = payload as PacketArray;
  return {
    MenuType: arr[UsedItemOnItemFields.MenuType] as any,
    UsingItemSlot: arr[UsedItemOnItemFields.UsingItemSlot] as any,
    UsingItemID: arr[UsedItemOnItemFields.UsingItemID] as any,
    UsingItemIsIOU: arr[UsedItemOnItemFields.UsingItemIsIOU] as any,
    TargetItemSlot: arr[UsedItemOnItemFields.TargetItemSlot] as any,
    TargetItemID: arr[UsedItemOnItemFields.TargetItemID] as any,
    TargetItemIsIOU: arr[UsedItemOnItemFields.TargetItemIsIOU] as any,
    ItemOnItemActionResultIndex: arr[UsedItemOnItemFields.ItemOnItemActionResultIndex] as any,
    AmountToCreate: arr[UsedItemOnItemFields.AmountToCreate] as any,
    Success: arr[UsedItemOnItemFields.Success] as any,
  };
}

export function buildUsedItemOnItemPayload(data: UsedItemOnItemPayload): unknown[] {
  const arr: unknown[] = new Array(10);
  arr[UsedItemOnItemFields.MenuType] = data.MenuType;
  arr[UsedItemOnItemFields.UsingItemSlot] = data.UsingItemSlot;
  arr[UsedItemOnItemFields.UsingItemID] = data.UsingItemID;
  arr[UsedItemOnItemFields.UsingItemIsIOU] = data.UsingItemIsIOU ? 1 : 0;
  arr[UsedItemOnItemFields.TargetItemSlot] = data.TargetItemSlot;
  arr[UsedItemOnItemFields.TargetItemID] = data.TargetItemID;
  arr[UsedItemOnItemFields.TargetItemIsIOU] = data.TargetItemIsIOU ? 1 : 0;
  arr[UsedItemOnItemFields.ItemOnItemActionResultIndex] = data.ItemOnItemActionResultIndex;
  arr[UsedItemOnItemFields.AmountToCreate] = data.AmountToCreate;
  arr[UsedItemOnItemFields.Success] = data.Success ? 1 : 0;
  return arr;
}
