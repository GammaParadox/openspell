import { assertIsArray, type PacketArray } from "../../codec/arrayCodec";
import { TradeCompletedFields } from "../../fields/actions/TradeCompletedFields";

/** Auto-generated from `apps/game/gameActionFactory.js` (TradeCompleted) */
export type TradeCompletedPayload = {
  Player1ID: unknown;
  Player2ID: unknown;
  CurrentInventory: unknown;
};

export function decodeTradeCompletedPayload(payload: unknown): TradeCompletedPayload {
  assertIsArray(payload, "TradeCompleted payload");
  const arr = payload as PacketArray;
  return {
    Player1ID: arr[TradeCompletedFields.Player1ID] as any,
    Player2ID: arr[TradeCompletedFields.Player2ID] as any,
    CurrentInventory: arr[TradeCompletedFields.CurrentInventory] as any,
  };
}

export function buildTradeCompletedPayload(data: TradeCompletedPayload): unknown[] {
  const arr: unknown[] = new Array(3);
  arr[TradeCompletedFields.Player1ID] = data.Player1ID;
  arr[TradeCompletedFields.Player2ID] = data.Player2ID;
  arr[TradeCompletedFields.CurrentInventory] = data.CurrentInventory;
  return arr;
}
