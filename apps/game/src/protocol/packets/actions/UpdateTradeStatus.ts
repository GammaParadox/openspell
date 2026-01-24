import { assertIsArray, type PacketArray } from "../../codec/arrayCodec";
import { UpdateTradeStatusFields } from "../../fields/actions/UpdateTradeStatusFields";

/** Auto-generated from `apps/game/gameActionFactory.js` (UpdateTradeStatus) */
export type UpdateTradeStatusPayload = {
  Status: unknown;
};

export function decodeUpdateTradeStatusPayload(payload: unknown): UpdateTradeStatusPayload {
  assertIsArray(payload, "UpdateTradeStatus payload");
  const arr = payload as PacketArray;
  return {
    Status: arr[UpdateTradeStatusFields.Status] as any,
  };
}

export function buildUpdateTradeStatusPayload(data: UpdateTradeStatusPayload): unknown[] {
  const arr: unknown[] = new Array(1);
  arr[UpdateTradeStatusFields.Status] = data.Status;
  return arr;
}
