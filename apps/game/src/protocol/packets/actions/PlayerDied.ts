import { assertIsArray, type PacketArray } from "../../codec/arrayCodec";
import { PlayerDiedFields } from "../../fields/actions/PlayerDiedFields";

/** Auto-generated from `apps/game/gameActionFactory.js` (PlayerDied) */
export type PlayerDiedPayload = {
  VictimEntityID: unknown;
  PKerEntityID: unknown;
};

export function decodePlayerDiedPayload(payload: unknown): PlayerDiedPayload {
  assertIsArray(payload, "PlayerDied payload");
  const arr = payload as PacketArray;
  return {
    VictimEntityID: arr[PlayerDiedFields.VictimEntityID] as any,
    PKerEntityID: arr[PlayerDiedFields.PKerEntityID] as any,
  };
}

export function buildPlayerDiedPayload(data: PlayerDiedPayload): unknown[] {
  const arr: unknown[] = new Array(2);
  arr[PlayerDiedFields.VictimEntityID] = data.VictimEntityID;
  arr[PlayerDiedFields.PKerEntityID] = data.PKerEntityID;
  return arr;
}
