import { assertIsArray, type PacketArray } from "../../codec/arrayCodec";
import { GameStateUpdateFields } from "../../fields/actions/GameStateUpdateFields";

/** Auto-generated from `apps/game/gameActionFactory.js` (GameStateUpdate) */
export type GameStateUpdatePayload = {
  GameActionName: unknown;
  GameActionData: unknown;
};

export function decodeGameStateUpdatePayload(payload: unknown): GameStateUpdatePayload {
  assertIsArray(payload, "GameStateUpdate payload");
  const arr = payload as PacketArray;
  return {
    GameActionName: arr[GameStateUpdateFields.GameActionName] as any,
    GameActionData: arr[GameStateUpdateFields.GameActionData] as any,
  };
}

export function buildGameStateUpdatePayload(data: GameStateUpdatePayload): unknown[] {
  const arr: unknown[] = new Array(2);
  arr[GameStateUpdateFields.GameActionName] = data.GameActionName;
  arr[GameStateUpdateFields.GameActionData] = data.GameActionData;
  return arr;
}
