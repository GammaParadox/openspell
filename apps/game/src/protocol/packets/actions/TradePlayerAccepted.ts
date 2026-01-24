import { assertIsArray, type PacketArray } from "../../codec/arrayCodec";
import { TradePlayerAcceptedFields } from "../../fields/actions/TradePlayerAcceptedFields";

/** Auto-generated from `apps/game/gameActionFactory.js` (TradePlayerAccepted) */
export type TradePlayerAcceptedPayload = {
  PlayerID: unknown;
};

export function decodeTradePlayerAcceptedPayload(payload: unknown): TradePlayerAcceptedPayload {
  assertIsArray(payload, "TradePlayerAccepted payload");
  const arr = payload as PacketArray;
  return {
    PlayerID: arr[TradePlayerAcceptedFields.PlayerID] as any,
  };
}

export function buildTradePlayerAcceptedPayload(data: TradePlayerAcceptedPayload): unknown[] {
  const arr: unknown[] = new Array(1);
  arr[TradePlayerAcceptedFields.PlayerID] = data.PlayerID;
  return arr;
}
