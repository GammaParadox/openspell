import { assertIsArray, type PacketArray } from "../../codec/arrayCodec";
import { PlayerCountChangedFields } from "../../fields/actions/PlayerCountChangedFields";

/** Auto-generated from `apps/game/gameActionFactory.js` (PlayerCountChanged) */
export type PlayerCountChangedPayload = {
  CurrentPlayerCount: unknown;
};

export function decodePlayerCountChangedPayload(payload: unknown): PlayerCountChangedPayload {
  assertIsArray(payload, "PlayerCountChanged payload");
  const arr = payload as PacketArray;
  return {
    CurrentPlayerCount: arr[PlayerCountChangedFields.CurrentPlayerCount] as any,
  };
}

export function buildPlayerCountChangedPayload(data: PlayerCountChangedPayload): unknown[] {
  const arr: unknown[] = new Array(1);
  arr[PlayerCountChangedFields.CurrentPlayerCount] = data.CurrentPlayerCount;
  return arr;
}
