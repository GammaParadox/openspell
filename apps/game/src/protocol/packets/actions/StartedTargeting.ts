import { assertIsArray, type PacketArray } from "../../codec/arrayCodec";
import { StartedTargetingFields } from "../../fields/actions/StartedTargetingFields";

/** Auto-generated from `apps/game/gameActionFactory.js` (StartedTargeting) */
export type StartedTargetingPayload = {
  EntityID: unknown;
  EntityType: unknown;
  TargetID: unknown;
  TargetType: unknown;
};

export function decodeStartedTargetingPayload(payload: unknown): StartedTargetingPayload {
  assertIsArray(payload, "StartedTargeting payload");
  const arr = payload as PacketArray;
  return {
    EntityID: arr[StartedTargetingFields.EntityID] as any,
    EntityType: arr[StartedTargetingFields.EntityType] as any,
    TargetID: arr[StartedTargetingFields.TargetID] as any,
    TargetType: arr[StartedTargetingFields.TargetType] as any,
  };
}

export function buildStartedTargetingPayload(data: StartedTargetingPayload): unknown[] {
  const arr: unknown[] = new Array(4);
  arr[StartedTargetingFields.EntityID] = data.EntityID;
  arr[StartedTargetingFields.EntityType] = data.EntityType;
  arr[StartedTargetingFields.TargetID] = data.TargetID;
  arr[StartedTargetingFields.TargetType] = data.TargetType;
  return arr;
}
