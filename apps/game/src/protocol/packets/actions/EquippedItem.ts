import { assertIsArray, type PacketArray } from "../../codec/arrayCodec";
import { EquippedItemFields } from "../../fields/actions/EquippedItemFields";

/** Auto-generated from `apps/game/gameActionFactory.js` (EquippedItem) */
export type EquippedItemPayload = {
  PlayerEntityID: unknown;
  ItemID: unknown;
};

export function decodeEquippedItemPayload(payload: unknown): EquippedItemPayload {
  assertIsArray(payload, "EquippedItem payload");
  const arr = payload as PacketArray;
  return {
    PlayerEntityID: arr[EquippedItemFields.PlayerEntityID] as any,
    ItemID: arr[EquippedItemFields.ItemID] as any,
  };
}

export function buildEquippedItemPayload(data: EquippedItemPayload): unknown[] {
  const arr: unknown[] = new Array(2);
  arr[EquippedItemFields.PlayerEntityID] = data.PlayerEntityID;
  arr[EquippedItemFields.ItemID] = data.ItemID;
  return arr;
}
