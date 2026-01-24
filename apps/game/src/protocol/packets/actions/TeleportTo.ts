import { assertIsArray, type PacketArray } from "../../codec/arrayCodec";
import { TeleportToFields } from "../../fields/actions/TeleportToFields";

/** Auto-generated from `apps/game/gameActionFactory.js` (TeleportTo) */
export type TeleportToPayload = {
  EntityID: unknown;
  EntityType: unknown;
  X: unknown;
  Y: unknown;
  MapLevel: unknown;
  Type: unknown;
  SpellID: unknown;
};

export function decodeTeleportToPayload(payload: unknown): TeleportToPayload {
  assertIsArray(payload, "TeleportTo payload");
  const arr = payload as PacketArray;
  return {
    EntityID: arr[TeleportToFields.EntityID] as any,
    EntityType: arr[TeleportToFields.EntityType] as any,
    X: arr[TeleportToFields.X] as any,
    Y: arr[TeleportToFields.Y] as any,
    MapLevel: arr[TeleportToFields.MapLevel] as any,
    Type: arr[TeleportToFields.Type] as any,
    SpellID: arr[TeleportToFields.SpellID] as any,
  };
}

export function buildTeleportToPayload(data: TeleportToPayload): unknown[] {
  const arr: unknown[] = new Array(7);
  arr[TeleportToFields.EntityID] = data.EntityID;
  arr[TeleportToFields.EntityType] = data.EntityType;
  arr[TeleportToFields.X] = data.X;
  arr[TeleportToFields.Y] = data.Y;
  arr[TeleportToFields.MapLevel] = data.MapLevel;
  arr[TeleportToFields.Type] = data.Type;
  arr[TeleportToFields.SpellID] = data.SpellID;
  return arr;
}
