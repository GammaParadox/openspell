/**
 * ConversationService.ts - Manages active NPC conversations.
 * Handles starting conversations, player responses, and conversation actions.
 */

import { GameAction } from "../../protocol/enums/GameAction";
import { buildReceivedNPCConversationDialoguePayload } from "../../protocol/packets/actions/ReceivedNPCConversationDialogue";
import { buildEndedNPCConversationPayload } from "../../protocol/packets/actions/EndedNPCConversation";
import { buildStartedShoppingPayload } from "../../protocol/packets/actions/StartedShopping";
import { EntityType } from "../../protocol/enums/EntityType";
import { States } from "../../protocol/enums/States";
import type { ConversationCatalog, ConversationDialogue, PlayerEventAction } from "../../world/conversations/ConversationCatalog";
import type { PlayerState } from "../../world/PlayerState";
import type { NPCState } from "../state/EntityState";
import type { ShopSystem } from "../systems/ShopSystem";
import type { TargetingService } from "./TargetingService";
import type { StateMachine } from "../StateMachine";
import { RequirementsChecker, type RequirementCheckContext } from "./RequirementsChecker";
import type { MapLevel } from "../../world/Location";

type EnqueueUserMessageCallback = (userId: number, action: GameAction, payload: unknown[]) => void;
type EnqueueBroadcastCallback = (action: GameAction, payload: unknown[]) => void;
type DeleteMovementPlanCallback = (entityRef: { type: EntityType; id: number }) => void;

export interface ConversationServiceDependencies {
  conversationCatalog: ConversationCatalog;
  enqueueUserMessage: EnqueueUserMessageCallback;
  enqueueBroadcast: EnqueueBroadcastCallback;
  npcStates: Map<number, NPCState>;
  playerStatesByUserId: Map<number, PlayerState>;
  shopSystem: ShopSystem;
  deleteMovementPlan: DeleteMovementPlanCallback;
  targetingService: TargetingService;
  stateMachine: StateMachine;
  teleportService: {
    changeMapLevel: (userId: number, x: number, y: number, mapLevel: MapLevel) => { success: boolean };
  };
}

/**
 * Tracks active conversation state for a player.
 */
interface ActiveConversation {
  npcId: number;
  conversationId: number;
  currentDialogueId: number;
}

/**
 * Service for managing NPC conversations.
 */
export class ConversationService {
  /** Maps userId to their active conversation */
  private readonly activeConversations = new Map<number, ActiveConversation>();
  private readonly requirementsChecker: RequirementsChecker;

  constructor(private readonly deps: ConversationServiceDependencies) {
    this.requirementsChecker = new RequirementsChecker();
  }

  /**
   * Starts a conversation with an NPC.
   * Sends the initial dialogue to the player.
   * Makes NPC target player briefly (for visual effect).
   * Sets both NPC and player to conversation states.
   * 
   * @param userId - The player starting the conversation
   * @param npcId - The NPC entity ID
   * @param conversationId - The conversation definition ID
   * @returns true if conversation started successfully
   */
  startConversation(userId: number, npcId: number, conversationId: number): boolean {
    const conversation = this.deps.conversationCatalog.getConversationById(conversationId);
    if (!conversation) {
      console.warn(`[ConversationService] Conversation ${conversationId} not found`);
      return false;
    }

    // Get initial dialogue ID
    const initialDialogueId = this.deps.conversationCatalog.getInitialDialogueId(conversationId);
    const dialogue = this.deps.conversationCatalog.getDialogue(conversationId, initialDialogueId);
    
    if (!dialogue) {
      console.warn(`[ConversationService] Initial dialogue ${initialDialogueId} not found in conversation ${conversationId}`);
      return false;
    }

    // Get NPC and player states
    const npcState = this.deps.npcStates.get(npcId);
    const playerState = this.deps.playerStatesByUserId.get(userId);
    
    if (!npcState) {
      console.warn(`[ConversationService] NPC ${npcId} not found`);
      return false;
    }

    if (!playerState) {
      console.warn(`[ConversationService] Player ${userId} not found`);
      return false;
    }

    // Make NPC target player (visual effect - NPC looks at player)
    // Then immediately clear it (keeps the facing direction)
    this.deps.targetingService.setNpcTarget(npcId, { type: EntityType.Player, id: userId }, false);
    // Don't remember dropped target since this is just a visual effect, not real aggro
    this.deps.targetingService.clearNpcTarget(npcId, false);

    // Delete any active movement plan for the NPC (makes them stand still)
    // Use deleteMovementPlan instead of cancelMovementPlan to avoid unnecessary state transitions
    this.deps.deleteMovementPlan({ type: EntityType.NPC, id: npcId });

    // Set NPC to conversation state (prevents wandering/pathfinding)
    this.deps.stateMachine.setState({ type: EntityType.NPC, id: npcId }, States.NPCConversationState);

    // Set player to conversation state
    playerState.setState(States.ConversationState);

    // Store active conversation
    this.activeConversations.set(userId, {
      npcId,
      conversationId,
      currentDialogueId: initialDialogueId
    });

    // Send initial dialogue to player
    this.sendDialogue(userId, npcId, conversationId, dialogue, true);

    console.log(`[ConversationService] Started conversation ${conversationId} for player ${userId} with NPC ${npcId}`);
    return true;
  }

