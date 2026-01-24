import { assertIsArray, type PacketArray } from "../../codec/arrayCodec";
import { ShookTreeFields } from "../../fields/actions/ShookTreeFields";

/** Auto-generated from `apps/game/gameActionFactory.js` (ShookTree) */
export type ShookTreePayload = {
  TreeShakerEntityID: unknown;
  TreeShakerEntityType: unknown;
  TreeID: unknown;
};

export function decodeShookTreePayload(payload: unknown): ShookTreePayload {
  assertIsArray(payload, "ShookTree payload");
  const arr = payload as PacketArray;
  return {
    TreeShakerEntityID: arr[ShookTreeFields.TreeShakerEntityID] as any,
    TreeShakerEntityType: arr[ShookTreeFields.TreeShakerEntityType] as any,
    TreeID: arr[ShookTreeFields.TreeID] as any,
  };
}

export function buildShookTreePayload(data: ShookTreePayload): unknown[] {
  const arr: unknown[] = new Array(3);
  arr[ShookTreeFields.TreeShakerEntityID] = data.TreeShakerEntityID;
  arr[ShookTreeFields.TreeShakerEntityType] = data.TreeShakerEntityType;
  arr[ShookTreeFields.TreeID] = data.TreeID;
  return arr;
}
