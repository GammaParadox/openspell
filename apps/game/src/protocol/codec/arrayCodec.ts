export type PacketArray = unknown[];

export function assertIsArray(value: unknown, name = "value"): asserts value is unknown[] {
  if (!Array.isArray(value)) {
    throw new Error(`${name} must be an array`);
  }
}

export function getNumber(arr: PacketArray, idx: number, name: string): number {
  const v = arr[idx];
  if (typeof v !== "number" || !Number.isFinite(v)) {
    throw new Error(`${name} must be a finite number at index ${idx}`);
  }
  return v;
}

export function getInt(arr: PacketArray, idx: number, name: string): number {
  const n = getNumber(arr, idx, name);
  if (!Number.isInteger(n)) throw new Error(`${name} must be an integer at index ${idx}`);
  return n;
}

export function getString(arr: PacketArray, idx: number, name: string): string {
  const v = arr[idx];
  if (typeof v !== "string") {
    throw new Error(`${name} must be a string at index ${idx}`);
  }
  return v;
}

export function getBool01(arr: PacketArray, idx: number, name: string): boolean {
  const n = getInt(arr, idx, name);
  if (n !== 0 && n !== 1) throw new Error(`${name} must be 0/1 at index ${idx}`);
  return n === 1;
}

