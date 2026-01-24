import { assertIsArray, type PacketArray } from "../../codec/arrayCodec";
import { UseItemOnEntityFields } from "../../fields/actions/UseItemOnEntityFields";

/** Auto-generated from `apps/game/gameActionFactory.js` (UseItemOnEntity) */
export type UseItemOnEntityPayload = {
  ItemID: unknown;
  EntityType: unknown;
  EntityID: unknown;
};

export function decodeUseItemOnEntityPayload(payload: unknown): UseItemOnEntityPayload {
  assertIsArray(payload, "UseItemOnEntity payload");
  const arr = payload as PacketArray;
  return {
    ItemID: arr[UseItemOnEntityFields.ItemID] as any,
    EntityType: arr[UseItemOnEntityFields.EntityType] as any,
    EntityID: arr[UseItemOnEntityFields.EntityID] as any,
  };
}

export function buildUseItemOnEntityPayload(data: UseItemOnEntityPayload): unknown[] {
  const arr: unknown[] = new Array(3);
  arr[UseItemOnEntityFields.ItemID] = data.ItemID;
  arr[UseItemOnEntityFields.EntityType] = data.EntityType;
  arr[UseItemOnEntityFields.EntityID] = data.EntityID;
  return arr;
}
