/**
 * CombatSystem.ts - Handles combat resolution each tick.
 * 
 * Architecture:
 * - Runs after MovementSystem (entities are in final positions for this tick)
 * - Checks all aggro'd NPCs and all players targeting NPCs
 * - Validates adjacency (Chebyshev distance of 1) with LOS for melee
 * - Validates range (up to 5 tiles) with LOS for ranged weapons
 * - Processes combat cooldowns (combatDelay)
 * - Delegates damage calculation and broadcasting to DamageService
 * 
 * Combat Flow:
 * 1. Decrement combatDelay for all entities (even without targets, so cooldowns don't freeze)
 * 2. For each player targeting an NPC: check if in range + LOS, if so attack when delay is 0
 * 3. For each NPC with aggro target: check if adjacent + LOS, if so attack when delay is 0
 * 4. Reset combatDelay to attack speed after each attack
 * 5. Damage is capped to target's current HP (can't deal more damage than they have)
 * 6. Entities that reach 0 HP are added to dying collections for death processing
 * 
 * Death Processing:
 * - Entities that die are tracked in dyingNpcs/dyingPlayers sets
 * - External systems (DeathSystem) should call getDyingNpcs()/getDyingPlayers() after combat
 * - Death system handles: animations, loot drops, respawn timers, etc.
 * - Dying collections are cleared at the start of each combat cycle
 */

import { EntityType } from "../../protocol/enums/EntityType";
import type { MapLevel } from "../../world/Location";
import { PlayerState } from "../../world/PlayerState";
import { SKILLS } from "../../world/PlayerState";
import type { NPCState } from "../state/EntityState";
import type { LineOfSightSystem } from "../../world/LineOfSight";
import type { DamageService } from "../services/DamageService";
import type { TargetingService } from "../services/TargetingService";
import type { SpatialIndexManager } from "./SpatialIndexManager";
import type { EntityRef, Position } from "../events/GameEvents";
import { PlayerSetting } from "../../protocol/enums/PlayerSetting";
import { ExperienceService, CombatStyle } from "../services/ExperienceService";
import { States } from "../../protocol/enums/States";
import type { StateMachine } from "../StateMachine";
import { WildernessService } from "../services/WildernessService";
import type { InventoryService } from "../services/InventoryService";
import type { EquipmentService } from "../services/EquipmentService";
import type { ItemManager } from "../../world/systems/ItemManager";
import type { SpellCatalog } from "../../world/spells/SpellCatalog";
import { getPlayerAttackRange, getPlayerCombatMode, isWithinRange } from "../actions/utils/combatMode";
import { buildToggledAutoCastPayload } from "../../protocol/packets/actions/ToggledAutoCast";
import { buildCastedSingleCombatOrStatusSpellPayload } from "../../protocol/packets/actions/CastedSingleCombatOrStatusSpell";
import { GameAction } from "../../protocol/enums/GameAction";
import { getStatusSpellEffect } from "../../world/spells/statusSpellEffects";

export interface CombatSystemConfig {
  playerStates: Map<number, PlayerState>;
  npcStates: Map<number, NPCState>;
  spatialIndex: SpatialIndexManager;
  losSystem: LineOfSightSystem | null;
  damageService: DamageService;
  inventoryService: InventoryService;
  equipmentService: EquipmentService;
  itemManager: ItemManager | null;
  spellCatalog: SpellCatalog | null;
  targetingService: TargetingService;
  experienceService: ExperienceService;
  stateMachine: StateMachine;
  messageService: { sendServerInfo: (userId: number, message: string) => void };
  enqueueUserMessage: (userId: number, action: number, payload: unknown[]) => void;
}

const STAFF_SCROLL_OVERRIDES: Record<number, number> = {
  435: 175, // fire staff provides fire scrolls
  436: 176, // water staff provides water scrolls
  437: 177  // nature staff provides nature scrolls
};

/**
 * System for handling combat between entities.
 */
export class CombatSystem {
  /** NPCs that died this tick mapped to their killer (null if environmental death) */
  private dyingNpcs: Map<number, EntityRef | null> = new Map();
  
  /** Players that died this tick mapped to their killer (null if environmental death) */
  private dyingPlayers: Map<number, EntityRef | null> = new Map();

  /** Tracks player damage dealt to NPCs for kill credit and loot visibility */
  private npcDamageContributors: Map<number, Map<number, number>> = new Map();

  /** Tracks player damage dealt to other players for kill credit and loot visibility */
  private playerDamageContributors: Map<number, Map<number, number>> = new Map();

