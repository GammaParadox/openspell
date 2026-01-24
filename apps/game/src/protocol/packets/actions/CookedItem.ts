import { assertIsArray, type PacketArray } from "../../codec/arrayCodec";
import { CookedItemFields } from "../../fields/actions/CookedItemFields";

/** Auto-generated from `apps/game/gameActionFactory.js` (CookedItem) */
export type CookedItemPayload = {
  ItemID: unknown;
};

export function decodeCookedItemPayload(payload: unknown): CookedItemPayload {
  assertIsArray(payload, "CookedItem payload");
  const arr = payload as PacketArray;
  return {
    ItemID: arr[CookedItemFields.ItemID] as any,
  };
}

export function buildCookedItemPayload(data: CookedItemPayload): unknown[] {
  const arr: unknown[] = new Array(1);
  arr[CookedItemFields.ItemID] = data.ItemID;
  return arr;
}
