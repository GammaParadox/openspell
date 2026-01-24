import { assertIsArray, type PacketArray } from "../../codec/arrayCodec";
import { PathfindingFailedFields } from "../../fields/actions/PathfindingFailedFields";

/** Auto-generated from `apps/game/gameActionFactory.js` (PathfindingFailed) */
export type PathfindingFailedPayload = {
  EntityID: unknown;
};

export function decodePathfindingFailedPayload(payload: unknown): PathfindingFailedPayload {
  assertIsArray(payload, "PathfindingFailed payload");
  const arr = payload as PacketArray;
  return {
    EntityID: arr[PathfindingFailedFields.EntityID] as any,
  };
}

export function buildPathfindingFailedPayload(data: PathfindingFailedPayload): unknown[] {
  const arr: unknown[] = new Array(1);
  arr[PathfindingFailedFields.EntityID] = data.EntityID;
  return arr;
}