  constructor(private readonly config: CombatSystemConfig) {}

  /**
   * Main update called once per server tick.
   * @deprecated Use processPlayerCombat() and processNpcCombat() separately in game loop
   * 
   * This method is kept for backward compatibility but the game server should call
   * the individual methods at the appropriate times in the tick cycle.
   */
  update(): void {
    this.clearDyingCollections();
    this.processPlayerCombat();
    this.processNpcCombat();
  }

  /**
   * Clears the dying entity collections.
   * Should be called after DeathSystem has processed the dying entities.
   * Made public so DeathSystem can clear after processing.
   */
  public clearDyingCollections(): void {
    this.dyingNpcs.clear();
    this.dyingPlayers.clear();
  }

  /**
   * Gets the set of NPC IDs that died this tick.
   * These NPCs need death processing (animation, respawn timer, etc.)
   * @deprecated Use getDyingNpcsWithKillers() to get killer information for loot drops
   */
  public getDyingNpcs(): ReadonlySet<number> {
    return new Set(this.dyingNpcs.keys());
  }

  /**
   * Gets the map of NPC IDs that died this tick with their killers.
   * These NPCs need death processing (animation, respawn timer, loot drops, etc.)
   * Map value is the killer EntityRef, or null if environmental death.
   */
  public getDyingNpcsWithKillers(): ReadonlyMap<number, EntityRef | null> {
    return this.dyingNpcs;
  }

  /**
   * Gets the map of Player IDs that died this tick with their killers.
   * These players need death processing (animation, respawn, etc.)
   * Map value is the killer EntityRef, or null if environmental death.
   */
  public getDyingPlayers(): ReadonlyMap<number, EntityRef | null> {
    return this.dyingPlayers;
  }

  /**
   * Marks a player as dying from non-combat damage (e.g., pickpocket stun, environmental hazard).
   * Use this when external systems deal fatal damage outside of combat resolution.
   * 
   * @param userId - The player who died
   * @param killerRef - The entity that killed them (or null for environmental death)
   */
  public markPlayerDying(userId: number, killerRef: EntityRef | null): void {
    // Add to dying players collection
    this.dyingPlayers.set(userId, killerRef);
    
    // Set state to PlayerDeadState
    this.config.stateMachine.setState(
      { type: EntityType.Player, id: userId },
      States.PlayerDeadState
    );
    
    // Clear all NPCs targeting this player to prevent continued attacks
    this.config.targetingService.clearAllNPCsTargetingPlayer(userId);
    
    console.log(`[CombatSystem] Player ${userId} marked as dying from non-combat source`);
  }

