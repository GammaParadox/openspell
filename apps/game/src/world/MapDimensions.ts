import { type CoordinateBounds, type MapLevel, type MapLevelCoordinateBounds } from "./Location";

export type MapDimension = {
  width: number;
  height: number;
};

type MapLevelDimensionsMap = Partial<Record<MapLevel, MapDimension>>;
const mapLevelDimensions: MapLevelDimensionsMap = {};

export function setMapLevelDimensions(mapLevel: MapLevel, dimension: MapDimension): void {
  const width = toPositiveInteger(dimension.width);
  const height = toPositiveInteger(dimension.height);
  mapLevelDimensions[mapLevel] = { width, height };
}

export function getMapLevelDimensions(mapLevel: MapLevel): MapDimension | undefined {
  const dims = mapLevelDimensions[mapLevel];
  return dims ? { ...dims } : undefined;
}

export function getRegisteredMapLevelDimensions(): MapLevelDimensionsMap {
  return { ...mapLevelDimensions };
}

export function computeCoordinateBoundsFromDimension(
  dimension: MapDimension
): MapLevelCoordinateBounds {
  return {
    x: computeAxisBounds(dimension.width),
    y: computeAxisBounds(dimension.height)
  };
}

function computeAxisBounds(size: number): CoordinateBounds {
  const half = Math.floor(size / 2);
  return {
    min: -half,
    max: size - half - 1
  };
}

function toPositiveInteger(value: number): number {
  if (!Number.isFinite(value)) return 1;
  const rounded = Math.floor(value);
  return Math.max(1, rounded);
}
