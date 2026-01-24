import { MenuType } from "../../protocol/enums/MenuType";
import type { ItemCatalog, ItemDefinition } from "../items/ItemCatalog";
import type { InventoryItem, FullInventory } from "../PlayerState";
import { INVENTORY_SLOT_COUNT } from "../PlayerState";

/**
 * Maximum stack size for stackable items.
 * Using a safe integer that fits in the protocol.
 */
export const MAX_STACK_SIZE = Number.MAX_SAFE_INTEGER;

/**
 * Inventory menu type used in protocol packets.
 */
export enum InventoryMenuType {
  PlayerInventory = MenuType.Inventory,
  Bank = MenuType.Bank,
  Trade = MenuType.TradeInventory,
  Shop = MenuType.Shop,
}

/**
 * Result of an add items operation.
 */
export interface AddItemsResult {
  /** Total amount successfully added to inventory */
  added: number;
  /** Amount that couldn't fit (overflow) */
  overflow: number;
  /** Slots that were modified during this operation */
  slotsModified: InventorySlotChange[];
}

/**
 * Result of a remove items operation.
 */
export interface RemoveItemsResult {
  /** Total amount successfully removed */
  removed: number;
  /** Amount that couldn't be removed (not enough in inventory) */
  shortfall: number;
  /** Slots that were modified during this operation */
  slotsModified: InventorySlotChange[];
}

/**
 * Result of a move/swap operation.
 */
export interface MoveItemResult {
  success: boolean;
  error?: string;
  slotsModified: InventorySlotChange[];
}

/**
 * Describes a change to a specific inventory slot.
 */
export interface InventorySlotChange {
  slot: number;
  previousItem: InventoryItem | null;
  newItem: InventoryItem | null;
  /** For add operations: amount added to this slot */
  amountChanged: number;
}

/**
 * Validates if a slot index is within valid inventory bounds.
 */
export function isValidSlotIndex(slot: number): boolean {
  return Number.isInteger(slot) && slot >= 0 && slot < INVENTORY_SLOT_COUNT;
}

/**
 * Validates if an item ID is valid (positive integer).
 */
export function isValidItemId(itemId: number): boolean {
  return Number.isInteger(itemId) && itemId > 0;
}

/**
 * Validates if an amount is valid (positive integer, within stack limits).
 */
export function isValidAmount(amount: number): boolean {
  return Number.isInteger(amount) && amount > 0 && amount <= MAX_STACK_SIZE;
}

/**
 * Validates if isIOU is a valid value (0 or 1).
 */
export function isValidIsIOU(isIOU: number): boolean {
  return isIOU === 0 || isIOU === 1;
}

/**
 * Checks if two inventory items can be stacked together.
 * Items can stack if they have the same itemId and isIOU value.
 */
export function canItemsStack(a: InventoryItem, b: InventoryItem): boolean {
  return a[0] === b[0] && a[2] === b[2];
}

/**
 * Checks if an item definition allows stacking.
 */
export function isItemStackable(definition: ItemDefinition | undefined): boolean {
  return definition?.isStackable ?? false;
}

/**
 * Creates a new InventoryItem tuple.
 */
export function createInventoryItem(itemId: number, amount: number, isIOU: number = 0): InventoryItem {
  return [itemId, Math.min(amount, MAX_STACK_SIZE), isIOU];
}

/**
 * Optional callback for handling inventory slot changes (e.g., weight updates).
 */
export type InventoryChangeCallback = (changes: InventorySlotChange[]) => void;

/**
 * Manages inventory operations with validation and stackability support.
 * This class works with a FullInventory array reference and mutates it directly.
 */
export class InventoryManager {
  private changeCallback?: InventoryChangeCallback;

  constructor(
    private readonly inventory: FullInventory,
    private readonly itemCatalog: ItemCatalog,
    changeCallback?: InventoryChangeCallback
  ) {
    this.changeCallback = changeCallback;
  }