  /**
   * Processes combat for all players targeting NPCs.
   * Called in game loop after player movement, before NPC pathfinding.
   * 
   * This ensures players can attack immediately upon arrival before NPCs move away.
   */
  public processPlayerCombat(): void {
    // First pass: Decrement combat delay for ALL players (regardless of targeting)
    // This ensures cooldowns tick down even if player loses target or is idle
    for (const player of this.config.playerStates.values()) {
      if (player.combatDelay > 0) {
        player.combatDelay--;
      }
    }

    // Second pass: Process attacks for players targeting NPCs
    const playersTargetingNPCs = this.config.targetingService.getPlayersTargetingNPCs();
    
    for (const {userId, target} of playersTargetingNPCs) {
      const player = this.config.playerStates.get(userId);
      if (!player) continue;

      // Check if player is actually in a combat state (not just targeting)
      const currentState = this.config.stateMachine.getCurrentState({ type: EntityType.Player, id: userId });
      const isInCombatState = currentState === States.MeleeCombatState || 
                              currentState === States.RangeCombatState || 
                              currentState === States.MagicCombatState;
      
      // Skip if player is targeting but not actively attacking
      if (!isInCombatState) continue;

      // Check if player can attack this tick (delay already decremented above)
      if (player.combatDelay > 0) continue;

      // Get target NPC
      const targetNpc = this.config.npcStates.get(target.id);
      if (!targetNpc) {
        // NPC no longer exists
        continue;
      }

      // Check if player has a ranged weapon equipped
      const combatMode = getPlayerCombatMode(player);
      const attackRange = getPlayerAttackRange(player, this.config.spellCatalog);

      if (combatMode === "melee") {
        if (!this.isAdjacent(player.x, player.y, targetNpc.x, targetNpc.y)) {
          continue;
        }
      } else {
        if (!isWithinRange(player.x, player.y, targetNpc.x, targetNpc.y, attackRange)) {
          continue;
        }
      }

      // Check line of sight (required for both melee and ranged)
      if (!this.hasLineOfSight(player.x, player.y, targetNpc.x, targetNpc.y, player.mapLevel)) {
        continue;
      }

      // Execute attack (handles damage, XP, death tracking, delay reset)
      const attackerRef: EntityRef = { type: EntityType.Player, id: player.userId };
      const targetRef: EntityRef = { type: EntityType.NPC, id: targetNpc.id };
      this.executeAttack(player, targetNpc, attackerRef, targetRef);

      // Auto-retaliate: If NPC has no current target, set target to attacking player
      if (!targetNpc.aggroTarget) {
        this.config.targetingService.setNpcTarget(targetNpc.id, {
          type: EntityType.Player,
          id: player.userId
        });
        
        // Set 3-tick delay before NPC can retaliate (authentic behavior)
        // NPC will immediately face/aggro onto player, but won't deal damage for 3 ticks
        targetNpc.combatDelay = 6;
      }
    }

    // Third pass: Process attacks for players targeting other players
    const playersTargetingPlayers = this.config.targetingService.getPlayersTargetingPlayers();
    const targetingByUserId = new Map<number, EntityRef>();
    const pairKeys = new Set<string>();

    for (const { userId, target } of playersTargetingPlayers) {
      targetingByUserId.set(userId, target);
      if (target.type !== EntityType.Player) continue;
      const minId = Math.min(userId, target.id);
      const maxId = Math.max(userId, target.id);
      pairKeys.add(`${minId}:${maxId}`);
    }

    const sortedPairs = Array.from(pairKeys)
      .map((key) => {
        const [minId, maxId] = key.split(":").map(Number);
        return { minId, maxId };
      })
      .sort((a, b) => a.minId - b.minId || a.maxId - b.maxId);

    for (const { minId, maxId } of sortedPairs) {
      const minTarget = targetingByUserId.get(minId);
      const maxTarget = targetingByUserId.get(maxId);

      if (minTarget?.type === EntityType.Player && minTarget.id === maxId) {
        this.attemptPlayerVsPlayerAttack(minId, maxId);
      }

      if (maxTarget?.type === EntityType.Player && maxTarget.id === minId) {
        this.attemptPlayerVsPlayerAttack(maxId, minId);
      }
    }
  }

  /**
   * Processes combat for all NPCs with aggro targets.
   * Called in game loop after NPC movement.
   * 
   * NPCs use their combat.range from definition (default 1 for melee).
   */
  public processNpcCombat(): void {
    // First pass: Decrement combat delay for ALL NPCs (regardless of aggro target)
    // This ensures NPC cooldowns tick down even if they lose aggro
    for (const npc of this.config.npcStates.values()) {
      if (npc.combatDelay > 0) {
        npc.combatDelay--;
      }
    }

    // Second pass: Process attacks for NPCs with aggro targets
    for (const npc of this.config.npcStates.values()) {
      // Skip NPCs not in combat
      if (!npc.aggroTarget) continue;

      // Check if NPC can attack this tick (delay already decremented above)
      if (npc.combatDelay > 0) continue;

      // Get target position
      const targetPosition = this.getTargetPosition(npc.aggroTarget);
      if (!targetPosition) {
        // Target no longer exists - aggro system will clean this up
        continue;
      }

      // Get NPC's attack range from definition (default to melee)
      const configuredRange = npc.definition.combat?.range ?? 0;
      const isRanged = configuredRange > 0;
      const attackRange = isRanged ? configuredRange : 1;

      // Check range based on NPC's combat range
      if (isRanged) {
        if (!isWithinRange(npc.x, npc.y, targetPosition.x, targetPosition.y, attackRange)) {
          continue;
        }
      } else {
        if (!this.isAdjacent(npc.x, npc.y, targetPosition.x, targetPosition.y)) {
          continue;
        }
      }

      // Check line of sight (required for both melee and ranged)
      if (!this.hasLineOfSight(npc.x, npc.y, targetPosition.x, targetPosition.y, npc.mapLevel)) {
        continue;
      }

      // Get target entity for damage calculation
      const target = this.getTargetEntity(npc.aggroTarget);
      if (!target) continue;

      // Safety check: Skip if target is a dead player (should already be cleared, but defensive check)
      if (npc.aggroTarget.type === EntityType.Player) {
        const targetState = this.config.stateMachine.getCurrentState(npc.aggroTarget);
        if (targetState === States.PlayerDeadState) continue;
      }

      // Execute attack (handles damage, XP, death tracking, delay reset)
      const attackerRef: EntityRef = { type: EntityType.NPC, id: npc.id };
      this.executeAttack(npc, target, attackerRef, npc.aggroTarget);

      // Auto-retaliate: If target is a player with AutoRetaliate enabled, target the attacker
      if (npc.aggroTarget && npc.aggroTarget.type === EntityType.Player) {
        const playerState = this.config.playerStates.get(npc.aggroTarget.id);
        if (playerState) {
          const autoRetaliateEnabled = playerState.settings[PlayerSetting.AutoRetaliate] === 1;
          if (autoRetaliateEnabled) {
            // Set player's target to the attacking NPC (if they don't already have one)
            // TODO: handle range and magic combat states
            if(!this.config.targetingService.getPlayerTarget(npc.aggroTarget.id)) {
              this.config.targetingService.setPlayerTarget(npc.aggroTarget.id, {
                type: EntityType.NPC,
                id: npc.id
              });
              const combatMode = getPlayerCombatMode(playerState);
              const nextState = combatMode === "magic"
                ? States.MagicCombatState
                : combatMode === "range"
                  ? States.RangeCombatState
                  : States.MeleeCombatState;
              this.config.stateMachine.setState({ type: EntityType.Player, id: npc.aggroTarget.id }, nextState);
              
              // Attempt immediate retaliatory attack if player's cooldown is ready
              // If cooldown is active or player is out of range, they'll attack on next tick
              // Not authentic behavior, but can be enabled if needed
              //this.attemptImmediateRetaliate(npc.aggroTarget.id, npc.id);
            }
          }
        }
      }
    }
  }


