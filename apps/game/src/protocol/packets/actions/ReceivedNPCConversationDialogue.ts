import { assertIsArray, type PacketArray } from "../../codec/arrayCodec";
import { ReceivedNPCConversationDialogueFields } from "../../fields/actions/ReceivedNPCConversationDialogueFields";

/** Auto-generated from `apps/game/gameActionFactory.js` (ReceivedNPCConversationDialogue) */
export type ReceivedNPCConversationDialoguePayload = {
  EntityID: unknown;
  NPCConversationID: unknown;
  ConversationDialogueID: unknown;
  IsInitialDialogue: boolean;
  NPCText: unknown;
  PlayerConversationOptions: unknown;
};

export function decodeReceivedNPCConversationDialoguePayload(payload: unknown): ReceivedNPCConversationDialoguePayload {
  assertIsArray(payload, "ReceivedNPCConversationDialogue payload");
  const arr = payload as PacketArray;
  return {
    EntityID: arr[ReceivedNPCConversationDialogueFields.EntityID] as any,
    NPCConversationID: arr[ReceivedNPCConversationDialogueFields.NPCConversationID] as any,
    ConversationDialogueID: arr[ReceivedNPCConversationDialogueFields.ConversationDialogueID] as any,
    IsInitialDialogue: arr[ReceivedNPCConversationDialogueFields.IsInitialDialogue] as any,
    NPCText: arr[ReceivedNPCConversationDialogueFields.NPCText] as any,
    PlayerConversationOptions: arr[ReceivedNPCConversationDialogueFields.PlayerConversationOptions] as any,
  };
}

export function buildReceivedNPCConversationDialoguePayload(data: ReceivedNPCConversationDialoguePayload): unknown[] {
  const arr: unknown[] = new Array(6);
  arr[ReceivedNPCConversationDialogueFields.EntityID] = data.EntityID;
  arr[ReceivedNPCConversationDialogueFields.NPCConversationID] = data.NPCConversationID;
  arr[ReceivedNPCConversationDialogueFields.ConversationDialogueID] = data.ConversationDialogueID;
  arr[ReceivedNPCConversationDialogueFields.IsInitialDialogue] = data.IsInitialDialogue ? 1 : 0;
  arr[ReceivedNPCConversationDialogueFields.NPCText] = data.NPCText;
  arr[ReceivedNPCConversationDialogueFields.PlayerConversationOptions] = data.PlayerConversationOptions;
  return arr;
}
