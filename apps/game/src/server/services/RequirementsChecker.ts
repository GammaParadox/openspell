import { PlayerState, SKILLS, SkillSlug, EQUIPMENT_SLOTS, EquipmentSlot } from "../../world/PlayerState";
import type { InventoryItem, BankItem } from "../../world/PlayerState";

/**
 * Base requirement interface - all requirement types extend this
 */
export interface BaseRequirement {
  desc: string;
  type: string;
}

/**
 * Quest requirement - checks if player is at a specific quest checkpoint
 */
export interface QuestRequirement extends BaseRequirement {
  type: "quest";
  questid: number;
  checkpoint: number | number[]; // Can be a single checkpoint or array of checkpoints
  booleanoperator: "or" | "and" | null;
  operator?: ">=" | "<=" | "===" | ">" | "<" | "!=";
}

/**
 * Skill requirement - checks if player has required skill level
 */
export interface SkillRequirement extends BaseRequirement {
  type: "skill";
  skill: string; // Skill name (e.g., "mining", "hitpoints")
  level: number;
  operator: ">=" | "<=" | "===" | ">" | "<" | "!=";
}

/**
 * Equipped item requirement - checks if player has specific items equipped
 */
export interface EquippedItemRequirement extends BaseRequirement {
  type: "equippeditem";
  equipmenttype: string | null; // Equipment slot (e.g., "helmet", "weapon") or null for any
  itemids: number[] | null; // Array of acceptable item IDs or null for any
  isequipped: boolean | null; // true = must be equipped, false = must not be equipped, null = check if any items equipped
}

/**
 * Player owns item requirement - checks if player owns an item (in bank, inventory, or loadout)
 */
export interface PlayerOwnsItemRequirement extends BaseRequirement {
  type: "playerownsitem";
  itemid: number;
  amount: number;
  isiou: boolean;
  operator?: "===" | ">=" | "<=" | ">" | "<" | "!=";
}

/**
 * Inventory item requirement - checks if player has an item in their inventory only
 */
export interface InventoryItemRequirement extends BaseRequirement {
  type: "inventoryitem";
  itemid: number;
  amount: number;
  isiou: boolean;
  operator?: "===" | ">=" | "<=" | ">" | "<" | "!=";
}

/**
 * Union type of all requirement types
 */
export type Requirement =
  | QuestRequirement
  | SkillRequirement
  | EquippedItemRequirement
  | PlayerOwnsItemRequirement
  | InventoryItemRequirement;

/**
 * Result of a requirement check
 */
export interface RequirementCheckResult {
  passed: boolean;
  failureReason?: string;
}

/**
 * Context needed for checking requirements
 */
export interface RequirementCheckContext {
  playerState: PlayerState;
}

/**
 * Service for checking if a player meets specific requirements
 */
export class RequirementsChecker {
  /**
   * Checks if a player meets all requirements in an array
   */
  checkRequirements(
    requirements: unknown[],
    context: RequirementCheckContext
  ): RequirementCheckResult {
    if (!Array.isArray(requirements) || requirements.length === 0) {
      return { passed: true };
    }

    for (const req of requirements) {
      const result = this.checkRequirement(req as Requirement, context);
      if (!result.passed) {
        return result;
      }
    }

    return { passed: true };
  }

  /**
   * Checks a single requirement
   */
  private checkRequirement(
    requirement: Requirement,
    context: RequirementCheckContext
  ): RequirementCheckResult {
    switch (requirement.type) {
      case "quest":
        return this.checkQuestRequirement(requirement, context);
      case "skill":
        return this.checkSkillRequirement(requirement, context);
      case "equippeditem":
        return this.checkEquippedItemRequirement(requirement, context);
      case "playerownsitem":
        return this.checkPlayerOwnsItemRequirement(requirement, context);
      case "inventoryitem":
        return this.checkInventoryItemRequirement(requirement, context);
      default:
        console.warn(`[RequirementsChecker] Unknown requirement type:`, requirement);
        return {
          passed: false,
          failureReason: `Unknown requirement type: ${(requirement as any).type}`,
        };
    }
  }

