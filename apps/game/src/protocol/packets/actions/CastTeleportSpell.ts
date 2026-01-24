import { assertIsArray, type PacketArray } from "../../codec/arrayCodec";
import { CastTeleportSpellFields } from "../../fields/actions/CastTeleportSpellFields";

/** Auto-generated from `apps/game/gameActionFactory.js` (CastTeleportSpell) */
export type CastTeleportSpellPayload = {
  SpellID: unknown;
};

export function decodeCastTeleportSpellPayload(payload: unknown): CastTeleportSpellPayload {
  assertIsArray(payload, "CastTeleportSpell payload");
  const arr = payload as PacketArray;
  return {
    SpellID: arr[CastTeleportSpellFields.SpellID] as any,
  };
}

export function buildCastTeleportSpellPayload(data: CastTeleportSpellPayload): unknown[] {
  const arr: unknown[] = new Array(1);
  arr[CastTeleportSpellFields.SpellID] = data.SpellID;
  return arr;
}
