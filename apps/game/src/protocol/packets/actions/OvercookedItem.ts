import { assertIsArray, type PacketArray } from "../../codec/arrayCodec";
import { OvercookedItemFields } from "../../fields/actions/OvercookedItemFields";

/** Auto-generated from `apps/game/gameActionFactory.js` (OvercookedItem) */
export type OvercookedItemPayload = {
  ItemID: unknown;
};

export function decodeOvercookedItemPayload(payload: unknown): OvercookedItemPayload {
  assertIsArray(payload, "OvercookedItem payload");
  const arr = payload as PacketArray;
  return {
    ItemID: arr[OvercookedItemFields.ItemID] as any,
  };
}

export function buildOvercookedItemPayload(data: OvercookedItemPayload): unknown[] {
  const arr: unknown[] = new Array(1);
  arr[OvercookedItemFields.ItemID] = data.ItemID;
  return arr;
}
