import { assertIsArray, type PacketArray } from "../../codec/arrayCodec";
import { UseItemOnItemFields } from "../../fields/actions/UseItemOnItemFields";

/** Auto-generated from `apps/game/gameActionFactory.js` (UseItemOnItem) */
export type UseItemOnItemPayload = {
  MenuType: unknown;
  UsingItemSlot: unknown;
  UsingItemID: unknown;
  UsingItemIsIOU: boolean;
  TargetItemSlot: unknown;
  TargetItemID: unknown;
  TargetItemIsIOU: boolean;
  ItemOnItemActionResultIndex: unknown;
  AmountToCreate: unknown;
};

export function decodeUseItemOnItemPayload(payload: unknown): UseItemOnItemPayload {
  assertIsArray(payload, "UseItemOnItem payload");
  const arr = payload as PacketArray;
  return {
    MenuType: arr[UseItemOnItemFields.MenuType] as any,
    UsingItemSlot: arr[UseItemOnItemFields.UsingItemSlot] as any,
    UsingItemID: arr[UseItemOnItemFields.UsingItemID] as any,
    UsingItemIsIOU: arr[UseItemOnItemFields.UsingItemIsIOU] as any,
    TargetItemSlot: arr[UseItemOnItemFields.TargetItemSlot] as any,
    TargetItemID: arr[UseItemOnItemFields.TargetItemID] as any,
    TargetItemIsIOU: arr[UseItemOnItemFields.TargetItemIsIOU] as any,
    ItemOnItemActionResultIndex: arr[UseItemOnItemFields.ItemOnItemActionResultIndex] as any,
    AmountToCreate: arr[UseItemOnItemFields.AmountToCreate] as any,
  };
}

export function buildUseItemOnItemPayload(data: UseItemOnItemPayload): unknown[] {
  const arr: unknown[] = new Array(9);
  arr[UseItemOnItemFields.MenuType] = data.MenuType;
  arr[UseItemOnItemFields.UsingItemSlot] = data.UsingItemSlot;
  arr[UseItemOnItemFields.UsingItemID] = data.UsingItemID;
  arr[UseItemOnItemFields.UsingItemIsIOU] = data.UsingItemIsIOU ? 1 : 0;
  arr[UseItemOnItemFields.TargetItemSlot] = data.TargetItemSlot;
  arr[UseItemOnItemFields.TargetItemID] = data.TargetItemID;
  arr[UseItemOnItemFields.TargetItemIsIOU] = data.TargetItemIsIOU ? 1 : 0;
  arr[UseItemOnItemFields.ItemOnItemActionResultIndex] = data.ItemOnItemActionResultIndex;
  arr[UseItemOnItemFields.AmountToCreate] = data.AmountToCreate;
  return arr;
}
