import { assertIsArray, type PacketArray } from "../../codec/arrayCodec";
import { UnequippedItemFields } from "../../fields/actions/UnequippedItemFields";

/** Auto-generated from `apps/game/gameActionFactory.js` (UnequippedItem) */
export type UnequippedItemPayload = {
  PlayerEntityID: unknown;
  ItemID: unknown;
};

export function decodeUnequippedItemPayload(payload: unknown): UnequippedItemPayload {
  assertIsArray(payload, "UnequippedItem payload");
  const arr = payload as PacketArray;
  return {
    PlayerEntityID: arr[UnequippedItemFields.PlayerEntityID] as any,
    ItemID: arr[UnequippedItemFields.ItemID] as any,
  };
}

export function buildUnequippedItemPayload(data: UnequippedItemPayload): unknown[] {
  const arr: unknown[] = new Array(2);
  arr[UnequippedItemFields.PlayerEntityID] = data.PlayerEntityID;
  arr[UnequippedItemFields.ItemID] = data.ItemID;
  return arr;
}
