import { assertIsArray, type PacketArray } from "../../codec/arrayCodec";
import { CastedTeleportSpellFields } from "../../fields/actions/CastedTeleportSpellFields";

/** Auto-generated from `apps/game/gameActionFactory.js` (CastedTeleportSpell) */
export type CastedTeleportSpellPayload = {
  EntityID: unknown;
  EntityType: unknown;
  SpellID: unknown;
};

export function decodeCastedTeleportSpellPayload(payload: unknown): CastedTeleportSpellPayload {
  assertIsArray(payload, "CastedTeleportSpell payload");
  const arr = payload as PacketArray;
  return {
    EntityID: arr[CastedTeleportSpellFields.EntityID] as any,
    EntityType: arr[CastedTeleportSpellFields.EntityType] as any,
    SpellID: arr[CastedTeleportSpellFields.SpellID] as any,
  };
}

export function buildCastedTeleportSpellPayload(data: CastedTeleportSpellPayload): unknown[] {
  const arr: unknown[] = new Array(3);
  arr[CastedTeleportSpellFields.EntityID] = data.EntityID;
  arr[CastedTeleportSpellFields.EntityType] = data.EntityType;
  arr[CastedTeleportSpellFields.SpellID] = data.SpellID;
  return arr;
}
