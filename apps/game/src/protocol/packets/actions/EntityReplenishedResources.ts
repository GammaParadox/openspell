import { assertIsArray, type PacketArray } from "../../codec/arrayCodec";
import { EntityReplenishedResourcesFields } from "../../fields/actions/EntityReplenishedResourcesFields";

/** Auto-generated from `apps/game/gameActionFactory.js` (EntityReplenishedResources) */
export type EntityReplenishedResourcesPayload = {
  EntityTypeID: unknown;
};

export function decodeEntityReplenishedResourcesPayload(payload: unknown): EntityReplenishedResourcesPayload {
  assertIsArray(payload, "EntityReplenishedResources payload");
  const arr = payload as PacketArray;
  return {
    EntityTypeID: arr[EntityReplenishedResourcesFields.EntityTypeID] as any,
  };
}

export function buildEntityReplenishedResourcesPayload(data: EntityReplenishedResourcesPayload): unknown[] {
  const arr: unknown[] = new Array(1);
  arr[EntityReplenishedResourcesFields.EntityTypeID] = data.EntityTypeID;
  return arr;
}
