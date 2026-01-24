import { assertIsArray, type PacketArray } from "../../codec/arrayCodec";
import { StartedBankingFields } from "../../fields/actions/StartedBankingFields";

/** Auto-generated from `apps/game/gameActionFactory.js` (StartedBanking) */
export type StartedBankingPayload = {
  EntityID: unknown;
  BankID: unknown;
};

export function decodeStartedBankingPayload(payload: unknown): StartedBankingPayload {
  assertIsArray(payload, "StartedBanking payload");
  const arr = payload as PacketArray;
  return {
    EntityID: arr[StartedBankingFields.EntityID] as any,
    BankID: arr[StartedBankingFields.BankID] as any,
  };
}

export function buildStartedBankingPayload(data: StartedBankingPayload): unknown[] {
  const arr: unknown[] = new Array(2);
  arr[StartedBankingFields.EntityID] = data.EntityID;
  arr[StartedBankingFields.BankID] = data.BankID;
  return arr;
}
