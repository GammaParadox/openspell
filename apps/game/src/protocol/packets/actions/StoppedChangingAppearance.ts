import { assertIsArray, type PacketArray } from "../../codec/arrayCodec";
import { StoppedChangingAppearanceFields } from "../../fields/actions/StoppedChangingAppearanceFields";

/** Auto-generated from `apps/game/gameActionFactory.js` (StoppedChangingAppearance) */
export type StoppedChangingAppearancePayload = {
  EntityID: unknown;
};

export function decodeStoppedChangingAppearancePayload(payload: unknown): StoppedChangingAppearancePayload {
  assertIsArray(payload, "StoppedChangingAppearance payload");
  const arr = payload as PacketArray;
  return {
    EntityID: arr[StoppedChangingAppearanceFields.EntityID] as any,
  };
}

export function buildStoppedChangingAppearancePayload(data: StoppedChangingAppearancePayload): unknown[] {
  const arr: unknown[] = new Array(1);
  arr[StoppedChangingAppearanceFields.EntityID] = data.EntityID;
  return arr;
}
