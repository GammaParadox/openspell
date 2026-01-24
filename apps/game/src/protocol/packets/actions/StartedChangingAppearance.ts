import { assertIsArray, type PacketArray } from "../../codec/arrayCodec";
import { StartedChangingAppearanceFields } from "../../fields/actions/StartedChangingAppearanceFields";

/** Auto-generated from `apps/game/gameActionFactory.js` (StartedChangingAppearance) */
export type StartedChangingAppearancePayload = {
  EntityID: unknown;
  IsFirstTime: boolean;
};

export function decodeStartedChangingAppearancePayload(payload: unknown): StartedChangingAppearancePayload {
  assertIsArray(payload, "StartedChangingAppearance payload");
  const arr = payload as PacketArray;
  return {
    EntityID: arr[StartedChangingAppearanceFields.EntityID] as any,
    IsFirstTime: arr[StartedChangingAppearanceFields.IsFirstTime] as any,
  };
}

export function buildStartedChangingAppearancePayload(data: StartedChangingAppearancePayload): unknown[] {
  const arr: unknown[] = new Array(2);
  arr[StartedChangingAppearanceFields.EntityID] = data.EntityID;
  arr[StartedChangingAppearanceFields.IsFirstTime] = data.IsFirstTime ? 1 : 0;
  return arr;
}
