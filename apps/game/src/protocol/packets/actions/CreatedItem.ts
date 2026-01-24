import { assertIsArray, type PacketArray } from "../../codec/arrayCodec";
import { CreatedItemFields } from "../../fields/actions/CreatedItemFields";

/** Auto-generated from `apps/game/gameActionFactory.js` (CreatedItem) */
export type CreatedItemPayload = {
  ItemID: unknown;
  Amount: unknown;
  RecipeInstancesToRemove: unknown;
};

export function decodeCreatedItemPayload(payload: unknown): CreatedItemPayload {
  assertIsArray(payload, "CreatedItem payload");
  const arr = payload as PacketArray;
  return {
    ItemID: arr[CreatedItemFields.ItemID] as any,
    Amount: arr[CreatedItemFields.Amount] as any,
    RecipeInstancesToRemove: arr[CreatedItemFields.RecipeInstancesToRemove] as any,
  };
}

export function buildCreatedItemPayload(data: CreatedItemPayload): unknown[] {
  const arr: unknown[] = new Array(3);
  arr[CreatedItemFields.ItemID] = data.ItemID;
  arr[CreatedItemFields.Amount] = data.Amount;
  arr[CreatedItemFields.RecipeInstancesToRemove] = data.RecipeInstancesToRemove;
  return arr;
}