  /**
   * Checks if two positions are adjacent (Chebyshev distance of 1).
   */
  private isAdjacent(x1: number, y1: number, x2: number, y2: number): boolean {
    const dx = Math.abs(x1 - x2);
    const dy = Math.abs(y1 - y2);
    return dx <= 1 && dy <= 1 && (dx > 0 || dy > 0);
  }


  /**
   * Checks line of sight between two positions.
   * Returns true if there's clear LOS, or if LOS system is unavailable.
   */
  private hasLineOfSight(
    fromX: number,
    fromY: number,
    toX: number,
    toY: number,
    mapLevel: MapLevel
  ): boolean {
    if (!this.config.losSystem) {
      // No LOS system available - assume clear
      return true;
    }
    const result = this.config.losSystem.checkLOS(fromX, fromY, toX, toY, mapLevel);
    return result.hasLOS;
  }

  /**
   * Gets the position of a target entity.
   */
  private getTargetPosition(target: EntityRef): Position | null {
    return this.config.spatialIndex.getEntityPosition(target);
  }

  /**
   * Gets the target entity (PlayerState or NPCState).
   */
  private getTargetEntity(target: EntityRef): PlayerState | NPCState | null {
    if (target.type === EntityType.Player) {
      return this.config.playerStates.get(target.id) ?? null;
    } else if (target.type === EntityType.NPC) {
      return this.config.npcStates.get(target.id) ?? null;
    }
    return null;
  }

  /**
   * Gets the current hitpoints of an entity.
   * For players, hitpoints are stored as a skill's boosted level.
   * For NPCs, hitpoints are stored in hitpointsLevel property.
   */
  private getCurrentHitpoints(entity: PlayerState | NPCState): number {
    if ('userId' in entity) {
      // Entity is a player - hitpoints are stored as a skill
      return entity.getSkillState(SKILLS.hitpoints).boostedLevel;
    } else {
      // Entity is an NPC - hitpoints are stored directly
      return entity.hitpointsLevel;
    }
  }

