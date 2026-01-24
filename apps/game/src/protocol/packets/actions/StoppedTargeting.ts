import { assertIsArray, type PacketArray } from "../../codec/arrayCodec";
import { StoppedTargetingFields } from "../../fields/actions/StoppedTargetingFields";

/** Auto-generated from `apps/game/gameActionFactory.js` (StoppedTargeting) */
export type StoppedTargetingPayload = {
  EntityID: unknown;
  EntityType: unknown;
};

export function decodeStoppedTargetingPayload(payload: unknown): StoppedTargetingPayload {
  assertIsArray(payload, "StoppedTargeting payload");
  const arr = payload as PacketArray;
  return {
    EntityID: arr[StoppedTargetingFields.EntityID] as any,
    EntityType: arr[StoppedTargetingFields.EntityType] as any,
  };
}

export function buildStoppedTargetingPayload(data: StoppedTargetingPayload): unknown[] {
  const arr: unknown[] = new Array(2);
  arr[StoppedTargetingFields.EntityID] = data.EntityID;
  arr[StoppedTargetingFields.EntityType] = data.EntityType;
  return arr;
}