  /**
   * Sets or updates the callback for inventory changes.
   */
  setChangeCallback(callback: InventoryChangeCallback | undefined) {
    this.changeCallback = callback;
  }

  /**
   * Notifies the callback of inventory changes.
   */
  private notifyChanges(changes: InventorySlotChange[]) {
    if (this.changeCallback && changes.length > 0) {
      this.changeCallback(changes);
    }
  }

  /**
   * Gets the item definition for an item ID.
   */
  getItemDefinition(itemId: number): ItemDefinition | undefined {
    return this.itemCatalog.getDefinitionById(itemId);
  }

  /**
   * Checks if an item ID corresponds to a stackable item.
   */
  isStackable(itemId: number): boolean {
    return isItemStackable(this.getItemDefinition(itemId));
  }

  /**
   * Gets the item at a specific slot.
   */
  getSlot(slot: number): InventoryItem | null {
    if (!isValidSlotIndex(slot)) return null;
    return this.inventory[slot] ?? null;
  }

  /**
   * Sets the item at a specific slot directly.
   * Use with caution - prefer addItems/removeItems for normal operations.
   */
  setSlot(slot: number, item: InventoryItem | null): boolean {
    if (!isValidSlotIndex(slot)) return false;
    if (item !== null) {
      if (!isValidItemId(item[0]) || !isValidAmount(item[1]) || !isValidIsIOU(item[2])) {
        return false;
      }
    }
    const previousItem = this.inventory[slot];
    this.inventory[slot] = item;
    
    // Notify of change
    this.notifyChanges([{
      slot,
      previousItem: previousItem ? [...previousItem] : null,
      newItem: item ? [...item] : null,
      amountChanged: 0
    }]);
    
    return true;
  }

  /**
   * Finds the first empty slot index.
   * @returns Slot index or -1 if inventory is full
   */
  findFirstEmptySlot(): number {
    return this.inventory.findIndex((slot) => slot === null);
  }

  /**
   * Counts the number of empty slots.
   */
  countEmptySlots(): number {
    return this.inventory.filter((slot) => slot === null).length;
  }

  /**
   * Checks if the inventory has at least one empty slot.
   */
  hasEmptySlot(): boolean {
    return this.findFirstEmptySlot() !== -1;
  }

  /**
   * Finds all slots containing a specific item (matching itemId and optionally isIOU).
   * @param itemId The item ID to search for
   * @param isIOU Optional isIOU filter (if undefined, matches any)
   * @returns Array of slot indices
   */
  findSlotsWithItem(itemId: number, isIOU?: number): number[] {
    const slots: number[] = [];
    for (let i = 0; i < INVENTORY_SLOT_COUNT; i++) {
      const item = this.inventory[i];
      if (item && item[0] === itemId) {
        if (isIOU === undefined || item[2] === isIOU) {
          slots.push(i);
        }
      }
    }
    return slots;
  }

  /**
   * Finds slots with a specific item that have room for more (below max stack).
   * Only relevant for stackable items. IOUs are always stackable regardless of base item.
   */
  findStackableSlotsWithRoom(itemId: number, isIOU: number = 0): number[] {
    // IOUs are ALWAYS stackable, regardless of base item stackability
    if (isIOU !== 1 && !this.isStackable(itemId)) return [];
    
    const slots: number[] = [];
    for (let i = 0; i < INVENTORY_SLOT_COUNT; i++) {
      const item = this.inventory[i];
      if (item && item[0] === itemId && item[2] === isIOU && item[1] < MAX_STACK_SIZE) {
        slots.push(i);
      }
    }
    return slots;
  }

  /**
   * Counts the total amount of a specific item in the inventory.
   * @param itemId The item ID to count
   * @param isIOU Optional isIOU filter (if undefined, counts all)
   */
  countItem(itemId: number, isIOU?: number): number {
    let total = 0;
    for (const item of this.inventory) {
      if (item && item[0] === itemId) {
        if (isIOU === undefined || item[2] === isIOU) {
          total += item[1];
        }
      }
    }
    return total;
  }

