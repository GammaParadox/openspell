import { assertIsArray, type PacketArray } from "../../codec/arrayCodec";
import { IncreaseCombatExpFields } from "../../fields/actions/IncreaseCombatExpFields";

/** Auto-generated from `apps/game/gameActionFactory.js` (IncreaseCombatExp) */
export type IncreaseCombatExpPayload = {
  Style: unknown;
  DamageAmount: unknown;
};

export function decodeIncreaseCombatExpPayload(payload: unknown): IncreaseCombatExpPayload {
  assertIsArray(payload, "IncreaseCombatExp payload");
  const arr = payload as PacketArray;
  return {
    Style: arr[IncreaseCombatExpFields.Style] as any,
    DamageAmount: arr[IncreaseCombatExpFields.DamageAmount] as any,
  };
}

export function buildIncreaseCombatExpPayload(data: IncreaseCombatExpPayload): unknown[] {
  const arr: unknown[] = new Array(2);
  arr[IncreaseCombatExpFields.Style] = data.Style;
  arr[IncreaseCombatExpFields.DamageAmount] = data.DamageAmount;
  return arr;
}
