import { assertIsArray, type PacketArray } from "../../codec/arrayCodec";
import { OpenedCaptchaScreenFields } from "../../fields/actions/OpenedCaptchaScreenFields";

/** Auto-generated from `apps/game/gameActionFactory.js` (OpenedCaptchaScreen) */
export type OpenedCaptchaScreenPayload = {
  EntityID: unknown;
};

export function decodeOpenedCaptchaScreenPayload(payload: unknown): OpenedCaptchaScreenPayload {
  assertIsArray(payload, "OpenedCaptchaScreen payload");
  const arr = payload as PacketArray;
  return {
    EntityID: arr[OpenedCaptchaScreenFields.EntityID] as any,
  };
}

export function buildOpenedCaptchaScreenPayload(data: OpenedCaptchaScreenPayload): unknown[] {
  const arr: unknown[] = new Array(1);
  arr[OpenedCaptchaScreenFields.EntityID] = data.EntityID;
  return arr;
}
