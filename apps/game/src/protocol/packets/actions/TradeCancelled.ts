import { assertIsArray, type PacketArray } from "../../codec/arrayCodec";
import { TradeCancelledFields } from "../../fields/actions/TradeCancelledFields";

/** Auto-generated from `apps/game/gameActionFactory.js` (TradeCancelled) */
export type TradeCancelledPayload = {
  Player1ID: unknown;
  Player2ID: unknown;
  Reason: unknown;
};

export function decodeTradeCancelledPayload(payload: unknown): TradeCancelledPayload {
  assertIsArray(payload, "TradeCancelled payload");
  const arr = payload as PacketArray;
  return {
    Player1ID: arr[TradeCancelledFields.Player1ID] as any,
    Player2ID: arr[TradeCancelledFields.Player2ID] as any,
    Reason: arr[TradeCancelledFields.Reason] as any,
  };
}

export function buildTradeCancelledPayload(data: TradeCancelledPayload): unknown[] {
  const arr: unknown[] = new Array(3);
  arr[TradeCancelledFields.Player1ID] = data.Player1ID;
  arr[TradeCancelledFields.Player2ID] = data.Player2ID;
  arr[TradeCancelledFields.Reason] = data.Reason;
  return arr;
}
