import { Point } from "./pathfinding";

interface GridLike {
  getWidth(): number;
  getHeight(): number;
}

function clampIndex(value: number, limit: number): number {
  if (!Number.isFinite(value) || limit <= 0) return 0;
  if (value < 0) return 0;
  if (value >= limit) return limit - 1;
  return value | 0;
}

// Converts world coordinates to grid coordinates.
// World origin is at (-halfW, -halfH), matching Rust:
//   grid_x = entity.x + entity_to_map_space_x  (where entity_to_map_space_x = 512 = halfW)
//   grid_y = entity.z + entity_to_map_space_y  (where entity_to_map_space_y = 512 = halfH)
// Since PNG Y is flipped during load, grid Y=0 is world south, grid Y=max is world north.
export function worldToGrid(x: number, y: number, grid: GridLike): Point {
  const halfW = Math.floor(grid.getWidth() / 2);
  const halfH = Math.floor(grid.getHeight() / 2);

  const gx = Math.round(x + halfW);
  const gy = Math.round(y + halfH);

  return new Point(
    clampIndex(gx, grid.getWidth()),
    clampIndex(gy, grid.getHeight())
  );
}

// Converts grid coordinates back to world coordinates.
// Inverse of worldToGrid.
export function gridToWorld(point: Point, grid: GridLike): Point {
  const halfW = Math.floor(grid.getWidth() / 2);
  const halfH = Math.floor(grid.getHeight() / 2);

  const wx = point.x - halfW;
  const wy = point.y - halfH;

  return new Point(wx, wy);
}
