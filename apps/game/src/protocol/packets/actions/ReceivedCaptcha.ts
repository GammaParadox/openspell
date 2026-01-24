import { assertIsArray, type PacketArray } from "../../codec/arrayCodec";
import { ReceivedCaptchaFields } from "../../fields/actions/ReceivedCaptchaFields";

/** Auto-generated from `apps/game/gameActionFactory.js` (ReceivedCaptcha) */
export type ReceivedCaptchaPayload = {
  ImageDataURL: unknown;
  Width: unknown;
  Height: unknown;
};

export function decodeReceivedCaptchaPayload(payload: unknown): ReceivedCaptchaPayload {
  assertIsArray(payload, "ReceivedCaptcha payload");
  const arr = payload as PacketArray;
  return {
    ImageDataURL: arr[ReceivedCaptchaFields.ImageDataURL] as any,
    Width: arr[ReceivedCaptchaFields.Width] as any,
    Height: arr[ReceivedCaptchaFields.Height] as any,
  };
}

export function buildReceivedCaptchaPayload(data: ReceivedCaptchaPayload): unknown[] {
  const arr: unknown[] = new Array(3);
  arr[ReceivedCaptchaFields.ImageDataURL] = data.ImageDataURL;
  arr[ReceivedCaptchaFields.Width] = data.Width;
  arr[ReceivedCaptchaFields.Height] = data.Height;
  return arr;
}
