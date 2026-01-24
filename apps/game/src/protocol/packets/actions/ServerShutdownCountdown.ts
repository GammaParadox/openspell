import { assertIsArray, type PacketArray } from "../../codec/arrayCodec";
import { ServerShutdownCountdownFields } from "../../fields/actions/ServerShutdownCountdownFields";

/** Auto-generated from `apps/game/gameActionFactory.js` (ServerShutdownCountdown) */
export type ServerShutdownCountdownPayload = {
  MinutesUntilShutdown: unknown;
};

export function decodeServerShutdownCountdownPayload(payload: unknown): ServerShutdownCountdownPayload {
  assertIsArray(payload, "ServerShutdownCountdown payload");
  const arr = payload as PacketArray;
  return {
    MinutesUntilShutdown: arr[ServerShutdownCountdownFields.MinutesUntilShutdown] as any,
  };
}

export function buildServerShutdownCountdownPayload(data: ServerShutdownCountdownPayload): unknown[] {
  const arr: unknown[] = new Array(1);
  arr[ServerShutdownCountdownFields.MinutesUntilShutdown] = data.MinutesUntilShutdown;
  return arr;
}
