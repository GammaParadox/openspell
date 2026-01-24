import { assertIsArray, type PacketArray } from "../../codec/arrayCodec";
import { EntitySleepingFields } from "../../fields/actions/EntitySleepingFields";

/** Auto-generated from `apps/game/gameActionFactory.js` (EntitySleeping) */
export type EntitySleepingPayload = {
  WorldEntityID: unknown;
  EntityID: unknown;
  EntityType: unknown;
  FeetX: unknown;
  FeetY: unknown;
  HeadX: unknown;
  HeadY: unknown;
};

export function decodeEntitySleepingPayload(payload: unknown): EntitySleepingPayload {
  assertIsArray(payload, "EntitySleeping payload");
  const arr = payload as PacketArray;
  return {
    WorldEntityID: arr[EntitySleepingFields.WorldEntityID] as any,
    EntityID: arr[EntitySleepingFields.EntityID] as any,
    EntityType: arr[EntitySleepingFields.EntityType] as any,
    FeetX: arr[EntitySleepingFields.FeetX] as any,
    FeetY: arr[EntitySleepingFields.FeetY] as any,
    HeadX: arr[EntitySleepingFields.HeadX] as any,
    HeadY: arr[EntitySleepingFields.HeadY] as any,
  };
}

export function buildEntitySleepingPayload(data: EntitySleepingPayload): unknown[] {
  const arr: unknown[] = new Array(7);
  arr[EntitySleepingFields.WorldEntityID] = data.WorldEntityID;
  arr[EntitySleepingFields.EntityID] = data.EntityID;
  arr[EntitySleepingFields.EntityType] = data.EntityType;
  arr[EntitySleepingFields.FeetX] = data.FeetX;
  arr[EntitySleepingFields.FeetY] = data.FeetY;
  arr[EntitySleepingFields.HeadX] = data.HeadX;
  arr[EntitySleepingFields.HeadY] = data.HeadY;
  return arr;
}
