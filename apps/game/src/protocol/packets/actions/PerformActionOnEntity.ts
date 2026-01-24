import { assertIsArray, type PacketArray } from "../../codec/arrayCodec";
import { PerformActionOnEntityFields } from "../../fields/actions/PerformActionOnEntityFields";

/** Auto-generated from `apps/game/gameActionFactory.js` (PerformActionOnEntity) */
export type PerformActionOnEntityPayload = {
  TargetAction: unknown;
  EntityType: unknown;
  EntityID: unknown;
};

export function decodePerformActionOnEntityPayload(payload: unknown): PerformActionOnEntityPayload {
  assertIsArray(payload, "PerformActionOnEntity payload");
  const arr = payload as PacketArray;
  return {
    TargetAction: arr[PerformActionOnEntityFields.TargetAction] as any,
    EntityType: arr[PerformActionOnEntityFields.EntityType] as any,
    EntityID: arr[PerformActionOnEntityFields.EntityID] as any,
  };
}

export function buildPerformActionOnEntityPayload(data: PerformActionOnEntityPayload): unknown[] {
  const arr: unknown[] = new Array(3);
  arr[PerformActionOnEntityFields.TargetAction] = data.TargetAction;
  arr[PerformActionOnEntityFields.EntityType] = data.EntityType;
  arr[PerformActionOnEntityFields.EntityID] = data.EntityID;
  return arr;
}
