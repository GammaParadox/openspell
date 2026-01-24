import { assertIsArray, type PacketArray } from "../../codec/arrayCodec";
import { EnteredIdleStateFields } from "../../fields/actions/EnteredIdleStateFields";

/** Auto-generated from `apps/game/gameActionFactory.js` (EnteredIdleState) */
export type EnteredIdleStatePayload = {
  EntityID: unknown;
  EntityType: unknown;
};

export function decodeEnteredIdleStatePayload(payload: unknown): EnteredIdleStatePayload {
  assertIsArray(payload, "EnteredIdleState payload");
  const arr = payload as PacketArray;
  return {
    EntityID: arr[EnteredIdleStateFields.EntityID] as any,
    EntityType: arr[EnteredIdleStateFields.EntityType] as any,
  };
}

export function buildEnteredIdleStatePayload(data: EnteredIdleStatePayload): unknown[] {
  const arr: unknown[] = new Array(2);
  arr[EnteredIdleStateFields.EntityID] = data.EntityID;
  arr[EnteredIdleStateFields.EntityType] = data.EntityType;
  return arr;
}
