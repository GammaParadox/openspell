import { assertIsArray, type PacketArray } from "../../codec/arrayCodec";
import { ObtainedResourceFields } from "../../fields/actions/ObtainedResourceFields";

/** Auto-generated from `apps/game/gameActionFactory.js` (ObtainedResource) */
export type ObtainedResourcePayload = {
  ItemID: unknown;
};

export function decodeObtainedResourcePayload(payload: unknown): ObtainedResourcePayload {
  assertIsArray(payload, "ObtainedResource payload");
  const arr = payload as PacketArray;
  return {
    ItemID: arr[ObtainedResourceFields.ItemID] as any,
  };
}

export function buildObtainedResourcePayload(data: ObtainedResourcePayload): unknown[] {
  const arr: unknown[] = new Array(1);
  arr[ObtainedResourceFields.ItemID] = data.ItemID;
  return arr;
}
