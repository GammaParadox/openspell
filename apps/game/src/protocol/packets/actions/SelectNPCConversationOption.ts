import { assertIsArray, type PacketArray } from "../../codec/arrayCodec";
import { SelectNPCConversationOptionFields } from "../../fields/actions/SelectNPCConversationOptionFields";

/** Auto-generated from `apps/game/gameActionFactory.js` (SelectNPCConversationOption) */
export type SelectNPCConversationOptionPayload = {
  PlayerConversationOptionID: unknown;
};

export function decodeSelectNPCConversationOptionPayload(payload: unknown): SelectNPCConversationOptionPayload {
  assertIsArray(payload, "SelectNPCConversationOption payload");
  const arr = payload as PacketArray;
  return {
    PlayerConversationOptionID: arr[SelectNPCConversationOptionFields.PlayerConversationOptionID] as any,
  };
}

export function buildSelectNPCConversationOptionPayload(data: SelectNPCConversationOptionPayload): unknown[] {
  const arr: unknown[] = new Array(1);
  arr[SelectNPCConversationOptionFields.PlayerConversationOptionID] = data.PlayerConversationOptionID;
  return arr;
}
