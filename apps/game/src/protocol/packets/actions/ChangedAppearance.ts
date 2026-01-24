import { assertIsArray, type PacketArray } from "../../codec/arrayCodec";
import { ChangedAppearanceFields } from "../../fields/actions/ChangedAppearanceFields";

/** Auto-generated from `apps/game/gameActionFactory.js` (ChangedAppearance) */
export type ChangedAppearancePayload = {
  EntityID: unknown;
  HairID: unknown;
  BeardID: unknown;
  ShirtID: unknown;
  BodyID: unknown;
  PantsID: unknown;
};

export function decodeChangedAppearancePayload(payload: unknown): ChangedAppearancePayload {
  assertIsArray(payload, "ChangedAppearance payload");
  const arr = payload as PacketArray;
  return {
    EntityID: arr[ChangedAppearanceFields.EntityID] as any,
    HairID: arr[ChangedAppearanceFields.HairID] as any,
    BeardID: arr[ChangedAppearanceFields.BeardID] as any,
    ShirtID: arr[ChangedAppearanceFields.ShirtID] as any,
    BodyID: arr[ChangedAppearanceFields.BodyID] as any,
    PantsID: arr[ChangedAppearanceFields.PantsID] as any,
  };
}

export function buildChangedAppearancePayload(data: ChangedAppearancePayload): unknown[] {
  const arr: unknown[] = new Array(6);
  arr[ChangedAppearanceFields.EntityID] = data.EntityID;
  arr[ChangedAppearanceFields.HairID] = data.HairID;
  arr[ChangedAppearanceFields.BeardID] = data.BeardID;
  arr[ChangedAppearanceFields.ShirtID] = data.ShirtID;
  arr[ChangedAppearanceFields.BodyID] = data.BodyID;
  arr[ChangedAppearanceFields.PantsID] = data.PantsID;
  return arr;
}