  /**
   * Checks quest requirement
   */
  private checkQuestRequirement(
    requirement: QuestRequirement,
    context: RequirementCheckContext
  ): RequirementCheckResult {
    const { playerState } = context;

    const currentCheckpoint = playerState.getQuestCheckpoint(requirement.questid);

    // Handle array of checkpoints with boolean operator
    if (Array.isArray(requirement.checkpoint)) {
      const checkpoints = requirement.checkpoint;
      const operator = requirement.booleanoperator || "or";

      if (operator === "or") {
        // Player must be at any of the checkpoints
        const atCheckpoint = checkpoints.includes(currentCheckpoint);
        if (!atCheckpoint) {
          return {
            passed: false,
            failureReason: `${requirement.desc} (quest ${requirement.questid}, need checkpoint ${checkpoints.join(" or ")}, at ${currentCheckpoint})`,
          };
        }
      } else if (operator === "and") {
        // This is unusual but handle it - player must somehow satisfy all checkpoints?
        // For now, just check if at the highest checkpoint
        const maxCheckpoint = Math.max(...checkpoints);
        if (currentCheckpoint < maxCheckpoint) {
          return {
            passed: false,
            failureReason: `${requirement.desc} (quest ${requirement.questid}, need all checkpoints ${checkpoints.join(" and ")})`,
          };
        }
      }
    } else {
      // Single checkpoint - default operator is >= (at or past checkpoint)
      const operator = requirement.operator || ">=";
      const targetCheckpoint = requirement.checkpoint;

      if (!this.compareNumbers(currentCheckpoint, operator, targetCheckpoint)) {
        return {
          passed: false,
          failureReason: `${requirement.desc} (quest ${requirement.questid}, need checkpoint ${operator} ${targetCheckpoint}, at ${currentCheckpoint})`,
        };
      }
    }

    return { passed: true };
  }

  /**
   * Checks skill requirement
   */
  private checkSkillRequirement(
    requirement: SkillRequirement,
    context: RequirementCheckContext
  ): RequirementCheckResult {
    const { playerState } = context;

    // Map skill name to skill slug
    const skillSlug = this.getSkillSlug(requirement.skill);
    if (!skillSlug) {
      console.warn(
        `[RequirementsChecker] Unknown skill: ${requirement.skill}`
      );
      return {
        passed: false,
        failureReason: `Unknown skill: ${requirement.skill}`,
      };
    }

    const currentLevel = playerState.getSkillLevel(skillSlug);
    const requiredLevel = requirement.level;
    const operator = requirement.operator;

    if (!this.compareNumbers(currentLevel, operator, requiredLevel)) {
      return {
        passed: false,
        failureReason: `${requirement.desc} (${requirement.skill} level ${currentLevel}, need ${operator} ${requiredLevel})`,
      };
    }

    return { passed: true };
  }

  /**
   * Checks equipped item requirement
   */
  private checkEquippedItemRequirement(
    requirement: EquippedItemRequirement,
    context: RequirementCheckContext
  ): RequirementCheckResult {
    const { playerState } = context;

    // Special case: check if NO items are equipped
    if (
      requirement.equipmenttype === null &&
      requirement.itemids === null &&
      requirement.isequipped === null
    ) {
      // Check if any items are equipped
      const hasAnyEquipped = EQUIPMENT_SLOTS.some(
        (slot) => playerState.getEquipment(slot) !== null
      );

      if (hasAnyEquipped) {
        return {
          passed: false,
          failureReason: `${requirement.desc} (has items equipped)`,
        };
      }
      return { passed: true };
    }

    // If equipmenttype is specified, check that specific slot
    if (requirement.equipmenttype) {
      const slot = requirement.equipmenttype as EquipmentSlot;
      const equipped = playerState.getEquipment(slot);

      // If isequipped is false, we want the slot to be empty
      if (requirement.isequipped === false) {
        if (equipped !== null) {
          return {
            passed: false,
            failureReason: `${requirement.desc} (has ${requirement.equipmenttype} equipped)`,
          };
        }
        return { passed: true };
      }

      // Check if slot has equipment
      if (equipped === null) {
        return {
          passed: false,
          failureReason: `${requirement.desc} (no ${requirement.equipmenttype} equipped)`,
        };
      }

      // If specific item IDs are required, check if equipped item matches
      if (requirement.itemids && requirement.itemids.length > 0) {
        const equippedItemId = equipped[0]; // EquipmentStack is [itemDefId, amount]
        if (!requirement.itemids.includes(equippedItemId)) {
          return {
            passed: false,
            failureReason: `${requirement.desc} (wrong ${requirement.equipmenttype} equipped)`,
          };
        }
      }

      return { passed: true };
    }

    // Check if any items are equipped (generic check)
    const hasAnyEquipped = EQUIPMENT_SLOTS.some(
      (slot) => playerState.getEquipment(slot) !== null
    );

    if (requirement.isequipped === false && hasAnyEquipped) {
      return {
        passed: false,
        failureReason: `${requirement.desc} (has items equipped)`,
      };
    }

    if (requirement.isequipped === true && !hasAnyEquipped) {
      return {
        passed: false,
        failureReason: `${requirement.desc} (no items equipped)`,
      };
    }

    return { passed: true };
  }