  /**
   * Handles player response to a conversation dialogue.
   * Advances the conversation based on the selected option.
   * 
   * @param userId - The player responding
   * @param conversationId - The conversation ID
   * @param dialogueId - The current dialogue ID
   * @param optionId - The option the player selected
   */
  handlePlayerResponse(
    userId: number,
    conversationId: number,
    dialogueId: number,
    optionId: number
  ): void {
    // Verify this matches the active conversation
    const active = this.activeConversations.get(userId);
    if (!active) {
      console.warn(`[ConversationService] Player ${userId} has no active conversation`);
      return;
    }

    if (active.conversationId !== conversationId || active.currentDialogueId !== dialogueId) {
      console.warn(`[ConversationService] Conversation state mismatch for player ${userId}`);
      return;
    }

    // Get current dialogue and selected option
    const currentDialogue = this.deps.conversationCatalog.getDialogue(conversationId, dialogueId);
    if (!currentDialogue || !currentDialogue.playerConversationOptions) {
      console.warn(`[ConversationService] Invalid dialogue state`);
      this.endConversation(userId);
      return;
    }


    if(optionId === -1) {
      this.endConversation(userId);
      return;
    }

    const selectedOption = currentDialogue.playerConversationOptions.find((opt) => opt.id === optionId);
    if (!selectedOption) {
      console.warn(`[ConversationService] Invalid option ${optionId} for dialogue ${dialogueId}`);
      return;
    }

    // Check if option leads to next dialogue
    if (selectedOption.nextDialogueId !== null) {
      this.advanceToDialogue(userId, active.npcId, conversationId, selectedOption.nextDialogueId);
    } else {
      // Conversation ends
      console.log(`[ConversationService] Ending conversation ${conversationId} for player ${userId}`);
      this.endConversation(userId);
    }
  }

  /**
   * Advances conversation to a specific dialogue.
   * Executes any actions and sends the next dialogue.
   */
  private advanceToDialogue(
    userId: number,
    npcId: number,
    conversationId: number,
    nextDialogueId: number
  ): void {
    const dialogue = this.deps.conversationCatalog.getDialogue(conversationId, nextDialogueId);
    if (!dialogue) {
      console.warn(`[ConversationService] Dialogue ${nextDialogueId} not found in conversation ${conversationId}`);
      this.endConversation(userId);
      return;
    }

    // Update active conversation state
    const active = this.activeConversations.get(userId);
    if (active) {
      active.currentDialogueId = nextDialogueId;
    }

    // Check for auto-continuance
    if (dialogue.continuanceDialogues && dialogue.continuanceDialogues.length > 0) {
      // Auto-continue to next dialogue (for now, take first continuance)
      const continuance = dialogue.continuanceDialogues[0];
      if (continuance.nextDialogueId !== null) {
        this.advanceToDialogue(userId, npcId, conversationId, continuance.nextDialogueId);
        return;
      }
    }

    // Determine if conversation will end (no text/options to display)
    const willEndConversation = !dialogue.npcText && !dialogue.playerConversationOptions;

    // End conversation BEFORE executing actions (so EndedNPCConversation comes before action packets)
    if (willEndConversation) {
      this.endConversation(userId);
    }

    // Execute any actions attached to this dialogue
    if (dialogue.playerEventActions) {
      this.executeActions(userId, npcId, dialogue.playerEventActions);
    }

    // Send dialogue to player (if it has options or text)
    if (!willEndConversation) {
      this.sendDialogue(userId, npcId, conversationId, dialogue, false);
    }
  }

