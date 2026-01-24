/**
 * SpatialIndex - A cell-based spatial hash for efficient entity lookups.
 * 
 * Used for:
 * - NPC aggro detection (finding players within aggro radius)
 * - Visibility queries (finding entities near a player)
 * 
 * The index partitions the world into cells of configurable size.
 * Entities are stored by their cell coordinates for O(1) cell lookups.
 * Range queries iterate only over relevant cells.
 */

import type { MapLevel } from "./Location";

export interface SpatialEntity {
  id: number;
  mapLevel: MapLevel;
  x: number;
  y: number;
}

type CellKey = string;

/**
 * Makes a cell key from map level and cell coordinates.
 */
function makeCellKey(mapLevel: MapLevel, cellX: number, cellY: number): CellKey {
  return `${mapLevel}:${cellX}:${cellY}`;
}

/**
 * A spatial hash index for fast range queries.
 * 
 * Cell size should be chosen based on typical query radius.
 * Smaller cells = more granular but more cells to check for large radii.
 * Larger cells = fewer cells but more entities per cell to filter.
 * 
 * A cell size of 8-16 is typically good for aggro radii of 6-24.
 */
export class SpatialIndex<T extends SpatialEntity> {
  private readonly cellSize: number;
  private readonly cells = new Map<CellKey, Set<T>>();
  private readonly entityToCell = new Map<T, CellKey>();

  constructor(cellSize: number = 16) {
    this.cellSize = cellSize;
  }

  /**
   * Converts world coordinates to cell coordinates.
   */
  private toCellCoords(x: number, y: number): [number, number] {
    return [Math.floor(x / this.cellSize), Math.floor(y / this.cellSize)];
  }

  /**
   * Inserts an entity into the index.
   */
  insert(entity: T): void {
    const [cellX, cellY] = this.toCellCoords(entity.x, entity.y);
    const key = makeCellKey(entity.mapLevel, cellX, cellY);

    // Remove from old cell if it was already indexed
    const oldKey = this.entityToCell.get(entity);
    if (oldKey && oldKey !== key) {
      const oldCell = this.cells.get(oldKey);
      if (oldCell) {
        oldCell.delete(entity);
        if (oldCell.size === 0) {
          this.cells.delete(oldKey);
        }
      }
    }

    // Add to new cell
    let cell = this.cells.get(key);
    if (!cell) {
      cell = new Set();
      this.cells.set(key, cell);
    }
    cell.add(entity);
    this.entityToCell.set(entity, key);
  }

  /**
   * Updates an entity's position in the index.
   * More efficient than remove + insert when the entity reference is the same.
   */
  update(entity: T): void {
    this.insert(entity);
  }

  /**
   * Removes an entity from the index.
   */
  remove(entity: T): void {
    const key = this.entityToCell.get(entity);
    if (!key) return;

    const cell = this.cells.get(key);
    if (cell) {
      cell.delete(entity);
      if (cell.size === 0) {
        this.cells.delete(key);
      }
    }
    this.entityToCell.delete(entity);
  }

  /**
   * Queries all entities within a square radius of a point.
   * Returns entities where |entity.x - x| <= radius AND |entity.y - y| <= radius.
   * 
   * @param mapLevel - Only return entities on this map level
   * @param centerX - Center X coordinate
   * @param centerY - Center Y coordinate  
   * @param radius - Maximum distance in each axis (Chebyshev distance)
   * @param exclude - Optional entity to exclude from results
   */
  queryRadius(
    mapLevel: MapLevel,
    centerX: number,
    centerY: number,
    radius: number,
    exclude?: T
  ): T[] {
    const results: T[] = [];

    const minX = centerX - radius;
    const maxX = centerX + radius;
    const minY = centerY - radius;
    const maxY = centerY + radius;

    const [minCellX, minCellY] = this.toCellCoords(minX, minY);
    const [maxCellX, maxCellY] = this.toCellCoords(maxX, maxY);

    // Iterate over all cells that could contain entities in range
    for (let cellX = minCellX; cellX <= maxCellX; cellX++) {
      for (let cellY = minCellY; cellY <= maxCellY; cellY++) {
        const key = makeCellKey(mapLevel, cellX, cellY);
        const cell = this.cells.get(key);
        if (!cell) continue;

        for (const entity of cell) {
          if (exclude && entity === exclude) continue;
          // Verify entity is actually within the radius (cell may overlap)
          if (
            entity.x >= minX && entity.x <= maxX &&
            entity.y >= minY && entity.y <= maxY
          ) {
            results.push(entity);
          }
        }
      }
    }

    return results;
  }

