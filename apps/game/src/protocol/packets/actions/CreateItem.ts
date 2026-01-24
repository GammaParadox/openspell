import { assertIsArray, type PacketArray } from "../../codec/arrayCodec";
import { CreateItemFields } from "../../fields/actions/CreateItemFields";

/** Auto-generated from `apps/game/gameActionFactory.js` (CreateItem) */
export type CreateItemPayload = {
  ItemID: unknown;
  Amount: unknown;
  MenuType: unknown;
};

export function decodeCreateItemPayload(payload: unknown): CreateItemPayload {
  assertIsArray(payload, "CreateItem payload");
  const arr = payload as PacketArray;
  return {
    ItemID: arr[CreateItemFields.ItemID] as any,
    Amount: arr[CreateItemFields.Amount] as any,
    MenuType: arr[CreateItemFields.MenuType] as any,
  };
}

export function buildCreateItemPayload(data: CreateItemPayload): unknown[] {
  const arr: unknown[] = new Array(3);
  arr[CreateItemFields.ItemID] = data.ItemID;
  arr[CreateItemFields.Amount] = data.Amount;
  arr[CreateItemFields.MenuType] = data.MenuType;
  return arr;
}
