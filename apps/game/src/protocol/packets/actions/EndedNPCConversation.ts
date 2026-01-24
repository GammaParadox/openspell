import { assertIsArray, type PacketArray } from "../../codec/arrayCodec";
import { EndedNPCConversationFields } from "../../fields/actions/EndedNPCConversationFields";

/** Auto-generated from `apps/game/gameActionFactory.js` (EndedNPCConversation) */
export type EndedNPCConversationPayload = {
  EntityID: unknown;
};

export function decodeEndedNPCConversationPayload(payload: unknown): EndedNPCConversationPayload {
  assertIsArray(payload, "EndedNPCConversation payload");
  const arr = payload as PacketArray;
  return {
    EntityID: arr[EndedNPCConversationFields.EntityID] as any,
  };
}

export function buildEndedNPCConversationPayload(data: EndedNPCConversationPayload): unknown[] {
  const arr: unknown[] = new Array(1);
  arr[EndedNPCConversationFields.EntityID] = data.EntityID;
  return arr;
}
