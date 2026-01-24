import { assertIsArray, type PacketArray } from "../../codec/arrayCodec";
import { LogoutFields } from "../../fields/actions/LogoutFields";

/** Auto-generated from `apps/game/gameActionFactory.js` (Logout) */
export type LogoutPayload = {
  EntityID: unknown;
};

export function decodeLogoutPayload(payload: unknown): LogoutPayload {
  assertIsArray(payload, "Logout payload");
  const arr = payload as PacketArray;
  return {
    EntityID: arr[LogoutFields.EntityID] as any,
  };
}

export function buildLogoutPayload(data: LogoutPayload): unknown[] {
  const arr: unknown[] = new Array(1);
  arr[LogoutFields.EntityID] = data.EntityID;
  return arr;
}
