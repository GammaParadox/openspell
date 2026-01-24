import { GameAction } from "../../protocol/enums/GameAction";
import { MessageStyle } from "../../protocol/enums/MessageStyle";
import { PlayerType } from "../../protocol/enums/PlayerType";
import { EntityType } from "../../protocol/enums/EntityType";
import { buildPublicMessagePayload } from "../../protocol/packets/actions/PublicMessage";
import { buildGlobalPublicMessagePayload } from "../../protocol/packets/actions/GlobalPublicMessage";
import { buildServerInfoMessagePayload } from "../../protocol/packets/actions/ServerInfoMessage";
import type { PlayerState } from "../../world/PlayerState";
import type { VisibilitySystem } from "../systems/VisibilitySystem";
import type { EntityRef } from "../events/GameEvents";

export interface MessageServiceDependencies {
  playerStatesByUserId: Map<number, PlayerState>;
  visibilitySystem: VisibilitySystem;
  enqueueUserMessage: (userId: number, action: GameAction, payload: unknown[]) => void;
  enqueueBroadcast: (action: GameAction, payload: unknown[]) => void;
}

/**
 * Service for handling chat messages and server notifications.
 * Manages public messages, global chat, and server info messages.
 */
export class MessageService {
  constructor(private readonly deps: MessageServiceDependencies) {}

  /**
   * Sends a server info message to a specific player.
   * Used for notifications, errors, and command responses.
   * 
   * @param userId The player to send the message to
   * @param message The message text
   * @param style The message style/color (defaults to Green)
   */
  sendServerInfo(userId: number, message: string, style: MessageStyle = MessageStyle.White) {
    const payload = buildServerInfoMessagePayload({
      Message: message,
      Style: style
    });
    this.deps.enqueueUserMessage(userId, GameAction.ServerInfoMessage, payload);
  }

  /**
   * Sends a public message from a player to nearby players.
   * Uses the visibility system to determine who can see the message.
   * 
   * @param userId The player sending the message
   * @param message The message text
   * @param style The message style
   */
  sendPublicMessage(userId: number, message: string, style: MessageStyle) {
    const playerState = this.deps.playerStatesByUserId.get(userId);
    if (!playerState) return;

    const outgoingPayload = buildPublicMessagePayload({
      EntityID: userId,
      Style: style,
      Message: message,
      PlayerType: playerState.playerType as PlayerType
    });

    // Get watchers from VisibilitySystem for spatial broadcast
    const entityRef: EntityRef = { type: EntityType.Player, id: userId };
    const watchers = this.deps.visibilitySystem.getWatchers(entityRef);

    // Send to self
    this.deps.enqueueUserMessage(userId, GameAction.PublicMessage, outgoingPayload);

    // Send to all nearby watchers
    for (const viewer of watchers) {
      this.deps.enqueueUserMessage(viewer, GameAction.PublicMessage, outgoingPayload);
    }
  }

  /**
   * Sends a global message to all connected players.
   * Typically used for global chat (/g command) or server-wide announcements.
   * 
   * @param userId The player sending the message (or 0 for system messages)
   * @param username The username to display
   * @param message The message text
   * @param playerType The player's privilege level
   */
  sendGlobalMessage(userId: number, username: string, message: string, playerType: PlayerType) {
    const outgoingPayload = buildGlobalPublicMessagePayload({
      EntityID: userId,
      Name: username,
      Message: message,
      PlayerType: playerType
    });
    this.deps.enqueueBroadcast(GameAction.GlobalPublicMessage, outgoingPayload);
  }
}
