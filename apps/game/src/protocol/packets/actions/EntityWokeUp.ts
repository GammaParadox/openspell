import { assertIsArray, type PacketArray } from "../../codec/arrayCodec";
import { EntityWokeUpFields } from "../../fields/actions/EntityWokeUpFields";

/** Auto-generated from `apps/game/gameActionFactory.js` (EntityWokeUp) */
export type EntityWokeUpPayload = {
  EntityID: unknown;
  EntityType: unknown;
};

export function decodeEntityWokeUpPayload(payload: unknown): EntityWokeUpPayload {
  assertIsArray(payload, "EntityWokeUp payload");
  const arr = payload as PacketArray;
  return {
    EntityID: arr[EntityWokeUpFields.EntityID] as any,
    EntityType: arr[EntityWokeUpFields.EntityType] as any,
  };
}

export function buildEntityWokeUpPayload(data: EntityWokeUpPayload): unknown[] {
  const arr: unknown[] = new Array(2);
  arr[EntityWokeUpFields.EntityID] = data.EntityID;
  arr[EntityWokeUpFields.EntityType] = data.EntityType;
  return arr;
}
