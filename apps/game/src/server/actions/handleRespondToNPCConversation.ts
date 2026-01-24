/**
 * Handles player responses to NPC conversations.
 * Called when player selects a dialogue option.
 */

import { decodeSelectNPCConversationOptionPayload } from "../../protocol/packets/actions/SelectNPCConversationOption";
import type { ActionContext, ActionHandler } from "./types";

/**
 * Handles SelectNPCConversationOption action.
 * Player selects a dialogue option and the conversation advances.
 */
export const handleSelectNPCConversationOption: ActionHandler = (ctx, actionData) => {
  const payload = decodeSelectNPCConversationOptionPayload(actionData);

  // Validate user is authenticated
  if (!ctx.userId) {
    console.warn("[handleSelectNPCConversationOption] No userId - action ignored");
    return;
  }

  // Get active conversation for this player
  const activeConversation = ctx.conversationService.getActiveConversation(ctx.userId);
  if (!activeConversation) {
    console.warn(`[handleSelectNPCConversationOption] Player ${ctx.userId} has no active conversation`);
    return;
  }

  const optionId = payload.PlayerConversationOptionID as number;

  // Validate input
  if (typeof optionId !== "number") {
    console.warn("[handleSelectNPCConversationOption] Invalid payload:", payload);
    return;
  }

  // Handle the response using the stored conversation state
  ctx.conversationService.handlePlayerResponse(
    ctx.userId,
    activeConversation.conversationId,
    activeConversation.currentDialogueId,
    optionId
  );
};
