import { assertIsArray, type PacketArray } from "../../codec/arrayCodec";
import { CanLoginFields } from "../../fields/actions/CanLoginFields";

/** Auto-generated from `apps/game/gameActionFactory.js` (CanLogin) */
export type CanLoginPayload = {
};

export function decodeCanLoginPayload(payload: unknown): CanLoginPayload {
  assertIsArray(payload, "CanLogin payload");
  const arr = payload as PacketArray;
  return {
  };
}

export function buildCanLoginPayload(data: CanLoginPayload): unknown[] {
  const arr: unknown[] = new Array(0);
  return arr;
}
