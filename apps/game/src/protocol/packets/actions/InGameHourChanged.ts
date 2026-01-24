import { assertIsArray, type PacketArray } from "../../codec/arrayCodec";
import { InGameHourChangedFields } from "../../fields/actions/InGameHourChangedFields";

/** Auto-generated from `apps/game/gameActionFactory.js` (InGameHourChanged) */
export type InGameHourChangedPayload = {
  CurrentHour: unknown;
};

export function decodeInGameHourChangedPayload(payload: unknown): InGameHourChangedPayload {
  assertIsArray(payload, "InGameHourChanged payload");
  const arr = payload as PacketArray;
  return {
    CurrentHour: arr[InGameHourChangedFields.CurrentHour] as any,
  };
}

export function buildInGameHourChangedPayload(data: InGameHourChangedPayload): unknown[] {
  const arr: unknown[] = new Array(1);
  arr[InGameHourChangedFields.CurrentHour] = data.CurrentHour;
  return arr;
}
