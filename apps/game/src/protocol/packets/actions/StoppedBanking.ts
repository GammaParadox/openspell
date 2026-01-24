import { assertIsArray, type PacketArray } from "../../codec/arrayCodec";
import { StoppedBankingFields } from "../../fields/actions/StoppedBankingFields";

/** Auto-generated from `apps/game/gameActionFactory.js` (StoppedBanking) */
export type StoppedBankingPayload = {
  EntityID: unknown;
};

export function decodeStoppedBankingPayload(payload: unknown): StoppedBankingPayload {
  assertIsArray(payload, "StoppedBanking payload");
  const arr = payload as PacketArray;
  return {
    EntityID: arr[StoppedBankingFields.EntityID] as any,
  };
}

export function buildStoppedBankingPayload(data: StoppedBankingPayload): unknown[] {
  const arr: unknown[] = new Array(1);
  arr[StoppedBankingFields.EntityID] = data.EntityID;
  return arr;
}
