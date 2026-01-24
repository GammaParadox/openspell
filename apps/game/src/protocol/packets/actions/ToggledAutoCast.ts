import { assertIsArray, type PacketArray } from "../../codec/arrayCodec";
import { ToggledAutoCastFields } from "../../fields/actions/ToggledAutoCastFields";

/** Auto-generated from `apps/game/gameActionFactory.js` (ToggledAutoCast) */
export type ToggledAutoCastPayload = {
  SpellID: unknown;
};

export function decodeToggledAutoCastPayload(payload: unknown): ToggledAutoCastPayload {
  assertIsArray(payload, "ToggledAutoCast payload");
  const arr = payload as PacketArray;
  return {
    SpellID: arr[ToggledAutoCastFields.SpellID] as any,
  };
}

export function buildToggledAutoCastPayload(data: ToggledAutoCastPayload): unknown[] {
  const arr: unknown[] = new Array(1);
  arr[ToggledAutoCastFields.SpellID] = data.SpellID;
  return arr;
}
