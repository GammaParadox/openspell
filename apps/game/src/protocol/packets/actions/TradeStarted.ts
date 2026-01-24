import { assertIsArray, type PacketArray } from "../../codec/arrayCodec";
import { TradeStartedFields } from "../../fields/actions/TradeStartedFields";

/** Auto-generated from `apps/game/gameActionFactory.js` (TradeStarted) */
export type TradeStartedPayload = {
  Player1ID: unknown;
  Player2ID: unknown;
};

export function decodeTradeStartedPayload(payload: unknown): TradeStartedPayload {
  assertIsArray(payload, "TradeStarted payload");
  const arr = payload as PacketArray;
  return {
    Player1ID: arr[TradeStartedFields.Player1ID] as any,
    Player2ID: arr[TradeStartedFields.Player2ID] as any,
  };
}

export function buildTradeStartedPayload(data: TradeStartedPayload): unknown[] {
  const arr: unknown[] = new Array(2);
  arr[TradeStartedFields.Player1ID] = data.Player1ID;
  arr[TradeStartedFields.Player2ID] = data.Player2ID;
  return arr;
}
