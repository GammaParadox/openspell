import { assertIsArray, type PacketArray } from "../../codec/arrayCodec";
import { LoggedOutFields } from "../../fields/actions/LoggedOutFields";

/** Auto-generated from `apps/game/gameActionFactory.js` (LoggedOut) */
export type LoggedOutPayload = {
  EntityID: unknown;
};

export function decodeLoggedOutPayload(payload: unknown): LoggedOutPayload {
  assertIsArray(payload, "LoggedOut payload");
  const arr = payload as PacketArray;
  return {
    EntityID: arr[LoggedOutFields.EntityID] as any,
  };
}

export function buildLoggedOutPayload(data: LoggedOutPayload): unknown[] {
  const arr: unknown[] = new Array(1);
  arr[LoggedOutFields.EntityID] = data.EntityID;
  return arr;
}
