import { assertIsArray, type PacketArray } from "../../codec/arrayCodec";
import { LoginFields } from "../../fields/actions/LoginFields";

/** Auto-generated from `apps/game/gameActionFactory.js` (Login) */
export type LoginPayload = {
  Username: unknown;
  Token: unknown;
  CurrentClientVersion: unknown;
};

export function decodeLoginPayload(payload: unknown): LoginPayload {
  assertIsArray(payload, "Login payload");
  const arr = payload as PacketArray;
  return {
    Username: arr[LoginFields.Username] as any,
    Token: arr[LoginFields.Token] as any,
    CurrentClientVersion: arr[LoginFields.CurrentClientVersion] as any,
  };
}

export function buildLoginPayload(data: LoginPayload): unknown[] {
  const arr: unknown[] = new Array(3);
  arr[LoginFields.Username] = data.Username;
  arr[LoginFields.Token] = data.Token;
  arr[LoginFields.CurrentClientVersion] = data.CurrentClientVersion;
  return arr;
}
