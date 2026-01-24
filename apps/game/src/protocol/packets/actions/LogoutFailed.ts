import { assertIsArray, type PacketArray } from "../../codec/arrayCodec";
import { LogoutFailedFields } from "../../fields/actions/LogoutFailedFields";

/** Auto-generated from `apps/game/gameActionFactory.js` (LogoutFailed) */
export type LogoutFailedPayload = {
  Reason: unknown;
};

export function decodeLogoutFailedPayload(payload: unknown): LogoutFailedPayload {
  assertIsArray(payload, "LogoutFailed payload");
  const arr = payload as PacketArray;
  return {
    Reason: arr[LogoutFailedFields.Reason] as any,
  };
}

export function buildLogoutFailedPayload(data: LogoutFailedPayload): unknown[] {
  const arr: unknown[] = new Array(1);
  arr[LogoutFailedFields.Reason] = data.Reason;
  return arr;
}