  /**
   * Checks if the inventory contains at least a certain amount of an item.
   */
  hasItem(itemId: number, amount: number = 1, isIOU?: number): boolean {
    return this.countItem(itemId, isIOU) >= amount;
  }

  /**
   * Adds items to the inventory, respecting stackability rules.
   * 
   * For stackable items:
   * - First tries to add to existing stacks of the same item
   * - Then fills new empty slots if needed
   * 
   * For non-stackable items:
   * - Each item goes to a separate slot (amount per slot is 1)
   * 
   * @param itemId The item definition ID
   * @param amount Total amount to add
   * @param isIOU Whether this is an IOU/bank note (0 or 1)
   * @returns Result containing added amount, overflow, and slot changes
   */
  addItems(itemId: number, amount: number, isIOU: number = 0): AddItemsResult {
    const result: AddItemsResult = {
      added: 0,
      overflow: 0,
      slotsModified: []
    };

    // Validate inputs
    if (!isValidItemId(itemId) || !isValidAmount(amount) || !isValidIsIOU(isIOU)) {
      result.overflow = amount;
      return result;
    }

    // IOUs are ALWAYS stackable, regardless of base item stackability
    const isStackable = isIOU === 1 || this.isStackable(itemId);
    let remaining = amount;

    if (isStackable) {
      // First, try to add to existing stacks
      const existingSlots = this.findStackableSlotsWithRoom(itemId, isIOU);
      
      for (const slot of existingSlots) {
        if (remaining <= 0) break;
        
        const item = this.inventory[slot]!;
        const previousItem: InventoryItem = [...item];
        const spaceInStack = MAX_STACK_SIZE - item[1];
        const toAdd = Math.min(remaining, spaceInStack);
        
        item[1] += toAdd;
        remaining -= toAdd;
        result.added += toAdd;
        
        result.slotsModified.push({
          slot,
          previousItem,
          newItem: [...item],
          amountChanged: toAdd
        });
      }

      // Then, fill empty slots with new stacks
      while (remaining > 0) {
        const emptySlot = this.findFirstEmptySlot();
        if (emptySlot === -1) break;
        
        const toAdd = Math.min(remaining, MAX_STACK_SIZE);
        const newItem = createInventoryItem(itemId, toAdd, this.isStackable(itemId) ? 0 : isIOU);
        this.inventory[emptySlot] = newItem;
        remaining -= toAdd;
        result.added += toAdd;
        
        result.slotsModified.push({
          slot: emptySlot,
          previousItem: null,
          newItem: [...newItem],
          amountChanged: toAdd
        });
      }
    } else {
      // Non-stackable: each item goes to its own slot with amount 1
      while (remaining > 0) {
        const emptySlot = this.findFirstEmptySlot();
        if (emptySlot === -1) break;
        
        const newItem = createInventoryItem(itemId, 1, isIOU);
        this.inventory[emptySlot] = newItem;
        remaining -= 1;
        result.added += 1;
        
        result.slotsModified.push({
          slot: emptySlot,
          previousItem: null,
          newItem: [...newItem],
          amountChanged: 1
        });
      }
    }

    result.overflow = remaining;
    
    // Notify of changes
    this.notifyChanges(result.slotsModified);
    
    return result;
  }