  /**
   * Executes an attack from one entity to another.
   * Handles damage calculation, capping, broadcasting, XP awards, and death tracking.
   * Works for any combination: Player->NPC, NPC->Player, Player->Player, NPC->NPC.
   * 
   * @param attacker The entity dealing damage
   * @param target The entity receiving damage
   * @param attackerRef EntityRef for the attacker
   * @param targetRef EntityRef for the target
   */
  private executeAttack(
    attacker: PlayerState | NPCState,
    target: PlayerState | NPCState,
    attackerRef: EntityRef,
    targetRef: EntityRef
  ): void {
    if (this.isEntityDead(attacker, attackerRef) || this.isEntityDead(target, targetRef)) {
      return;
    }

    let topDamagerUserIdForReset: number | null = null;
    let rawDamage = 0;
    let projectileItemId: number | null = null;
    let shouldConsumeAmmo = false;
    let isMagicAttack = false;
    let magicSpellId: number | null = null;
    let isRangedAttack = false;

    if ('userId' in attacker) {
      let combatMode = getPlayerCombatMode(attacker);
      if (combatMode === "magic") {
        const activeSpellId = attacker.singleCastSpellId ?? attacker.autoCastSpellId;
        if (activeSpellId === null || !this.consumeSpellResources(attacker, activeSpellId)) {
          if (attacker.singleCastSpellId !== null) {
            attacker.singleCastSpellId = null;
            this.config.messageService.sendServerInfo(
              attacker.userId,
              "You don't have the required runes."
            );
          } else {
            this.handleAutoCastDisabled(attacker);
          }
          combatMode = getPlayerCombatMode(attacker);
        }
      }

      if (combatMode === "magic") {
        magicSpellId = attacker.singleCastSpellId ?? attacker.autoCastSpellId ?? null;
        rawDamage = this.config.damageService.calculateMagicDamage(magicSpellId ?? -1);
        isMagicAttack = true;
      } else if (combatMode === "range") {
        isRangedAttack = true;
        if (!this.ensureRangedAmmo(attacker)) {
          return;
        }
        projectileItemId = attacker.equipment.projectile?.[0] ?? null;
        shouldConsumeAmmo = Math.random() < 1;
        rawDamage = this.config.damageService.calculateRangeDamage(attacker, target);
      } else {
        rawDamage = this.config.damageService.calculateDamage(attacker, target);
      }
    } else {
      const npcRange = attacker.definition.combat?.range ?? 0;
      if (npcRange > 0) {
        projectileItemId = attacker.definition.appearance.projectile ?? null;
        rawDamage = this.config.damageService.calculateRangeDamage(attacker, target);
      } else {
        rawDamage = this.config.damageService.calculateDamage(attacker, target);
      }
    }
    
    // Cap damage to target's current health (can't deal more damage than they have HP)
    const currentHp = this.getCurrentHitpoints(target);
    const actualDamage = Math.min(rawDamage, currentHp);

    // Get target position for broadcasting
    const targetPosition: Position = {
      mapLevel: 'mapLevel' in target ? target.mapLevel : (target as NPCState).mapLevel,
      x: target.x,
      y: target.y
    };

    if (isMagicAttack && magicSpellId !== null) {
      const statusEffect = getStatusSpellEffect(magicSpellId);
      const payload = buildCastedSingleCombatOrStatusSpellPayload({
        SpellID: magicSpellId,
        CasterID: attackerRef.id,
        CasterEntityType: attackerRef.type,
        TargetID: targetRef.id,
        TargetEntityType: targetRef.type,
        DamageAmount: actualDamage,
        IsConfused: statusEffect?.kind === "confuse"
      });
      const viewers = this.config.spatialIndex.getPlayersViewingPosition(
        targetPosition.mapLevel,
        targetPosition.x,
        targetPosition.y
      );
      for (const viewer of viewers) {
        this.config.enqueueUserMessage(viewer.id, GameAction.CastedSingleCombatOrStatusSpell, payload);
      }
      if (attackerRef.type === EntityType.Player && !viewers.some(v => v.id === attackerRef.id)) {
        this.config.enqueueUserMessage(attackerRef.id, GameAction.CastedSingleCombatOrStatusSpell, payload);
      }
    }

    // Broadcast damage to nearby players (use actual damage dealt)
    if ((isRangedAttack || (!('userId' in attacker) && (attacker.definition.combat?.range ?? 0) > 0)) && projectileItemId !== null) {
      this.config.damageService.broadcastProjectile(
        projectileItemId,
        attackerRef,
        targetRef,
        actualDamage,
        targetPosition,
        false
      );
    }
    this.config.damageService.broadcastDamage(
      attackerRef,
      targetRef,
      actualDamage,
      targetPosition
    );

    // Apply damage to target and update hitpoints
    this.config.experienceService.applyDamageToTarget(target, actualDamage);

    if (isRangedAttack && shouldConsumeAmmo && 'userId' in attacker) {
      const consumeResult = this.config.equipmentService.consumeProjectileAmmo(attacker.userId, 1);
      if (consumeResult.success) {
        this.config.inventoryService.sendWeightUpdate(attacker.userId, attacker);
        if (consumeResult.itemId !== undefined && Math.random() < 0.5) {
          this.config.itemManager?.spawnGroundItem(
            consumeResult.itemId,
            1,
            false,
            targetPosition.mapLevel,
            targetPosition.x,
            targetPosition.y,
            undefined,
            null
          );
        }
      }
    }

    // Track player damage dealt to NPCs for kill credit
    if (actualDamage > 0 && attackerRef.type === EntityType.Player && targetRef.type === EntityType.NPC) {
      this.recordNpcDamage(targetRef.id, attackerRef.id, actualDamage);
    }

    // Track player damage dealt to players for kill credit
    if (actualDamage > 0 && attackerRef.type === EntityType.Player && targetRef.type === EntityType.Player) {
      this.recordPlayerDamage(targetRef.id, attackerRef.id, actualDamage);
    }

    if (attackerRef.type === EntityType.Player && targetRef.type === EntityType.Player) {
      const targetPlayer = this.config.playerStates.get(targetRef.id);
      if (targetPlayer) {
        const autoRetaliateEnabled = targetPlayer.settings[PlayerSetting.AutoRetaliate] === 1;
        const currentTarget = this.config.targetingService.getPlayerTarget(targetPlayer.userId);
        if (autoRetaliateEnabled && !currentTarget) {
          this.config.targetingService.setPlayerTarget(targetPlayer.userId, {
            type: EntityType.Player,
            id: attackerRef.id
          });
          const combatMode = getPlayerCombatMode(targetPlayer);
          const nextState = combatMode === "magic"
            ? States.MagicCombatState
            : combatMode === "range"
              ? States.RangeCombatState
              : States.MeleeCombatState;
          this.config.stateMachine.setState(
            { type: EntityType.Player, id: targetPlayer.userId },
            nextState
          );
        }
      }
    }

    // Check if target died from this attack (check after damage is applied)
    if (this.getCurrentHitpoints(target) <= 0) {
      // Add to appropriate dying collection based on target type
      if (targetRef.type === EntityType.Player) {
        // Store player death with killer information
        const topDamagerUserId = this.getTopPlayerDamageDealer(targetRef.id);
        const killerRef = topDamagerUserId !== null
          ? { type: EntityType.Player, id: topDamagerUserId }
          : attackerRef;
        this.dyingPlayers.set(targetRef.id, killerRef);
        this.config.stateMachine.setState({ type: EntityType.Player, id: targetRef.id }, States.PlayerDeadState);
        
        // Immediately clear all NPCs targeting this player to prevent continued attacks
        this.config.targetingService.clearAllNPCsTargetingPlayer(targetRef.id);
        this.playerDamageContributors.delete(targetRef.id);
        
      } else if (targetRef.type === EntityType.NPC) {
        // Store NPC death with killer information (for loot drops)
        const topDamagerUserId = this.getTopDamageDealer(targetRef.id);
        const killerRef = topDamagerUserId !== null
          ? { type: EntityType.Player, id: topDamagerUserId }
          : attackerRef;
        this.dyingNpcs.set(targetRef.id, killerRef);
        this.config.stateMachine.setState({ type: EntityType.NPC, id: targetRef.id }, States.NPCDeadState);
        topDamagerUserIdForReset = topDamagerUserId;

        // Clear damage tracking for this NPC
        this.npcDamageContributors.delete(targetRef.id);
      }
    }

    // Award combat XP if attacker is a player
    if ('userId' in attacker) {
      const combatMode = getPlayerCombatMode(attacker);
      if (combatMode === "range") {
        this.config.experienceService.awardRangedExperience(attacker, actualDamage);
      } else if (combatMode === "magic") {
        const spellDef = this.config.spellCatalog?.getDefinitionById(magicSpellId ?? -1) ?? null;
        this.config.experienceService.awardMagicExperience(attacker, spellDef, actualDamage);
      } else {
        const combatStyle = attacker.settings[PlayerSetting.CombatStyle] as CombatStyle;
        this.config.experienceService.awardCombatExperience(attacker, actualDamage, combatStyle);
      }
    }

    // Reset combat delay to attacker's attack speed
    if ('userId' in attacker) {
      // Attacker is a player
      attacker.combatDelay = this.config.damageService.getPlayerAttackSpeed(attacker);
      if (attacker.singleCastSpellId !== null) {
        attacker.singleCastSpellId = null;
        const nextMode = getPlayerCombatMode(attacker);
        const nextState = nextMode === "magic"
          ? States.MagicCombatState
          : nextMode === "range"
            ? States.RangeCombatState
            : States.MeleeCombatState;
        this.config.stateMachine.setState({ type: EntityType.Player, id: attacker.userId }, nextState);
      }
    } else {
      // Attacker is an NPC
      attacker.combatDelay = this.config.damageService.getNpcAttackSpeed(attacker);
    }

    // If an NPC died, reset swing timer for the top damage dealer
    if (topDamagerUserIdForReset !== null) {
      const topDamager = this.config.playerStates.get(topDamagerUserIdForReset);
      if (topDamager) {
        topDamager.combatDelay = 1;
      }
    }
  }

