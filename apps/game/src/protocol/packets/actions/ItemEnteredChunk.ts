import { assertIsArray, type PacketArray } from "../../codec/arrayCodec";
import { ItemEnteredChunkFields } from "../../fields/actions/ItemEnteredChunkFields";

/** Auto-generated from `apps/game/gameActionFactory.js` (ItemEnteredChunk) */
export type ItemEnteredChunkPayload = {
  EntityID: unknown;
  ItemID: unknown;
  Amount: unknown;
  IsIOU: boolean;
  MapLevel: unknown;
  X: unknown;
  Y: unknown;
};

export function decodeItemEnteredChunkPayload(payload: unknown): ItemEnteredChunkPayload {
  assertIsArray(payload, "ItemEnteredChunk payload");
  const arr = payload as PacketArray;
  return {
    EntityID: arr[ItemEnteredChunkFields.EntityID] as any,
    ItemID: arr[ItemEnteredChunkFields.ItemID] as any,
    Amount: arr[ItemEnteredChunkFields.Amount] as any,
    IsIOU: arr[ItemEnteredChunkFields.IsIOU] as any,
    MapLevel: arr[ItemEnteredChunkFields.MapLevel] as any,
    X: arr[ItemEnteredChunkFields.X] as any,
    Y: arr[ItemEnteredChunkFields.Y] as any,
  };
}

export function buildItemEnteredChunkPayload(data: ItemEnteredChunkPayload): unknown[] {
  const arr: unknown[] = new Array(7);
  arr[ItemEnteredChunkFields.EntityID] = data.EntityID;
  arr[ItemEnteredChunkFields.ItemID] = data.ItemID;
  arr[ItemEnteredChunkFields.Amount] = data.Amount;
  arr[ItemEnteredChunkFields.IsIOU] = data.IsIOU ? 1 : 0;
  arr[ItemEnteredChunkFields.MapLevel] = data.MapLevel;
  arr[ItemEnteredChunkFields.X] = data.X;
  arr[ItemEnteredChunkFields.Y] = data.Y;
  return arr;
}
