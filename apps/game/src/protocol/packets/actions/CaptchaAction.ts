import { assertIsArray, type PacketArray } from "../../codec/arrayCodec";
import { CaptchaActionFields } from "../../fields/actions/CaptchaActionFields";

/** Auto-generated from `apps/game/gameActionFactory.js` (CaptchaAction) */
export type CaptchaActionPayload = {
  CaptchaActionType: unknown;
  CaptchaGuessText: unknown;
};

export function decodeCaptchaActionPayload(payload: unknown): CaptchaActionPayload {
  assertIsArray(payload, "CaptchaAction payload");
  const arr = payload as PacketArray;
  return {
    CaptchaActionType: arr[CaptchaActionFields.CaptchaActionType] as any,
    CaptchaGuessText: arr[CaptchaActionFields.CaptchaGuessText] as any,
  };
}

export function buildCaptchaActionPayload(data: CaptchaActionPayload): unknown[] {
  const arr: unknown[] = new Array(2);
  arr[CaptchaActionFields.CaptchaActionType] = data.CaptchaActionType;
  arr[CaptchaActionFields.CaptchaGuessText] = data.CaptchaGuessText;
  return arr;
}
