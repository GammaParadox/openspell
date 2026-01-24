import { assertIsArray, type PacketArray } from "../../codec/arrayCodec";
import { StoppedDiggingFields } from "../../fields/actions/StoppedDiggingFields";

/** Auto-generated from `apps/game/gameActionFactory.js` (StoppedDigging) */
export type StoppedDiggingPayload = {
  EntityID: unknown;
};

export function decodeStoppedDiggingPayload(payload: unknown): StoppedDiggingPayload {
  assertIsArray(payload, "StoppedDigging payload");
  const arr = payload as PacketArray;
  return {
    EntityID: arr[StoppedDiggingFields.EntityID] as any,
  };
}

export function buildStoppedDiggingPayload(data: StoppedDiggingPayload): unknown[] {
  const arr: unknown[] = new Array(1);
  arr[StoppedDiggingFields.EntityID] = data.EntityID;
  return arr;
}
