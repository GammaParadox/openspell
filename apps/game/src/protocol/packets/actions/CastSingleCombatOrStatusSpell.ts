import { assertIsArray, type PacketArray } from "../../codec/arrayCodec";
import { CastSingleCombatOrStatusSpellFields } from "../../fields/actions/CastSingleCombatOrStatusSpellFields";

/** Auto-generated from `apps/game/gameActionFactory.js` (CastSingleCombatOrStatusSpell) */
export type CastSingleCombatOrStatusSpellPayload = {
  SpellID: unknown;
  TargetID: unknown;
  TargetEntityType: unknown;
};

export function decodeCastSingleCombatOrStatusSpellPayload(payload: unknown): CastSingleCombatOrStatusSpellPayload {
  assertIsArray(payload, "CastSingleCombatOrStatusSpell payload");
  const arr = payload as PacketArray;
  return {
    SpellID: arr[CastSingleCombatOrStatusSpellFields.SpellID] as any,
    TargetID: arr[CastSingleCombatOrStatusSpellFields.TargetID] as any,
    TargetEntityType: arr[CastSingleCombatOrStatusSpellFields.TargetEntityType] as any,
  };
}

export function buildCastSingleCombatOrStatusSpellPayload(data: CastSingleCombatOrStatusSpellPayload): unknown[] {
  const arr: unknown[] = new Array(3);
  arr[CastSingleCombatOrStatusSpellFields.SpellID] = data.SpellID;
  arr[CastSingleCombatOrStatusSpellFields.TargetID] = data.TargetID;
  arr[CastSingleCombatOrStatusSpellFields.TargetEntityType] = data.TargetEntityType;
  return arr;
}
