import { assertIsArray, type PacketArray } from "../../codec/arrayCodec";
import { ServerInfoMessageFields } from "../../fields/actions/ServerInfoMessageFields";

/** Auto-generated from `apps/game/gameActionFactory.js` (ServerInfoMessage) */
export type ServerInfoMessagePayload = {
  Message: unknown;
  Style: unknown;
};

export function decodeServerInfoMessagePayload(payload: unknown): ServerInfoMessagePayload {
  assertIsArray(payload, "ServerInfoMessage payload");
  const arr = payload as PacketArray;
  return {
    Message: arr[ServerInfoMessageFields.Message] as any,
    Style: arr[ServerInfoMessageFields.Style] as any,
  };
}

export function buildServerInfoMessagePayload(data: ServerInfoMessagePayload): unknown[] {
  const arr: unknown[] = new Array(2);
  arr[ServerInfoMessageFields.Message] = data.Message;
  arr[ServerInfoMessageFields.Style] = data.Style;
  return arr;
}
