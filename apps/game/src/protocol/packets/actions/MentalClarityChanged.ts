import { assertIsArray, type PacketArray } from "../../codec/arrayCodec";
import { MentalClarityChangedFields } from "../../fields/actions/MentalClarityChangedFields";

/** Auto-generated from `apps/game/gameActionFactory.js` (MentalClarityChanged) */
export type MentalClarityChangedPayload = {
  EntityID: unknown;
  OldMentalClarity: unknown;
  NewMentalClarity: unknown;
};

export function decodeMentalClarityChangedPayload(payload: unknown): MentalClarityChangedPayload {
  assertIsArray(payload, "MentalClarityChanged payload");
  const arr = payload as PacketArray;
  return {
    EntityID: arr[MentalClarityChangedFields.EntityID] as any,
    OldMentalClarity: arr[MentalClarityChangedFields.OldMentalClarity] as any,
    NewMentalClarity: arr[MentalClarityChangedFields.NewMentalClarity] as any,
  };
}

export function buildMentalClarityChangedPayload(data: MentalClarityChangedPayload): unknown[] {
  const arr: unknown[] = new Array(3);
  arr[MentalClarityChangedFields.EntityID] = data.EntityID;
  arr[MentalClarityChangedFields.OldMentalClarity] = data.OldMentalClarity;
  arr[MentalClarityChangedFields.NewMentalClarity] = data.NewMentalClarity;
  return arr;
}
