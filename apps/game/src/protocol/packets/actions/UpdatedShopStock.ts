import { assertIsArray, type PacketArray } from "../../codec/arrayCodec";
import { UpdatedShopStockFields } from "../../fields/actions/UpdatedShopStockFields";

/** Auto-generated from `apps/game/gameActionFactory.js` (UpdatedShopStock) */
export type UpdatedShopStockPayload = {
  ItemID: unknown;
  Amount: unknown;
};

export function decodeUpdatedShopStockPayload(payload: unknown): UpdatedShopStockPayload {
  assertIsArray(payload, "UpdatedShopStock payload");
  const arr = payload as PacketArray;
  return {
    ItemID: arr[UpdatedShopStockFields.ItemID] as any,
    Amount: arr[UpdatedShopStockFields.Amount] as any,
  };
}

export function buildUpdatedShopStockPayload(data: UpdatedShopStockPayload): unknown[] {
  const arr: unknown[] = new Array(2);
  arr[UpdatedShopStockFields.ItemID] = data.ItemID;
  arr[UpdatedShopStockFields.Amount] = data.Amount;
  return arr;
}
