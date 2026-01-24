import { assertIsArray, type PacketArray } from "../../codec/arrayCodec";
import { ShowLootMenuFields } from "../../fields/actions/ShowLootMenuFields";

/** Auto-generated from `apps/game/gameActionFactory.js` (ShowLootMenu) */
export type ShowLootMenuPayload = {
  Items: unknown;
  Type: unknown;
};

export function decodeShowLootMenuPayload(payload: unknown): ShowLootMenuPayload {
  assertIsArray(payload, "ShowLootMenu payload");
  const arr = payload as PacketArray;
  return {
    Items: arr[ShowLootMenuFields.Items] as any,
    Type: arr[ShowLootMenuFields.Type] as any,
  };
}

export function buildShowLootMenuPayload(data: ShowLootMenuPayload): unknown[] {
  const arr: unknown[] = new Array(2);
  arr[ShowLootMenuFields.Items] = data.Items;
  arr[ShowLootMenuFields.Type] = data.Type;
  return arr;
}
