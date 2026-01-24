import { assertIsArray, type PacketArray } from "../../codec/arrayCodec";
import { CastInventorySpellFields } from "../../fields/actions/CastInventorySpellFields";

/** Auto-generated from `apps/game/gameActionFactory.js` (CastInventorySpell) */
export type CastInventorySpellPayload = {
  SpellID: unknown;
  Menu: unknown;
  Slot: unknown;
  ItemID: unknown;
  IsIOU: boolean;
};

export function decodeCastInventorySpellPayload(payload: unknown): CastInventorySpellPayload {
  assertIsArray(payload, "CastInventorySpell payload");
  const arr = payload as PacketArray;
  return {
    SpellID: arr[CastInventorySpellFields.SpellID] as any,
    Menu: arr[CastInventorySpellFields.Menu] as any,
    Slot: arr[CastInventorySpellFields.Slot] as any,
    ItemID: arr[CastInventorySpellFields.ItemID] as any,
    IsIOU: arr[CastInventorySpellFields.IsIOU] as any,
  };
}

export function buildCastInventorySpellPayload(data: CastInventorySpellPayload): unknown[] {
  const arr: unknown[] = new Array(5);
  arr[CastInventorySpellFields.SpellID] = data.SpellID;
  arr[CastInventorySpellFields.Menu] = data.Menu;
  arr[CastInventorySpellFields.Slot] = data.Slot;
  arr[CastInventorySpellFields.ItemID] = data.ItemID;
  arr[CastInventorySpellFields.IsIOU] = data.IsIOU ? 1 : 0;
  return arr;
}
