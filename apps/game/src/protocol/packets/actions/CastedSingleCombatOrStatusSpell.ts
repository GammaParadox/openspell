import { assertIsArray, type PacketArray } from "../../codec/arrayCodec";
import { CastedSingleCombatOrStatusSpellFields } from "../../fields/actions/CastedSingleCombatOrStatusSpellFields";

/** Auto-generated from `apps/game/gameActionFactory.js` (CastedSingleCombatOrStatusSpell) */
export type CastedSingleCombatOrStatusSpellPayload = {
  SpellID: unknown;
  CasterID: unknown;
  CasterEntityType: unknown;
  TargetID: unknown;
  TargetEntityType: unknown;
  DamageAmount: unknown;
  IsConfused: boolean;
};

export function decodeCastedSingleCombatOrStatusSpellPayload(payload: unknown): CastedSingleCombatOrStatusSpellPayload {
  assertIsArray(payload, "CastedSingleCombatOrStatusSpell payload");
  const arr = payload as PacketArray;
  return {
    SpellID: arr[CastedSingleCombatOrStatusSpellFields.SpellID] as any,
    CasterID: arr[CastedSingleCombatOrStatusSpellFields.CasterID] as any,
    CasterEntityType: arr[CastedSingleCombatOrStatusSpellFields.CasterEntityType] as any,
    TargetID: arr[CastedSingleCombatOrStatusSpellFields.TargetID] as any,
    TargetEntityType: arr[CastedSingleCombatOrStatusSpellFields.TargetEntityType] as any,
    DamageAmount: arr[CastedSingleCombatOrStatusSpellFields.DamageAmount] as any,
    IsConfused: arr[CastedSingleCombatOrStatusSpellFields.IsConfused] as any,
  };
}

export function buildCastedSingleCombatOrStatusSpellPayload(data: CastedSingleCombatOrStatusSpellPayload): unknown[] {
  const arr: unknown[] = new Array(7);
  arr[CastedSingleCombatOrStatusSpellFields.SpellID] = data.SpellID;
  arr[CastedSingleCombatOrStatusSpellFields.CasterID] = data.CasterID;
  arr[CastedSingleCombatOrStatusSpellFields.CasterEntityType] = data.CasterEntityType;
  arr[CastedSingleCombatOrStatusSpellFields.TargetID] = data.TargetID;
  arr[CastedSingleCombatOrStatusSpellFields.TargetEntityType] = data.TargetEntityType;
  arr[CastedSingleCombatOrStatusSpellFields.DamageAmount] = data.DamageAmount;
  arr[CastedSingleCombatOrStatusSpellFields.IsConfused] = data.IsConfused ? 1 : 0;
  return arr;
}
