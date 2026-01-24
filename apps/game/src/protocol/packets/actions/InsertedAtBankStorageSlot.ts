import { assertIsArray, type PacketArray } from "../../codec/arrayCodec";
import { InsertedAtBankStorageSlotFields } from "../../fields/actions/InsertedAtBankStorageSlotFields";

/** Auto-generated from `apps/game/gameActionFactory.js` (InsertedAtBankStorageSlot) */
export type InsertedAtBankStorageSlotPayload = {
  Result: boolean;
};

export function decodeInsertedAtBankStorageSlotPayload(payload: unknown): InsertedAtBankStorageSlotPayload {
  assertIsArray(payload, "InsertedAtBankStorageSlot payload");
  const arr = payload as PacketArray;
  return {
    Result: arr[InsertedAtBankStorageSlotFields.Result] as any,
  };
}

export function buildInsertedAtBankStorageSlotPayload(data: InsertedAtBankStorageSlotPayload): unknown[] {
  const arr: unknown[] = new Array(1);
  arr[InsertedAtBankStorageSlotFields.Result] = data.Result ? 1 : 0;
  return arr;
}
