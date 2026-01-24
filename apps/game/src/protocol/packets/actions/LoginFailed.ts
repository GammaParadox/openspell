import { assertIsArray, type PacketArray } from "../../codec/arrayCodec";
import { LoginFailedFields } from "../../fields/actions/LoginFailedFields";

/** Auto-generated from `apps/game/gameActionFactory.js` (LoginFailed) */
export type LoginFailedPayload = {
  Reason: unknown;
};

export function decodeLoginFailedPayload(payload: unknown): LoginFailedPayload {
  assertIsArray(payload, "LoginFailed payload");
  const arr = payload as PacketArray;
  return {
    Reason: arr[LoginFailedFields.Reason] as any,
  };
}

export function buildLoginFailedPayload(data: LoginFailedPayload): unknown[] {
  const arr: unknown[] = new Array(1);
  arr[LoginFailedFields.Reason] = data.Reason;
  return arr;
}
