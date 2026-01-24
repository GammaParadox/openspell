import { assertIsArray, type PacketArray } from "../../codec/arrayCodec";
import { GainedExpFields } from "../../fields/actions/GainedExpFields";

/** Auto-generated from `apps/game/gameActionFactory.js` (GainedExp) */
export type GainedExpPayload = {
  Skill: unknown;
  Amount: unknown;
};

export function decodeGainedExpPayload(payload: unknown): GainedExpPayload {
  assertIsArray(payload, "GainedExp payload");
  const arr = payload as PacketArray;
  return {
    Skill: arr[GainedExpFields.Skill] as any,
    Amount: arr[GainedExpFields.Amount] as any,
  };
}

export function buildGainedExpPayload(data: GainedExpPayload): unknown[] {
  const arr: unknown[] = new Array(2);
  arr[GainedExpFields.Skill] = data.Skill;
  arr[GainedExpFields.Amount] = data.Amount;
  return arr;
}
