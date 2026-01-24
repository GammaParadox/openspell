import { assertIsArray, type PacketArray } from "../../codec/arrayCodec";
import { TradeRequestedFields } from "../../fields/actions/TradeRequestedFields";

/** Auto-generated from `apps/game/gameActionFactory.js` (TradeRequested) */
export type TradeRequestedPayload = {
  RequestingPlayerID: unknown;
  OtherPlayerID: unknown;
};

export function decodeTradeRequestedPayload(payload: unknown): TradeRequestedPayload {
  assertIsArray(payload, "TradeRequested payload");
  const arr = payload as PacketArray;
  return {
    RequestingPlayerID: arr[TradeRequestedFields.RequestingPlayerID] as any,
    OtherPlayerID: arr[TradeRequestedFields.OtherPlayerID] as any,
  };
}

export function buildTradeRequestedPayload(data: TradeRequestedPayload): unknown[] {
  const arr: unknown[] = new Array(2);
  arr[TradeRequestedFields.RequestingPlayerID] = data.RequestingPlayerID;
  arr[TradeRequestedFields.OtherPlayerID] = data.OtherPlayerID;
  return arr;
}
