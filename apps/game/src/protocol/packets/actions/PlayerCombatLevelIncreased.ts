import { assertIsArray, type PacketArray } from "../../codec/arrayCodec";
import { PlayerCombatLevelIncreasedFields } from "../../fields/actions/PlayerCombatLevelIncreasedFields";

/** Auto-generated from `apps/game/gameActionFactory.js` (PlayerCombatLevelIncreased) */
export type PlayerCombatLevelIncreasedPayload = {
  PlayerEntityID: unknown;
  NewCombatLevel: unknown;
};

export function decodePlayerCombatLevelIncreasedPayload(payload: unknown): PlayerCombatLevelIncreasedPayload {
  assertIsArray(payload, "PlayerCombatLevelIncreased payload");
  const arr = payload as PacketArray;
  return {
    PlayerEntityID: arr[PlayerCombatLevelIncreasedFields.PlayerEntityID] as any,
    NewCombatLevel: arr[PlayerCombatLevelIncreasedFields.NewCombatLevel] as any,
  };
}

export function buildPlayerCombatLevelIncreasedPayload(data: PlayerCombatLevelIncreasedPayload): unknown[] {
  const arr: unknown[] = new Array(2);
  arr[PlayerCombatLevelIncreasedFields.PlayerEntityID] = data.PlayerEntityID;
  arr[PlayerCombatLevelIncreasedFields.NewCombatLevel] = data.NewCombatLevel;
  return arr;
}
