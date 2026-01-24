import { assertIsArray, type PacketArray } from "../../codec/arrayCodec";
import { PlayerAbilityChangedFields } from "../../fields/actions/PlayerAbilityChangedFields";

/** Auto-generated from `apps/game/gameActionFactory.js` (PlayerAbilityChanged) */
export type PlayerAbilityChangedPayload = {
  Ability: unknown;
  Value: unknown;
};

export function decodePlayerAbilityChangedPayload(payload: unknown): PlayerAbilityChangedPayload {
  assertIsArray(payload, "PlayerAbilityChanged payload");
  const arr = payload as PacketArray;
  return {
    Ability: arr[PlayerAbilityChangedFields.Ability] as any,
    Value: arr[PlayerAbilityChangedFields.Value] as any,
  };
}

export function buildPlayerAbilityChangedPayload(data: PlayerAbilityChangedPayload): unknown[] {
  const arr: unknown[] = new Array(2);
  arr[PlayerAbilityChangedFields.Ability] = data.Ability;
  arr[PlayerAbilityChangedFields.Value] = data.Value;
  return arr;
}
