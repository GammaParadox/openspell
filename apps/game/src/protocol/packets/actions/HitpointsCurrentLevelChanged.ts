import { assertIsArray, type PacketArray } from "../../codec/arrayCodec";
import { HitpointsCurrentLevelChangedFields } from "../../fields/actions/HitpointsCurrentLevelChangedFields";

/** Auto-generated from `apps/game/gameActionFactory.js` (HitpointsCurrentLevelChanged) */
export type HitpointsCurrentLevelChangedPayload = {
  EntityType: unknown;
  EntityID: unknown;
  CurrentHealth: unknown;
};

export function decodeHitpointsCurrentLevelChangedPayload(payload: unknown): HitpointsCurrentLevelChangedPayload {
  assertIsArray(payload, "HitpointsCurrentLevelChanged payload");
  const arr = payload as PacketArray;
  return {
    EntityType: arr[HitpointsCurrentLevelChangedFields.EntityType] as any,
    EntityID: arr[HitpointsCurrentLevelChangedFields.EntityID] as any,
    CurrentHealth: arr[HitpointsCurrentLevelChangedFields.CurrentHealth] as any,
  };
}

export function buildHitpointsCurrentLevelChangedPayload(data: HitpointsCurrentLevelChangedPayload): unknown[] {
  const arr: unknown[] = new Array(3);
  arr[HitpointsCurrentLevelChangedFields.EntityType] = data.EntityType;
  arr[HitpointsCurrentLevelChangedFields.EntityID] = data.EntityID;
  arr[HitpointsCurrentLevelChangedFields.CurrentHealth] = data.CurrentHealth;
  return arr;
}
