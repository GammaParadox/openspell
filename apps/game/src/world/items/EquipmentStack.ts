/** Client protocol representation: [itemDefId, amount]. */
export type EquipmentStack = [itemDefId: number, amount: number];

export function isEquipmentStack(v: unknown): v is EquipmentStack {
  return (
    Array.isArray(v) &&
    v.length === 2 &&
    typeof v[0] === "number" &&
    Number.isInteger(v[0]) &&
    v[0] > 0 &&
    typeof v[1] === "number" && 
    Number.isInteger(v[1]) &&
    v[1] >= 1
  );
}