  /**
   * Removes items from the inventory.
   * 
   * Removes from slots in order (lowest slot index first).
   * For stackable items, partially depletes stacks before moving to next.
   * 
   * @param itemId The item definition ID
   * @param amount Total amount to remove
   * @param isIOU Optional isIOU filter (if undefined, removes any matching itemId)
   * @returns Result containing removed amount, shortfall, and slot changes
   */
  removeItems(itemId: number, amount: number, isIOU?: number): RemoveItemsResult {
    const result: RemoveItemsResult = {
      removed: 0,
      shortfall: 0,
      slotsModified: []
    };

    if (!isValidItemId(itemId) || !isValidAmount(amount)) {
      result.shortfall = amount;
      return result;
    }

    const slots = this.findSlotsWithItem(itemId, isIOU);
    let remaining = amount;

    for (const slot of slots) {
      if (remaining <= 0) break;
      
      const item = this.inventory[slot]!;
      const previousItem: InventoryItem = [...item];
      const toRemove = Math.min(remaining, item[1]);
      
      item[1] -= toRemove;
      remaining -= toRemove;
      result.removed += toRemove;

      if (item[1] <= 0) {
        // Slot is now empty
        this.inventory[slot] = null;
        result.slotsModified.push({
          slot,
          previousItem,
          newItem: null,
          amountChanged: -toRemove
        });
      } else {
        result.slotsModified.push({
          slot,
          previousItem,
          newItem: [...item],
          amountChanged: -toRemove
        });
      }
    }

    result.shortfall = remaining;
    
    // Notify of changes
    this.notifyChanges(result.slotsModified);
    
    return result;
  }

  /**
   * Moves an item from one slot to another.
   * 
   * Behavior:
   * - If target slot is empty: moves the item
   * - If target slot has same stackable item: merges stacks
   * - If target slot has different item: swaps items
   * 
   * @param fromSlot Source slot index
   * @param toSlot Destination slot index
   * @returns Result with success status and slot changes
   */
  moveItem(fromSlot: number, toSlot: number): MoveItemResult {
    const result: MoveItemResult = {
      success: false,
      slotsModified: []
    };

    // Validate slots
    if (!isValidSlotIndex(fromSlot) || !isValidSlotIndex(toSlot)) {
      result.error = "Invalid slot index";
      return result;
    }

    if (fromSlot === toSlot) {
      result.success = true; // No-op, but not an error
      return result;
    }

    const sourceItem = this.inventory[fromSlot];
    const targetItem = this.inventory[toSlot];

    if (!sourceItem) {
      result.error = "Source slot is empty";
      return result;
    }

    const previousSource: InventoryItem = [...sourceItem];
    const previousTarget: InventoryItem | null = targetItem ? [...targetItem] : null;

    if (!targetItem) {
      // Simple move to empty slot
      this.inventory[toSlot] = sourceItem;
      this.inventory[fromSlot] = null;
      
      result.success = true;
      result.slotsModified.push(
        { slot: fromSlot, previousItem: previousSource, newItem: null, amountChanged: -sourceItem[1] },
        { slot: toSlot, previousItem: null, newItem: [...sourceItem], amountChanged: sourceItem[1] }
      );
    } else if (
      sourceItem[0] === targetItem[0] &&
      sourceItem[2] === targetItem[2] &&
      this.isStackable(sourceItem[0])
    ) {
      // Merge stacks for stackable items
      const spaceInTarget = MAX_STACK_SIZE - targetItem[1];
      const toTransfer = Math.min(sourceItem[1], spaceInTarget);
      
      if (toTransfer > 0) {
        targetItem[1] += toTransfer;
        sourceItem[1] -= toTransfer;
        
        if (sourceItem[1] <= 0) {
          this.inventory[fromSlot] = null;
          result.slotsModified.push({
            slot: fromSlot,
            previousItem: previousSource,
            newItem: null,
            amountChanged: -toTransfer
          });
        } else {
          result.slotsModified.push({
            slot: fromSlot,
            previousItem: previousSource,
            newItem: [...sourceItem],
            amountChanged: -toTransfer
          });
        }
        
        result.slotsModified.push({
          slot: toSlot,
          previousItem: previousTarget,
          newItem: [...targetItem],
          amountChanged: toTransfer
        });
      }
      result.success = true;
    } else {
      // Swap items
      this.inventory[fromSlot] = targetItem;
      this.inventory[toSlot] = sourceItem;
      
      result.success = true;
      result.slotsModified.push(
        { slot: fromSlot, previousItem: previousSource, newItem: [...targetItem], amountChanged: 0 },
        { slot: toSlot, previousItem: previousTarget, newItem: [...sourceItem], amountChanged: 0 }
      );
    }

    // Notify of changes
    this.notifyChanges(result.slotsModified);

    return result;
  }

