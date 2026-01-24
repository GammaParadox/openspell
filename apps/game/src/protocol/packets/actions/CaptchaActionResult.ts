import { assertIsArray, type PacketArray } from "../../codec/arrayCodec";
import { CaptchaActionResultFields } from "../../fields/actions/CaptchaActionResultFields";

/** Auto-generated from `apps/game/gameActionFactory.js` (CaptchaActionResult) */
export type CaptchaActionResultPayload = {
  CaptchaActionType: unknown;
};

export function decodeCaptchaActionResultPayload(payload: unknown): CaptchaActionResultPayload {
  assertIsArray(payload, "CaptchaActionResult payload");
  const arr = payload as PacketArray;
  return {
    CaptchaActionType: arr[CaptchaActionResultFields.CaptchaActionType] as any,
  };
}

export function buildCaptchaActionResultPayload(data: CaptchaActionResultPayload): unknown[] {
  const arr: unknown[] = new Array(1);
  arr[CaptchaActionResultFields.CaptchaActionType] = data.CaptchaActionType;
  return arr;
}
