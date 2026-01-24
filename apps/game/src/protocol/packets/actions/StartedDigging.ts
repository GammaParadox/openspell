import { assertIsArray, type PacketArray } from "../../codec/arrayCodec";
import { StartedDiggingFields } from "../../fields/actions/StartedDiggingFields";

/** Auto-generated from `apps/game/gameActionFactory.js` (StartedDigging) */
export type StartedDiggingPayload = {
  EntityID: unknown;
};

export function decodeStartedDiggingPayload(payload: unknown): StartedDiggingPayload {
  assertIsArray(payload, "StartedDigging payload");
  const arr = payload as PacketArray;
  return {
    EntityID: arr[StartedDiggingFields.EntityID] as any,
  };
}

export function buildStartedDiggingPayload(data: StartedDiggingPayload): unknown[] {
  const arr: unknown[] = new Array(1);
  arr[StartedDiggingFields.EntityID] = data.EntityID;
  return arr;
}
