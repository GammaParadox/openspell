import { assertIsArray, type PacketArray } from "../../codec/arrayCodec";
import { UsedItemOnEntityFields } from "../../fields/actions/UsedItemOnEntityFields";

/** Auto-generated from `apps/game/gameActionFactory.js` (UsedItemOnEntity) */
export type UsedItemOnEntityPayload = {
  EntityID: unknown;
  EntityType: unknown;
  TargetEntityID: unknown;
  TargetEntityType: unknown;
  ItemID: unknown;
  Success: boolean;
};

export function decodeUsedItemOnEntityPayload(payload: unknown): UsedItemOnEntityPayload {
  assertIsArray(payload, "UsedItemOnEntity payload");
  const arr = payload as PacketArray;
  return {
    EntityID: arr[UsedItemOnEntityFields.EntityID] as any,
    EntityType: arr[UsedItemOnEntityFields.EntityType] as any,
    TargetEntityID: arr[UsedItemOnEntityFields.TargetEntityID] as any,
    TargetEntityType: arr[UsedItemOnEntityFields.TargetEntityType] as any,
    ItemID: arr[UsedItemOnEntityFields.ItemID] as any,
    Success: arr[UsedItemOnEntityFields.Success] as any,
  };
}

export function buildUsedItemOnEntityPayload(data: UsedItemOnEntityPayload): unknown[] {
  const arr: unknown[] = new Array(6);
  arr[UsedItemOnEntityFields.EntityID] = data.EntityID;
  arr[UsedItemOnEntityFields.EntityType] = data.EntityType;
  arr[UsedItemOnEntityFields.TargetEntityID] = data.TargetEntityID;
  arr[UsedItemOnEntityFields.TargetEntityType] = data.TargetEntityType;
  arr[UsedItemOnEntityFields.ItemID] = data.ItemID;
  arr[UsedItemOnEntityFields.Success] = data.Success ? 1 : 0;
  return arr;
}
