import { assertIsArray, type PacketArray } from "../../codec/arrayCodec";
import { CastedInventorySpellFields } from "../../fields/actions/CastedInventorySpellFields";

/** Auto-generated from `apps/game/gameActionFactory.js` (CastedInventorySpell) */
export type CastedInventorySpellPayload = {
  EntityID: unknown;
  EntityType: unknown;
  SpellID: unknown;
  TargetItemID: unknown;
};

export function decodeCastedInventorySpellPayload(payload: unknown): CastedInventorySpellPayload {
  assertIsArray(payload, "CastedInventorySpell payload");
  const arr = payload as PacketArray;
  return {
    EntityID: arr[CastedInventorySpellFields.EntityID] as any,
    EntityType: arr[CastedInventorySpellFields.EntityType] as any,
    SpellID: arr[CastedInventorySpellFields.SpellID] as any,
    TargetItemID: arr[CastedInventorySpellFields.TargetItemID] as any,
  };
}

export function buildCastedInventorySpellPayload(data: CastedInventorySpellPayload): unknown[] {
  const arr: unknown[] = new Array(4);
  arr[CastedInventorySpellFields.EntityID] = data.EntityID;
  arr[CastedInventorySpellFields.EntityType] = data.EntityType;
  arr[CastedInventorySpellFields.SpellID] = data.SpellID;
  arr[CastedInventorySpellFields.TargetItemID] = data.TargetItemID;
  return arr;
}
