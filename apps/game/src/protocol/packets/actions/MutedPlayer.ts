import { assertIsArray, type PacketArray } from "../../codec/arrayCodec";
import { MutedPlayerFields } from "../../fields/actions/MutedPlayerFields";

/** Auto-generated from `apps/game/gameActionFactory.js` (MutedPlayer) */
export type MutedPlayerPayload = {
  Name: string;
  IsMuted: unknown;
};

export function decodeMutedPlayerPayload(payload: unknown): MutedPlayerPayload {
  assertIsArray(payload, "MutedPlayer payload");
  const arr = payload as PacketArray;
  return {
    Name: arr[MutedPlayerFields.Name] as any,
    IsMuted: arr[MutedPlayerFields.IsMuted] as any,
  };
}

export function buildMutedPlayerPayload(data: MutedPlayerPayload): unknown[] {
  const arr: unknown[] = new Array(2);
  arr[MutedPlayerFields.Name] = data.Name;
  arr[MutedPlayerFields.IsMuted] = data.IsMuted;
  return arr;
}