  /**
   * Sends a dialogue packet to the player.
   * Filters out conversation options that don't meet requirements.
   */
  private sendDialogue(
    userId: number,
    npcId: number,
    conversationId: number,
    dialogue: ConversationDialogue,
    isInitial: boolean
  ): void {
    const playerState = this.deps.playerStatesByUserId.get(userId);
    if (!playerState) {
      console.warn(`[ConversationService] Player ${userId} not found when sending dialogue`);
      return;
    }

    // Format player options - preserve null if no options exist
    // Filter out options that don't meet requirements
    let playerOptions: [number, string][] | null = null;
    if (dialogue.playerConversationOptions) {
      playerOptions = [];
      
      const context: RequirementCheckContext = {
        playerState
      };

      for (const option of dialogue.playerConversationOptions) {
        // Check if option has requirements
        if (option.requirements && option.requirements.length > 0) {
          const requirementCheck = this.requirementsChecker.checkRequirements(
            option.requirements,
            context
          );
          
          // Skip options that don't meet requirements
          if (!requirementCheck.passed) {
            console.log(
              `[ConversationService] Player ${userId} doesn't meet requirements for option ${option.id}: ${requirementCheck.failureReason}`
            );
            continue;
          }
        }
        
        // Option has no requirements or requirements passed
        playerOptions.push([option.id, option.text]);
      }
    }
    if(playerOptions && playerOptions.length == 0) {
      playerOptions = null;
    }
    // Build and send packet
    const payload = buildReceivedNPCConversationDialoguePayload({
      EntityID: npcId,
      NPCConversationID: conversationId,
      ConversationDialogueID: dialogue.id,
      IsInitialDialogue: isInitial,
      NPCText: dialogue.npcText ?? "",
      PlayerConversationOptions: playerOptions
    });

    this.deps.enqueueUserMessage(userId, GameAction.ReceivedNPCConversationDialogue, payload);
  }

  /**
   * Executes actions attached to a dialogue.
   * Actions are executed in sequence, then conversation ends.
   */
  private executeActions(userId: number, npcId: number, actions: PlayerEventAction[]): void {
    for (const action of actions) {
      switch (action.type) {
        case "StartShopping":
          this.handleStartShopping(userId, npcId, action);
          break;
        case "AdvanceQuest":
          this.handleAdvanceQuest(userId, action);
          break;
        case "GiveItem":
          this.handleGiveItem(userId, action);
          break;
        case "TeleportTo":
          this.handleTeleportTo(userId, action);
          break;
        default:
          console.warn(`[ConversationService] Unknown action type: ${action.type}`);
      }
    }
  }

  /**
   * Handles the StartShopping action.
   * Sends StartedShopping packet to open shop interface with current stock.
   * Automatically ends the conversation to free the NPC from conversation state.
   */
  private handleStartShopping(userId: number, npcId: number, action: PlayerEventAction): void {
    const shopId = action.shopId as number | undefined;
    const playerState = this.deps.playerStatesByUserId.get(userId);
    
    if (!playerState) {
      console.warn(`[ConversationService] Player ${userId} not found`);
      return;
    }

    if (shopId === undefined) {
      console.warn(`[ConversationService] StartShopping action missing shopId`);
      return;
    }

    console.log(`[ConversationService] Player ${userId} opening shop ${shopId} with NPC ${npcId}`);
    
    // Get current stock from ShopSystem (50-element array with nulls for empty slots)
    const currentStock = this.deps.shopSystem.getCurrentStock(shopId);

    const payload = buildStartedShoppingPayload({
      ShopID: shopId,
      EntityID: userId, // Player's userId, not NPC's entity ID
      CurrentStock: currentStock
    });

    this.deps.enqueueUserMessage(userId, GameAction.StartedShopping, payload);

    // Set player to shopping state and track which shop they're browsing
    playerState.setState(States.ShoppingState);
    playerState.currentShopId = shopId;

    // End the conversation so NPC is freed from conversation state
    // This allows the NPC to wander/move again while player shops
    // Only end if conversation is still active (prevents double-ending)
    if (this.activeConversations.has(userId)) {
      this.endConversation(userId);
    }
  }

