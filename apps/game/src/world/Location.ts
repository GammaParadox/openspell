export const MAP_LEVELS = {
  Underground: 0,
  Overworld: 1,
  Sky: 2,
} as const;

/** 0=underground, 1=overworld, 2=sky (matches client protocol `MapLevel`). */
export type MapLevel = (typeof MAP_LEVELS)[keyof typeof MAP_LEVELS];

export type LocationAxis = "x" | "y";

export type CoordinateBounds = {
  min: number;
  max: number;
};

export interface MapLevelCoordinateBounds {
  x: CoordinateBounds;
  y: CoordinateBounds;
}

export type PlayerLocation = {
  userId: number;
  mapLevel: MapLevel;
  x: number;
  y: number;
};

const DEFAULT_COORDINATE_BOUNDS: CoordinateBounds = { min: -512, max: 512 };

const coordinateBoundsByMapLevel: Record<MapLevel, MapLevelCoordinateBounds> = {
  [MAP_LEVELS.Underground]: cloneMapLevelBounds({
    x: DEFAULT_COORDINATE_BOUNDS,
    y: DEFAULT_COORDINATE_BOUNDS
  }),
  [MAP_LEVELS.Overworld]: cloneMapLevelBounds({
    x: DEFAULT_COORDINATE_BOUNDS,
    y: DEFAULT_COORDINATE_BOUNDS
  }),
  [MAP_LEVELS.Sky]: cloneMapLevelBounds({
    x: DEFAULT_COORDINATE_BOUNDS,
    y: DEFAULT_COORDINATE_BOUNDS
  })
};

let globalCoordinateBounds = computeGlobalCoordinateBounds();

export function isMapLevel(v: unknown): v is MapLevel {
  return v === 0 || v === 1 || v === 2;
}

export function setLocationBoundsForMapLevel(mapLevel: MapLevel, bounds: MapLevelCoordinateBounds): void {
  coordinateBoundsByMapLevel[mapLevel] = cloneMapLevelBounds(bounds);
  globalCoordinateBounds = computeGlobalCoordinateBounds();
}

export function getLocationBoundsForMapLevel(mapLevel: MapLevel): MapLevelCoordinateBounds {
  return cloneMapLevelBounds(coordinateBoundsByMapLevel[mapLevel]);
}

export function getGlobalLocationBounds(): MapLevelCoordinateBounds {
  return cloneMapLevelBounds(globalCoordinateBounds);
}

export function isLocationCoordinate(
  v: unknown,
  options?: { mapLevel?: MapLevel; axis?: LocationAxis }
): v is number {
  if (typeof v !== "number" || !Number.isFinite(v) || !Number.isInteger(v)) return false;
  const axis = options?.axis ?? "x";
  const bounds = getBoundsForAxis(axis, options?.mapLevel);
  return v >= bounds.min && v <= bounds.max;
}

export function isPlayerLocation(v: unknown): v is PlayerLocation {
  if (!v || typeof v !== "object") return false;
  const o = v as Record<string, unknown>;
  const mapLevel = o.mapLevel;
  if (!isMapLevel(mapLevel)) return false;
  return (
    typeof o.userId === "number" &&
    Number.isInteger(o.userId) &&
    o.userId > 0 &&
    isLocationCoordinate(o.x, { mapLevel, axis: "x" }) &&
    isLocationCoordinate(o.y, { mapLevel, axis: "y" })
  );
}

export function clampLocationCoordinate(
  n: number,
  options?: { mapLevel?: MapLevel; axis?: LocationAxis }
): number {
  if (!Number.isFinite(n)) return 0;
  const rounded = Math.round(n);
  const axis = options?.axis ?? "x";
  const bounds = getBoundsForAxis(axis, options?.mapLevel);
  return Math.max(bounds.min, Math.min(bounds.max, rounded));
}

function getBoundsForAxis(axis: LocationAxis, mapLevel?: MapLevel): CoordinateBounds {
  if (mapLevel !== undefined && coordinateBoundsByMapLevel[mapLevel]) {
    return coordinateBoundsByMapLevel[mapLevel][axis];
  }
  return globalCoordinateBounds[axis];
}

function computeGlobalCoordinateBounds(): MapLevelCoordinateBounds {
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;

  for (const bounds of Object.values(coordinateBoundsByMapLevel)) {
    minX = Math.min(minX, bounds.x.min);
    maxX = Math.max(maxX, bounds.x.max);
    minY = Math.min(minY, bounds.y.min);
    maxY = Math.max(maxY, bounds.y.max);
  }

  if (!Number.isFinite(minX)) minX = DEFAULT_COORDINATE_BOUNDS.min;
  if (!Number.isFinite(maxX)) maxX = DEFAULT_COORDINATE_BOUNDS.max;
  if (!Number.isFinite(minY)) minY = DEFAULT_COORDINATE_BOUNDS.min;
  if (!Number.isFinite(maxY)) maxY = DEFAULT_COORDINATE_BOUNDS.max;

  return {
    x: { min: minX, max: maxX },
    y: { min: minY, max: maxY }
  };
}

function cloneMapLevelBounds(bounds: MapLevelCoordinateBounds): MapLevelCoordinateBounds {
  return {
    x: cloneCoordinateBounds(bounds.x),
    y: cloneCoordinateBounds(bounds.y)
  };
}

function cloneCoordinateBounds(bounds: CoordinateBounds): CoordinateBounds {
  return { min: bounds.min, max: bounds.max };
}

