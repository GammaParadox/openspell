import { assertIsArray, type PacketArray } from "../../codec/arrayCodec";
import { EntityExhaustedResourcesFields } from "../../fields/actions/EntityExhaustedResourcesFields";

/** Auto-generated from `apps/game/gameActionFactory.js` (EntityExhaustedResources) */
export type EntityExhaustedResourcesPayload = {
  EntityTypeID: unknown;
};

export function decodeEntityExhaustedResourcesPayload(payload: unknown): EntityExhaustedResourcesPayload {
  assertIsArray(payload, "EntityExhaustedResources payload");
  const arr = payload as PacketArray;
  return {
    EntityTypeID: arr[EntityExhaustedResourcesFields.EntityTypeID] as any,
  };
}

export function buildEntityExhaustedResourcesPayload(data: EntityExhaustedResourcesPayload): unknown[] {
  const arr: unknown[] = new Array(1);
  arr[EntityExhaustedResourcesFields.EntityTypeID] = data.EntityTypeID;
  return arr;
}
