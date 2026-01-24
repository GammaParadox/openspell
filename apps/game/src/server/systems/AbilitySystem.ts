/**
 * AbilitySystem.ts - Handles player ability regeneration every tick.
 * 
 * Regenerates player stamina based on their athletics level and sends
 * PlayerAbilityChanged packets to notify clients of the changes.
 */

import { GameAction } from "../../protocol/enums/GameAction";
import { PlayerAbility } from "../../world/PlayerState";
import type { PlayerState } from "../../world/PlayerState";
import { SKILLS } from "../../world/PlayerState";
import { buildPlayerAbilityChangedPayload } from "../../protocol/packets/actions/PlayerAbilityChanged";

type EnqueueUserMessageCallback = (userId: number, action: GameAction, payload: unknown[]) => void;

export type AbilitySystemConfig = {
  playerStates: Map<number, PlayerState>;
  enqueueUserMessage: EnqueueUserMessageCallback;
};

export class AbilitySystem {
  private readonly ABILITY_MAX_VALUE = 10000;
  
  constructor(private readonly config: AbilitySystemConfig) {}

  /**
   * Updates all player abilities (stamina regeneration).
   * Should be called once per server tick.
   */
  update(): void {
    for (const [userId, playerState] of this.config.playerStates.entries()) {
      this.regenerateStamina(userId, playerState);
    }
  }

  /**
   * Regenerates stamina for a single player.
   * Formula: floor(athleticsLevel/10) + 15 stamina per tick
   */
  private regenerateStamina(userId: number, playerState: PlayerState): void {
    const currentStamina = playerState.abilities[PlayerAbility.Stamina];
    
    // Don't regenerate if already at max
    if (currentStamina >= this.ABILITY_MAX_VALUE) {
      return;
    }
    
    // Calculate regeneration amount based on athletics level
    // Use effective level (includes potions + equipment bonuses)
    const athleticsLevel = playerState.getEffectiveLevel(SKILLS.athletics);
    const regenAmount = Math.floor(athleticsLevel / 10) + 15;
    
    // Calculate new stamina value (capped at max)
    const newStamina = Math.min(currentStamina + regenAmount, this.ABILITY_MAX_VALUE);
    
    // Only update if stamina actually changed
    if (newStamina === currentStamina) {
      return;
    }
    
    // Update player state (this also marks the player as dirty for persistence)
    playerState.updateAbility(PlayerAbility.Stamina, newStamina);
    
    // Send packet to client to update their UI
    this.config.enqueueUserMessage(
      userId,
      GameAction.PlayerAbilityChanged,
      buildPlayerAbilityChangedPayload({
        Ability: PlayerAbility.Stamina,
        Value: newStamina
      })
    );
  }
}
