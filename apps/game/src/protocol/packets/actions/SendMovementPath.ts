import { assertIsArray, type PacketArray } from "../../codec/arrayCodec";
import { SendMovementPathFields } from "../../fields/actions/SendMovementPathFields";

/** Auto-generated from `apps/game/gameActionFactory.js` (SendMovementPath) */
export type SendMovementPathPayload = {
  X: unknown;
  Y: unknown;
};

export function decodeSendMovementPathPayload(payload: unknown): SendMovementPathPayload {
  assertIsArray(payload, "SendMovementPath payload");
  const arr = payload as PacketArray;
  return {
    X: arr[SendMovementPathFields.X] as any,
    Y: arr[SendMovementPathFields.Y] as any,
  };
}

export function buildSendMovementPathPayload(data: SendMovementPathPayload): unknown[] {
  const arr: unknown[] = new Array(2);
  arr[SendMovementPathFields.X] = data.X;
  arr[SendMovementPathFields.Y] = data.Y;
  return arr;
}
