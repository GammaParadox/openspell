import { assertIsArray, type PacketArray } from "../../codec/arrayCodec";
import { PlayerInfoFields } from "../../fields/actions/PlayerInfoFields";

/** Auto-generated from `apps/game/gameActionFactory.js` (PlayerInfo) */
export type PlayerInfoPayload = {
  Info: unknown;
};

export function decodePlayerInfoPayload(payload: unknown): PlayerInfoPayload {
  assertIsArray(payload, "PlayerInfo payload");
  const arr = payload as PacketArray;
  return {
    Info: arr[PlayerInfoFields.Info] as any,
  };
}

export function buildPlayerInfoPayload(data: PlayerInfoPayload): unknown[] {
  const arr: unknown[] = new Array(1);
  arr[PlayerInfoFields.Info] = data.Info;
  return arr;
}
