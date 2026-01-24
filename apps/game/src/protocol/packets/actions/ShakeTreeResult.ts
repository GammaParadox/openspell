import { assertIsArray, type PacketArray } from "../../codec/arrayCodec";
import { ShakeTreeResultFields } from "../../fields/actions/ShakeTreeResultFields";

/** Auto-generated from `apps/game/gameActionFactory.js` (ShakeTreeResult) */
export type ShakeTreeResultPayload = {
  ItemID: unknown;
  IsRare: boolean;
};

export function decodeShakeTreeResultPayload(payload: unknown): ShakeTreeResultPayload {
  assertIsArray(payload, "ShakeTreeResult payload");
  const arr = payload as PacketArray;
  return {
    ItemID: arr[ShakeTreeResultFields.ItemID] as any,
    IsRare: arr[ShakeTreeResultFields.IsRare] as any,
  };
}

export function buildShakeTreeResultPayload(data: ShakeTreeResultPayload): unknown[] {
  const arr: unknown[] = new Array(2);
  arr[ShakeTreeResultFields.ItemID] = data.ItemID;
  arr[ShakeTreeResultFields.IsRare] = data.IsRare ? 1 : 0;
  return arr;
}
