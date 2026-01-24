import { assertIsArray, type PacketArray } from "../../codec/arrayCodec";
import { EntityExitedChunkFields } from "../../fields/actions/EntityExitedChunkFields";

/** Auto-generated from `apps/game/gameActionFactory.js` (EntityExitedChunk) */
export type EntityExitedChunkPayload = {
  EntityID: unknown;
  EntityType: unknown;
};

export function decodeEntityExitedChunkPayload(payload: unknown): EntityExitedChunkPayload {
  assertIsArray(payload, "EntityExitedChunk payload");
  const arr = payload as PacketArray;
  return {
    EntityID: arr[EntityExitedChunkFields.EntityID] as any,
    EntityType: arr[EntityExitedChunkFields.EntityType] as any,
  };
}

export function buildEntityExitedChunkPayload(data: EntityExitedChunkPayload): unknown[] {
  const arr: unknown[] = new Array(2);
  arr[EntityExitedChunkFields.EntityID] = data.EntityID;
  arr[EntityExitedChunkFields.EntityType] = data.EntityType;
  return arr;
}
