import { assertIsArray, type PacketArray } from "../../codec/arrayCodec";
import { StoppedShoppingFields } from "../../fields/actions/StoppedShoppingFields";

/** Auto-generated from `apps/game/gameActionFactory.js` (StoppedShopping) */
export type StoppedShoppingPayload = {
  ShopID: unknown;
  EntityID: unknown;
};

export function decodeStoppedShoppingPayload(payload: unknown): StoppedShoppingPayload {
  assertIsArray(payload, "StoppedShopping payload");
  const arr = payload as PacketArray;
  return {
    ShopID: arr[StoppedShoppingFields.ShopID] as any,
    EntityID: arr[StoppedShoppingFields.EntityID] as any,
  };
}

export function buildStoppedShoppingPayload(data: StoppedShoppingPayload): unknown[] {
  const arr: unknown[] = new Array(2);
  arr[StoppedShoppingFields.ShopID] = data.ShopID;
  arr[StoppedShoppingFields.EntityID] = data.EntityID;
  return arr;
}
