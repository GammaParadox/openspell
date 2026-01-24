import { assertIsArray, type PacketArray } from "../../codec/arrayCodec";
import { ShowDamageFields } from "../../fields/actions/ShowDamageFields";

/** Auto-generated from `apps/game/gameActionFactory.js` (ShowDamage) */
export type ShowDamagePayload = {
  SenderEntityID: unknown;
  ReceiverEntityID: unknown;
  DamageAmount: unknown;
};

export function decodeShowDamagePayload(payload: unknown): ShowDamagePayload {
  assertIsArray(payload, "ShowDamage payload");
  const arr = payload as PacketArray;
  return {
    SenderEntityID: arr[ShowDamageFields.SenderEntityID] as any,
    ReceiverEntityID: arr[ShowDamageFields.ReceiverEntityID] as any,
    DamageAmount: arr[ShowDamageFields.DamageAmount] as any,
  };
}

export function buildShowDamagePayload(data: ShowDamagePayload): unknown[] {
  const arr: unknown[] = new Array(3);
  arr[ShowDamageFields.SenderEntityID] = data.SenderEntityID;
  arr[ShowDamageFields.ReceiverEntityID] = data.ReceiverEntityID;
  arr[ShowDamageFields.DamageAmount] = data.DamageAmount;
  return arr;
}