  /**
   * Attempts an immediate retaliatory attack by a player against an NPC.
   * Called during auto-retaliate to provide instant response if player's cooldown is ready.
   * 
   * @param playerId The player attempting to retaliate
   * @param targetNpcId The NPC being attacked
   * @returns true if immediate attack was performed, false if not (e.g., cooldown not ready, out of range)
   */
  public attemptImmediateRetaliate(playerId: number, targetNpcId: number): boolean {
    const player = this.config.playerStates.get(playerId);
    if (!player) return false;

    // Check if player's cooldown is ready
    // If player has a cooldown active, they can't immediate-retaliate
    if (player.combatDelay > 0) return false;

    // Get target NPC
    const targetNpc = this.config.npcStates.get(targetNpcId);
    if (!targetNpc) return false;

    const combatMode = getPlayerCombatMode(player);
    const attackRange = getPlayerAttackRange(player, this.config.spellCatalog);
    if (combatMode === "melee") {
      if (!this.isAdjacent(player.x, player.y, targetNpc.x, targetNpc.y)) {
        return false;
      }
    } else {
      if (!isWithinRange(player.x, player.y, targetNpc.x, targetNpc.y, attackRange)) {
        return false;
      }
    }

    // Check line of sight (required for both melee and ranged)
    if (!this.hasLineOfSight(player.x, player.y, targetNpc.x, targetNpc.y, player.mapLevel)) {
      return false;
    }

    // All checks passed - perform immediate attack!
    const attackerRef: EntityRef = { type: EntityType.Player, id: player.userId };
    const targetRef: EntityRef = { type: EntityType.NPC, id: targetNpc.id };
    this.executeAttack(player, targetNpc, attackerRef, targetRef);

    return true; // Immediate attack was performed
  }

