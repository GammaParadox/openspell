import { assertIsArray, type PacketArray } from "../../codec/arrayCodec";
import { StartedShoppingFields } from "../../fields/actions/StartedShoppingFields";

/** Auto-generated from `apps/game/gameActionFactory.js` (StartedShopping) */
export type StartedShoppingPayload = {
  ShopID: unknown;
  EntityID: unknown;
  CurrentStock: unknown;
};

export function decodeStartedShoppingPayload(payload: unknown): StartedShoppingPayload {
  assertIsArray(payload, "StartedShopping payload");
  const arr = payload as PacketArray;
  return {
    ShopID: arr[StartedShoppingFields.ShopID] as any,
    EntityID: arr[StartedShoppingFields.EntityID] as any,
    CurrentStock: arr[StartedShoppingFields.CurrentStock] as any,
  };
}

export function buildStartedShoppingPayload(data: StartedShoppingPayload): unknown[] {
  const arr: unknown[] = new Array(3);
  arr[StartedShoppingFields.ShopID] = data.ShopID;
  arr[StartedShoppingFields.EntityID] = data.EntityID;
  arr[StartedShoppingFields.CurrentStock] = data.CurrentStock;
  return arr;
}
