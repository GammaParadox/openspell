import { assertIsArray, type PacketArray } from "../../codec/arrayCodec";
import { PlayerWeightChangedFields } from "../../fields/actions/PlayerWeightChangedFields";

/** Auto-generated from `apps/game/gameActionFactory.js` (PlayerWeightChanged) */
export type PlayerWeightChangedPayload = {
  EquippedItemsWeight: number;
  InventoryItemsWeight: number;
};

export function decodePlayerWeightChangedPayload(payload: unknown): PlayerWeightChangedPayload {
  assertIsArray(payload, "PlayerWeightChanged payload");
  const arr = payload as PacketArray;
  return {
    EquippedItemsWeight: arr[PlayerWeightChangedFields.EquippedItemsWeight] as any,
    InventoryItemsWeight: arr[PlayerWeightChangedFields.InventoryItemsWeight] as any,
  };
}

export function buildPlayerWeightChangedPayload(data: PlayerWeightChangedPayload): unknown[] {
  const arr: unknown[] = new Array(2);
  arr[PlayerWeightChangedFields.EquippedItemsWeight] = data.EquippedItemsWeight;
  arr[PlayerWeightChangedFields.InventoryItemsWeight] = data.InventoryItemsWeight;
  return arr;
}
