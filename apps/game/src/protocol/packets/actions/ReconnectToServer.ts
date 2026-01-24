import { assertIsArray, type PacketArray } from "../../codec/arrayCodec";
import { ReconnectToServerFields } from "../../fields/actions/ReconnectToServerFields";

/** Auto-generated from `apps/game/gameActionFactory.js` (ReconnectToServer) */
export type ReconnectToServerPayload = {
  Username: unknown;
  PlayerSessionID: unknown;
};

export function decodeReconnectToServerPayload(payload: unknown): ReconnectToServerPayload {
  assertIsArray(payload, "ReconnectToServer payload");
  const arr = payload as PacketArray;
  return {
    Username: arr[ReconnectToServerFields.Username] as any,
    PlayerSessionID: arr[ReconnectToServerFields.PlayerSessionID] as any,
  };
}

export function buildReconnectToServerPayload(data: ReconnectToServerPayload): unknown[] {
  const arr: unknown[] = new Array(2);
  arr[ReconnectToServerFields.Username] = data.Username;
  arr[ReconnectToServerFields.PlayerSessionID] = data.PlayerSessionID;
  return arr;
}
