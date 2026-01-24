import { assertIsArray, type PacketArray } from "../../codec/arrayCodec";
import { ReceivedBankItemsFields } from "../../fields/actions/ReceivedBankItemsFields";

/** Auto-generated from `apps/game/gameActionFactory.js` (ReceivedBankItems) */
export type ReceivedBankItemsPayload = {
  Items: unknown;
};

export function decodeReceivedBankItemsPayload(payload: unknown): ReceivedBankItemsPayload {
  assertIsArray(payload, "ReceivedBankItems payload");
  const arr = payload as PacketArray;
  return {
    Items: arr[ReceivedBankItemsFields.Items] as any,
  };
}

export function buildReceivedBankItemsPayload(data: ReceivedBankItemsPayload): unknown[] {
  const arr: unknown[] = new Array(1);
  arr[ReceivedBankItemsFields.Items] = data.Items;
  return arr;
}