  /**
   * Records damage dealt by a player to an NPC for kill credit tracking.
   */
  private recordNpcDamage(npcId: number, userId: number, damage: number): void {
    const damageMap = this.npcDamageContributors.get(npcId) ?? new Map<number, number>();
    damageMap.set(userId, (damageMap.get(userId) ?? 0) + damage);
    this.npcDamageContributors.set(npcId, damageMap);
  }

  private recordPlayerDamage(targetUserId: number, attackerUserId: number, damage: number): void {
    const damageMap = this.playerDamageContributors.get(targetUserId) ?? new Map<number, number>();
    damageMap.set(attackerUserId, (damageMap.get(attackerUserId) ?? 0) + damage);
    this.playerDamageContributors.set(targetUserId, damageMap);
  }

  /**
   * Returns the userId of the player who dealt the most damage to an NPC.
   * If no player damage is recorded, returns null.
   */
  private getTopDamageDealer(npcId: number): number | null {
    const damageMap = this.npcDamageContributors.get(npcId);
    if (!damageMap || damageMap.size === 0) return null;

    let topUserId: number | null = null;
    let topDamage = -1;

    for (const [userId, damage] of damageMap.entries()) {
      if (damage > topDamage) {
        topDamage = damage;
        topUserId = userId;
      }
    }

    return topUserId;
  }

  private getTopPlayerDamageDealer(targetUserId: number): number | null {
    const damageMap = this.playerDamageContributors.get(targetUserId);
    if (!damageMap || damageMap.size === 0) return null;

    let topUserId: number | null = null;
    let topDamage = -1;

    for (const [userId, damage] of damageMap.entries()) {
      if (damage > topDamage) {
        topDamage = damage;
        topUserId = userId;
      }
    }

    return topUserId;
  }

  private isEntityDead(entity: PlayerState | NPCState, ref: EntityRef): boolean {
    const currentHp = this.getCurrentHitpoints(entity);
    if (currentHp <= 0) {
      return true;
    }

    if (ref.type === EntityType.Player) {
      return this.config.stateMachine.getCurrentState(ref) === States.PlayerDeadState;
    }

    if (ref.type === EntityType.NPC) {
      return this.config.stateMachine.getCurrentState(ref) === States.NPCDeadState;
    }

    return false;
  }