  /**
   * Queries all entities within a bounding box.
   * 
   * @param mapLevel - Only return entities on this map level
   * @param minX - Minimum X coordinate
   * @param maxX - Maximum X coordinate
   * @param minY - Minimum Y coordinate
   * @param maxY - Maximum Y coordinate
   * @param exclude - Optional entity to exclude from results
   */
  queryBoundingBox(
    mapLevel: MapLevel,
    minX: number,
    maxX: number,
    minY: number,
    maxY: number,
    exclude?: T
  ): T[] {
    const results: T[] = [];

    const [minCellX, minCellY] = this.toCellCoords(minX, minY);
    const [maxCellX, maxCellY] = this.toCellCoords(maxX, maxY);

    for (let cellX = minCellX; cellX <= maxCellX; cellX++) {
      for (let cellY = minCellY; cellY <= maxCellY; cellY++) {
        const key = makeCellKey(mapLevel, cellX, cellY);
        const cell = this.cells.get(key);
        if (!cell) continue;

        for (const entity of cell) {
          if (exclude && entity === exclude) continue;
          if (
            entity.x >= minX && entity.x <= maxX &&
            entity.y >= minY && entity.y <= maxY
          ) {
            results.push(entity);
          }
        }
      }
    }

    return results;
  }

  /**
   * Finds the closest entity to a point within a maximum radius.
   * Uses Euclidean distance for tie-breaking.
   */
  findClosest(
    mapLevel: MapLevel,
    centerX: number,
    centerY: number,
    maxRadius: number,
    exclude?: T
  ): T | null {
    const candidates = this.queryRadius(mapLevel, centerX, centerY, maxRadius, exclude);
    if (candidates.length === 0) return null;

    let closest: T | null = null;
    let closestDistSq = Infinity;

    for (const entity of candidates) {
      const dx = entity.x - centerX;
      const dy = entity.y - centerY;
      const distSq = dx * dx + dy * dy;
      if (distSq < closestDistSq) {
        closestDistSq = distSq;
        closest = entity;
      }
    }

    return closest;
  }

  /**
   * Clears all entities from the index.
   */
  clear(): void {
    this.cells.clear();
    this.entityToCell.clear();
  }

  /**
   * Returns the total number of indexed entities.
   */
  get size(): number {
    return this.entityToCell.size;
  }
}

/**
 * Checks if a point is within a bounding box (inclusive).
 */
export function isWithinBounds(
  x: number,
  y: number,
  minX: number,
  maxX: number,
  minY: number,
  maxY: number
): boolean {
  return x >= minX && x <= maxX && y >= minY && y <= maxY;
}

/**
 * Calculates Manhattan distance between two points.
 */
export function manhattanDistance(x1: number, y1: number, x2: number, y2: number): number {
  return Math.abs(x2 - x1) + Math.abs(y2 - y1);
}

/**
 * Calculates Chebyshev distance (max of axis distances).
 * This is the "king's move" distance used for aggro radius.
 */
export function chebyshevDistance(x1: number, y1: number, x2: number, y2: number): number {
  return Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1));
}

/**
 * Checks if two points are cardinally adjacent (not diagonal).
 */
export function isCardinallyAdjacent(x1: number, y1: number, x2: number, y2: number): boolean {
  const dx = Math.abs(x2 - x1);
  const dy = Math.abs(y2 - y1);
  return (dx === 1 && dy === 0) || (dx === 0 && dy === 1);
}