  /**
   * Swaps items between two slots.
   * Unlike moveItem, this always performs a swap (no merging).
   */
  swapSlots(slotA: number, slotB: number): MoveItemResult {
    const result: MoveItemResult = {
      success: false,
      slotsModified: []
    };

    if (!isValidSlotIndex(slotA) || !isValidSlotIndex(slotB)) {
      result.error = "Invalid slot index";
      return result;
    }

    if (slotA === slotB) {
      result.success = true;
      return result;
    }

    const itemA = this.inventory[slotA];
    const itemB = this.inventory[slotB];
    const previousA = itemA ? [...itemA] as InventoryItem : null;
    const previousB = itemB ? [...itemB] as InventoryItem : null;

    this.inventory[slotA] = itemB;
    this.inventory[slotB] = itemA;

    result.success = true;
    result.slotsModified.push(
      { slot: slotA, previousItem: previousA, newItem: itemB ? [...itemB] : null, amountChanged: 0 },
      { slot: slotB, previousItem: previousB, newItem: itemA ? [...itemA] : null, amountChanged: 0 }
    );

    // Notify of changes
    this.notifyChanges(result.slotsModified);

    return result;
  }

  /**
   * Clears the entire inventory.
   * @returns Array of all slot changes
   */
  clearInventory(): InventorySlotChange[] {
    const changes: InventorySlotChange[] = [];
    
    for (let i = 0; i < INVENTORY_SLOT_COUNT; i++) {
      const item = this.inventory[i];
      if (item) {
        changes.push({
          slot: i,
          previousItem: [...item],
          newItem: null,
          amountChanged: -item[1]
        });
        this.inventory[i] = null;
      }
    }
    
    // Notify of changes
    this.notifyChanges(changes);
    
    return changes;
  }

  /**
   * Calculates how many items can be added before inventory is full.
   * 
   * @param itemId The item definition ID
   * @param isIOU Whether this is an IOU/bank note
   * @returns Maximum amount that can be added
   */
  calculateAddCapacity(itemId: number, isIOU: number = 0): number {
    if (!isValidItemId(itemId)) return 0;
    
    // IOUs are ALWAYS stackable, regardless of base item stackability
    const isStackable = isIOU === 1 || this.isStackable(itemId);
    
    if (isStackable) {
      let capacity = 0;
      
      // Space in existing stacks
      for (const item of this.inventory) {
        if (item && item[0] === itemId && item[2] === isIOU) {
          capacity += MAX_STACK_SIZE - item[1];
        }
      }
      
      // Empty slots can each hold a full stack
      capacity += this.countEmptySlots() * MAX_STACK_SIZE;
      
      return capacity;
    } else {
      // Non-stackable: one item per empty slot
      return this.countEmptySlots();
    }
  }

  /**
   * Gets all items in the inventory as an array of [slot, item] pairs.
   * Only returns non-empty slots.
   */
  getAllItems(): Array<[number, InventoryItem]> {
    const items: Array<[number, InventoryItem]> = [];
    for (let i = 0; i < INVENTORY_SLOT_COUNT; i++) {
      const item = this.inventory[i];
      if (item) {
        items.push([i, [...item]]);
      }
    }
    return items;
  }

  /**
   * Creates a snapshot of the current inventory state.
   */
  getSnapshot(): FullInventory {
    return this.inventory.map((item) => item ? [...item] as InventoryItem : null);
  }
}