  private attemptPlayerVsPlayerAttack(attackerId: number, targetId: number): void {
    const attacker = this.config.playerStates.get(attackerId);
    const targetPlayer = this.config.playerStates.get(targetId);
    if (!attacker || !targetPlayer) return;

    const currentState = this.config.stateMachine.getCurrentState({ type: EntityType.Player, id: attackerId });
    const isInCombatState = currentState === States.MeleeCombatState ||
                            currentState === States.RangeCombatState ||
                            currentState === States.MagicCombatState;
    if (!isInCombatState) return;

    if (attacker.combatDelay > 0) return;

    if (!this.canPlayerAttackPlayer(attacker, targetPlayer)) {
      return;
    }

    const combatMode = getPlayerCombatMode(attacker);
    const attackRange = getPlayerAttackRange(attacker, this.config.spellCatalog);
    if (combatMode === "melee") {
      if (!this.isAdjacent(attacker.x, attacker.y, targetPlayer.x, targetPlayer.y)) {
        return;
      }
    } else {
      if (!isWithinRange(attacker.x, attacker.y, targetPlayer.x, targetPlayer.y, attackRange)) {
        return;
      }
    }

    if (!this.hasLineOfSight(attacker.x, attacker.y, targetPlayer.x, targetPlayer.y, attacker.mapLevel)) {
      return;
    }

    const attackerRef: EntityRef = { type: EntityType.Player, id: attacker.userId };
    const targetRef: EntityRef = { type: EntityType.Player, id: targetPlayer.userId };
    this.executeAttack(attacker, targetPlayer, attackerRef, targetRef);
  }

  private canPlayerAttackPlayer(attacker: PlayerState, target: PlayerState): boolean {
    if (!WildernessService.isInWilderness(attacker.x, attacker.y, attacker.mapLevel)) {
      return false;
    }

    if (!WildernessService.isInWilderness(target.x, target.y, target.mapLevel)) {
      return false;
    }

    const wildernessLevel = WildernessService.getWildernessLevel(attacker.x, attacker.y, attacker.mapLevel);
    return WildernessService.canAttackByCombatLevel(attacker.combatLevel, target.combatLevel, wildernessLevel);
  }

  private getInventoryCount(player: PlayerState, itemId: number): number {
    let total = 0;
    for (const item of player.inventory) {
      if (item && item[0] === itemId && item[2] === 0) {
        total += item[1];
      }
    }
    return total;
  }

  private getStaffScrollOverride(player: PlayerState): number | null {
    const weaponId = player.equipment.weapon?.[0] ?? null;
    if (!weaponId) {
      return null;
    }
    return STAFF_SCROLL_OVERRIDES[weaponId] ?? null;
  }

  private handleAutoCastDisabled(player: PlayerState): void {
    if (player.autoCastSpellId === null) {
      return;
    }
    player.autoCastSpellId = null;
    const payload = buildToggledAutoCastPayload({
      SpellID: null
    });
    this.config.enqueueUserMessage(player.userId, GameAction.ToggledAutoCast, payload);
  }

  private ensureRangedAmmo(player: PlayerState): boolean {
    const hasProjectile = !!player.equipment.projectile?.[0];
    if (hasProjectile) {
      return true;
    }

    this.config.messageService.sendServerInfo(
      player.userId,
      "You don't have any arrows equipped!"
    );
    this.config.targetingService.clearPlayerTarget(player.userId);
    this.config.stateMachine.setState(
      { type: EntityType.Player, id: player.userId },
      States.IdleState
    );
    return false;
  }

  private consumeSpellResources(player: PlayerState, spellId: number): boolean {
    const spell = this.config.spellCatalog?.getDefinitionById(spellId);
    if (!spell || (spell.type !== "combat" && spell.type !== "status")) {
      return false;
    }

    const recipe = spell.recipe ?? [];
    const staffOverrideItemId = this.getStaffScrollOverride(player);
    for (const entry of recipe) {
      if (staffOverrideItemId !== null && entry.itemId === staffOverrideItemId) {
        continue;
      }
      const available = this.getInventoryCount(player, entry.itemId);
      if (available < entry.amount) {
        return false;
      }
    }

    for (const entry of recipe) {
      if (staffOverrideItemId !== null && entry.itemId === staffOverrideItemId) {
        continue;
      }
      const result = this.config.inventoryService.removeItem(
        player.userId,
        entry.itemId,
        entry.amount,
        0
      );
      if (result.removed < entry.amount) {
        return false;
      }
    }

    return true;
  }

}
