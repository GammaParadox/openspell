import { assertIsArray, type PacketArray } from "../../codec/arrayCodec";
import { InsertAtBankStorageSlotFields } from "../../fields/actions/InsertAtBankStorageSlotFields";

/** Auto-generated from `apps/game/gameActionFactory.js` (InsertAtBankStorageSlot) */
export type InsertAtBankStorageSlotPayload = {
  Slot1: unknown;
  Slot2: unknown;
};

export function decodeInsertAtBankStorageSlotPayload(payload: unknown): InsertAtBankStorageSlotPayload {
  assertIsArray(payload, "InsertAtBankStorageSlot payload");
  const arr = payload as PacketArray;
  return {
    Slot1: arr[InsertAtBankStorageSlotFields.Slot1] as any,
    Slot2: arr[InsertAtBankStorageSlotFields.Slot2] as any,
  };
}

export function buildInsertAtBankStorageSlotPayload(data: InsertAtBankStorageSlotPayload): unknown[] {
  const arr: unknown[] = new Array(2);
  arr[InsertAtBankStorageSlotFields.Slot1] = data.Slot1;
  arr[InsertAtBankStorageSlotFields.Slot2] = data.Slot2;
  return arr;
}
