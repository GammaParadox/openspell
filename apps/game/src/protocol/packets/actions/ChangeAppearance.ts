import { assertIsArray, type PacketArray } from "../../codec/arrayCodec";
import { ChangeAppearanceFields } from "../../fields/actions/ChangeAppearanceFields";

/** Auto-generated from `apps/game/gameActionFactory.js` (ChangeAppearance) */
export type ChangeAppearancePayload = {
  HairID: unknown;
  BeardID: unknown;
  ShirtID: unknown;
  BodyID: unknown;
  PantsID: unknown;
};

export function decodeChangeAppearancePayload(payload: unknown): ChangeAppearancePayload {
  assertIsArray(payload, "ChangeAppearance payload");
  const arr = payload as PacketArray;
  return {
    HairID: arr[ChangeAppearanceFields.HairID] as any,
    BeardID: arr[ChangeAppearanceFields.BeardID] as any,
    ShirtID: arr[ChangeAppearanceFields.ShirtID] as any,
    BodyID: arr[ChangeAppearanceFields.BodyID] as any,
    PantsID: arr[ChangeAppearanceFields.PantsID] as any,
  };
}

export function buildChangeAppearancePayload(data: ChangeAppearancePayload): unknown[] {
  const arr: unknown[] = new Array(5);
  arr[ChangeAppearanceFields.HairID] = data.HairID;
  arr[ChangeAppearanceFields.BeardID] = data.BeardID;
  arr[ChangeAppearanceFields.ShirtID] = data.ShirtID;
  arr[ChangeAppearanceFields.BodyID] = data.BodyID;
  arr[ChangeAppearanceFields.PantsID] = data.PantsID;
  return arr;
}