  /**
   * Checks player owns item requirement (bank + inventory + equipment)
   */
  private checkPlayerOwnsItemRequirement(
    requirement: PlayerOwnsItemRequirement,
    context: RequirementCheckContext
  ): RequirementCheckResult {
    const { playerState } = context;
    const targetItemId = requirement.itemid;
    const targetAmount = requirement.amount;
    const checkIOU = requirement.isiou;
    const operator = requirement.operator || "===";

    let totalOwned = 0;

    // Count in inventory
    totalOwned += this.countItemInInventory(
      playerState.inventory,
      targetItemId,
      checkIOU
    );

    // Count in equipment
    totalOwned += this.countItemInEquipment(playerState, targetItemId);

    // Count in bank (if loaded)
    if (playerState.bank) {
      totalOwned += this.countItemInBank(playerState.bank, targetItemId);
    }

    if (!this.compareNumbers(totalOwned, operator, targetAmount)) {
      return {
        passed: false,
        failureReason: `${requirement.desc} (has ${totalOwned}, need ${operator} ${targetAmount})`,
      };
    }

    return { passed: true };
  }

  /**
   * Checks inventory item requirement (inventory only, not bank or equipment)
   */
  private checkInventoryItemRequirement(
    requirement: InventoryItemRequirement,
    context: RequirementCheckContext
  ): RequirementCheckResult {
    const { playerState } = context;
    const targetItemId = requirement.itemid;
    const targetAmount = requirement.amount;
    const checkIOU = requirement.isiou;
    const operator = requirement.operator || ">=";

    // Count only in inventory
    const inventoryCount = this.countItemInInventory(
      playerState.inventory,
      targetItemId,
      checkIOU
    );

    if (!this.compareNumbers(inventoryCount, operator, targetAmount)) {
      return {
        passed: false,
        failureReason: `${requirement.desc} (has ${inventoryCount} in inventory, need ${operator} ${targetAmount})`,
      };
    }

    return { passed: true };
  }

  /**
   * Helper: Count items in inventory
   */
  private countItemInInventory(
    inventory: (InventoryItem | null)[],
    itemId: number,
    checkIOU: boolean
  ): number {
    let count = 0;
    for (const item of inventory) {
      if (item && item[0] === itemId) {
        // item[2] is isIOU flag (0 or 1)
        if (checkIOU && item[2] === 1) {
          count += item[1]; // item[1] is amount
        } else if (!checkIOU && item[2] === 0) {
          count += item[1];
        }
      }
    }
    return count;
  }

  /**
   * Helper: Count items in equipment
   */
  private countItemInEquipment(playerState: PlayerState, itemId: number): number {
    let count = 0;
    for (const slot of EQUIPMENT_SLOTS) {
      const equipped = playerState.getEquipment(slot);
      if (equipped && equipped[0] === itemId) { // EquipmentStack is [itemDefId, amount]
        count += equipped[1];
      }
    }
    return count;
  }

  /**
   * Helper: Count items in bank
   */
  private countItemInBank(bank: (BankItem | null)[], itemId: number): number {
    let count = 0;
    for (const item of bank) {
      if (item && item[0] === itemId) {
        count += item[1]; // item[1] is amount
      }
    }
    return count;
  }

  /**
   * Helper: Compare numbers with operator
   */
  private compareNumbers(
    actual: number,
    operator: string,
    expected: number
  ): boolean {
    switch (operator) {
      case "===":
      case "==":
        return actual === expected;
      case ">=":
        return actual >= expected;
      case "<=":
        return actual <= expected;
      case ">":
        return actual > expected;
      case "<":
        return actual < expected;
      case "!=":
      case "!==":
        return actual !== expected;
      default:
        console.warn(`[RequirementsChecker] Unknown operator: ${operator}`);
        return false;
    }
  }

  /**
   * Helper: Map skill name string to SkillSlug
   */
  private getSkillSlug(skillName: string): SkillSlug | null {
    const normalized = skillName.toLowerCase().trim();
    
    // Direct match first
    if (normalized in SKILLS) {
      return SKILLS[normalized as keyof typeof SKILLS];
    }

    // Try to find a match
    for (const [key, value] of Object.entries(SKILLS)) {
      if (key.toLowerCase() === normalized) {
        return value;
      }
    }

    return null;
  }
}
