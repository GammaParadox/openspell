import { assertIsArray, type PacketArray } from "../../codec/arrayCodec";
import { EntityStunnedFields } from "../../fields/actions/EntityStunnedFields";

/** Auto-generated from `apps/game/gameActionFactory.js` (EntityStunned) */
export type EntityStunnedPayload = {
  EntityID: unknown;
  EntityType: unknown;
  StunTicks: unknown;
};

export function decodeEntityStunnedPayload(payload: unknown): EntityStunnedPayload {
  assertIsArray(payload, "EntityStunned payload");
  const arr = payload as PacketArray;
  return {
    EntityID: arr[EntityStunnedFields.EntityID] as any,
    EntityType: arr[EntityStunnedFields.EntityType] as any,
    StunTicks: arr[EntityStunnedFields.StunTicks] as any,
  };
}

export function buildEntityStunnedPayload(data: EntityStunnedPayload): unknown[] {
  const arr: unknown[] = new Array(3);
  arr[EntityStunnedFields.EntityID] = data.EntityID;
  arr[EntityStunnedFields.EntityType] = data.EntityType;
  arr[EntityStunnedFields.StunTicks] = data.StunTicks;
  return arr;
}