  /**
   * Handles quest advancement actions.
   * TODO: Integrate with quest system when implemented.
   */
  private handleAdvanceQuest(userId: number, action: PlayerEventAction): void {
    const questId = action.questid as number | undefined;
    const checkpoint = action.checkpoint as number | undefined;
    
    console.log(`[ConversationService] TODO: Advance quest ${questId} to checkpoint ${checkpoint} for player ${userId}`);
    // TODO: Implement quest progression
  }

  /**
   * Handles giving items to player.
   * TODO: Integrate with inventory system when implemented.
   */
  private handleGiveItem(userId: number, action: PlayerEventAction): void {
    console.log(`[ConversationService] TODO: Give item to player ${userId}`, action);
    // TODO: Implement item rewards
  }

  /**
   * Handles the TeleportTo action.
   * Teleports the player to a specific location.
   */
  private handleTeleportTo(userId: number, action: PlayerEventAction): void {
    const location = action.location as { x: number; y: number; lvl: number } | undefined;
    
    if (!location || location.x === undefined || location.y === undefined || location.lvl === undefined) {
      console.warn(`[ConversationService] TeleportTo action missing location data`);
      return;
    }

    console.log(`[ConversationService] Teleporting player ${userId} to (${location.x}, ${location.y}, ${location.lvl})`);
    
    const result = this.deps.teleportService.changeMapLevel(
      userId,
      location.x,
      location.y,
      location.lvl as MapLevel
    );

    if (!result.success) {
      console.warn(`[ConversationService] Failed to teleport player ${userId}`);
    }
  }

  /**
   * Ends a conversation for a player.
   * Sends EndedNPCConversation packet and clears conversation state.
   * 
   * @param userId - The player whose conversation is ending
   * @param handleStateTransitions - If true, also transitions player/NPC to IdleState.
   *                                  Set to false when called from FSM exitState handler
   *                                  (FSM handles state transitions itself).
   */
  endConversation(userId: number, handleStateTransitions: boolean = true): void {
    const active = this.activeConversations.get(userId);
    if (!active) {
      console.warn(`[ConversationService] Cannot end conversation - no active conversation for player ${userId}`);
      return;
    }

    if (handleStateTransitions) {
      // Get NPC and player states to clear their conversation states
      const npcState = this.deps.npcStates.get(active.npcId);
      const playerState = this.deps.playerStatesByUserId.get(userId);

      // Clear NPC conversation state (allow wandering again)
      if (npcState && npcState.currentState === States.NPCConversationState) {
        this.deps.stateMachine.setState({ type: EntityType.NPC, id: active.npcId }, States.IdleState);
      }

      // Clear player conversation state
      if (playerState && playerState.currentState === States.ConversationState) {
        playerState.setState(States.IdleState);
      }
    } else {
      // FSM is handling player state transition, but we still need to clear NPC state
      const npcState = this.deps.npcStates.get(active.npcId);
      if (npcState && npcState.currentState === States.NPCConversationState) {
        this.deps.stateMachine.setState({ type: EntityType.NPC, id: active.npcId }, States.IdleState);
      }
    }

    // Send EndedNPCConversation packet
    const payload = buildEndedNPCConversationPayload({
      EntityID: active.npcId
    });
    this.deps.enqueueUserMessage(userId, GameAction.EndedNPCConversation, payload);

    // Clear conversation state
    this.activeConversations.delete(userId);
    console.log(`[ConversationService] Ended conversation with NPC ${active.npcId} for player ${userId}`);
  }

  /**
   * Gets the active conversation for a player (if any).
   */
  getActiveConversation(userId: number): ActiveConversation | undefined {
    return this.activeConversations.get(userId);
  }
}
