import { assertIsArray, type PacketArray } from "../../codec/arrayCodec";
import { ToggleAutoCastFields } from "../../fields/actions/ToggleAutoCastFields";

/** Auto-generated from `apps/game/gameActionFactory.js` (ToggleAutoCast) */
export type ToggleAutoCastPayload = {
  SpellID: unknown;
};

export function decodeToggleAutoCastPayload(payload: unknown): ToggleAutoCastPayload {
  assertIsArray(payload, "ToggleAutoCast payload");
  const arr = payload as PacketArray;
  return {
    SpellID: arr[ToggleAutoCastFields.SpellID] as any,
  };
}

export function buildToggleAutoCastPayload(data: ToggleAutoCastPayload): unknown[] {
  const arr: unknown[] = new Array(1);
  arr[ToggleAutoCastFields.SpellID] = data.SpellID;
  return arr;
}
