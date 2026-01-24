import type { ItemCatalog } from "../items/ItemCatalog";
import type { FullInventory, InventoryItem, PlayerState, PlayerEquipment, EquipmentSlot } from "../PlayerState";
import { EQUIPMENT_SLOTS } from "../PlayerState";
import type { InventorySlotChange } from "./InventoryManager";
import type { EquipmentStack } from "../items/EquipmentStack";

/**
 * Calculates the weight of a single inventory item.
 * IOU items (bank notes) have no weight.
 * 
 * @param item The inventory item tuple [itemId, amount, isIOU]
 * @param itemCatalog The item catalog for looking up item definitions
 * @returns The total weight of the item stack
 */
export function calculateItemWeight(
  item: InventoryItem,
  itemCatalog: ItemCatalog
): number {
  const [itemId, amount, isIOU] = item;
  
  // IOU items have no weight
  if (isIOU === 1) {
    return 0;
  }
  
  const definition = itemCatalog.getDefinitionById(itemId);
  if (!definition) {
    return 0;
  }
  
  return definition.weight * amount;
}

/**
 * Calculates the total weight of an entire inventory.
 * This should only be called once when the player first logs in.
 * After that, use calculateWeightChange for incremental updates.
 * 
 * @param inventory The player's full inventory
 * @param itemCatalog The item catalog for looking up item definitions
 * @returns The total weight
 */
export function calculateTotalWeight(
  inventory: FullInventory,
  itemCatalog: ItemCatalog
): number {
  let totalWeight = 0;
  
  for (const item of inventory) {
    if (item) {
      totalWeight += calculateItemWeight(item, itemCatalog);
    }
  }
  
  return totalWeight;
}

/**
 * Calculates the weight change from inventory slot modifications.
 * This is used for efficient incremental weight updates.
 * 
 * @param changes Array of slot changes from inventory operations
 * @param itemCatalog The item catalog for looking up item definitions
 * @returns The net weight change (positive = added weight, negative = removed weight)
 */
export function calculateWeightChange(
  changes: InventorySlotChange[],
  itemCatalog: ItemCatalog
): number {
  let weightChange = 0;
  
  for (const change of changes) {
    // Subtract weight from previous item (if any)
    if (change.previousItem) {
      weightChange -= calculateItemWeight(change.previousItem, itemCatalog);
    }
    
    // Add weight from new item (if any)
    if (change.newItem) {
      weightChange += calculateItemWeight(change.newItem, itemCatalog);
    }
  }
  
  return weightChange;
}

/**
 * Calculates the weight of a single equipment stack.
 * 
 * @param stack The equipment stack [itemId, amount]
 * @param itemCatalog The item catalog for looking up item definitions
 * @returns The total weight of the equipment stack
 */
export function calculateEquipmentWeight(
  stack: EquipmentStack,
  itemCatalog: ItemCatalog
): number {
  const [itemId, amount] = stack;
  const definition = itemCatalog.getDefinitionById(itemId);
  if (!definition) {
    return 0;
  }
  return definition.weight * amount;
}

/**
 * Calculates the total weight of all equipped items.
 * 
 * @param equipment The player's equipment
 * @param itemCatalog The item catalog for looking up item definitions
 * @returns The total equipped weight
 */
export function calculateTotalEquippedWeight(
  equipment: PlayerEquipment,
  itemCatalog: ItemCatalog
): number {
  let totalWeight = 0;
  
  for (const slot of EQUIPMENT_SLOTS) {
    const stack = equipment[slot];
    if (stack) {
      totalWeight += calculateEquipmentWeight(stack, itemCatalog);
    }
  }
  
  return totalWeight;
}

/**
 * Applies weight changes to a player state from inventory operations.
 * 
 * @param playerState The player state to update
 * @param changes Array of slot changes from inventory operations
 * @param itemCatalog The item catalog for looking up item definitions
 * @returns The weight change amount (for packet sending)
 */
export function applyWeightChange(
  playerState: PlayerState,
  changes: InventorySlotChange[],
  itemCatalog: ItemCatalog
): number {
  const weightChange = calculateWeightChange(changes, itemCatalog);
  if (weightChange !== 0) {
    playerState.addInventoryWeight(weightChange);
  }
  return weightChange;
}

/**
 * Recalculates and sets the player's inventory and equipped weights.
 * Use this when you need to sync weight with inventory/equipment (e.g., on login).
 * 
 * @param playerState The player state to update
 * @param itemCatalog The item catalog for looking up item definitions
 */
export function recalculatePlayerWeight(
  playerState: PlayerState,
  itemCatalog: ItemCatalog
): void {
  const inventoryWeight = calculateTotalWeight(playerState.inventory, itemCatalog);
  const equippedWeight = calculateTotalEquippedWeight(playerState.equipment, itemCatalog);
  playerState.setInventoryWeight(inventoryWeight);
  playerState.setEquippedWeight(equippedWeight);
}
