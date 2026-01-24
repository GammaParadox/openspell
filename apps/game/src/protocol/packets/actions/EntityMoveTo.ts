import { assertIsArray, type PacketArray } from "../../codec/arrayCodec";
import { EntityMoveToFields } from "../../fields/actions/EntityMoveToFields";

/** Auto-generated from `apps/game/gameActionFactory.js` (EntityMoveTo) */
export type EntityMoveToPayload = {
  EntityID: unknown;
  EntityType: unknown;
  X: unknown;
  Y: unknown;
};

export function decodeEntityMoveToPayload(payload: unknown): EntityMoveToPayload {
  assertIsArray(payload, "EntityMoveTo payload");
  const arr = payload as PacketArray;
  return {
    EntityID: arr[EntityMoveToFields.EntityID] as any,
    EntityType: arr[EntityMoveToFields.EntityType] as any,
    X: arr[EntityMoveToFields.X] as any,
    Y: arr[EntityMoveToFields.Y] as any,
  };
}

export function buildEntityMoveToPayload(data: EntityMoveToPayload): unknown[] {
  const arr: unknown[] = new Array(4);
  arr[EntityMoveToFields.EntityID] = data.EntityID;
  arr[EntityMoveToFields.EntityType] = data.EntityType;
  arr[EntityMoveToFields.X] = data.X;
  arr[EntityMoveToFields.Y] = data.Y;
  return arr;
}
