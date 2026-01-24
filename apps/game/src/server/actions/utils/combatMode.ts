import type { PlayerState } from "../../../world/PlayerState";
import type { SpellCatalog } from "../../../world/spells/SpellCatalog";

export type PlayerCombatMode = "melee" | "range" | "magic";

const RANGED_WEAPONS: number[] = [
  341, 342, 343, 344, 345, 360, 362
];

export const RANGED_WEAPON_RANGE = 5;
export const MAGIC_RANGE_DEFAULT = 10;

export function isWithinRange(
  fromX: number,
  fromY: number,
  toX: number,
  toY: number,
  range: number
): boolean {
  const dx = Math.abs(fromX - toX);
  const dy = Math.abs(fromY - toY);
  const distance = Math.max(dx, dy);
  return distance > 0 && distance <= range;
}

export function isRangedWeapon(itemId: number): boolean {
  return RANGED_WEAPONS.includes(itemId);
}

export function getPlayerWeaponId(player: PlayerState): number | null {
  const weaponStack = player.equipment.weapon;
  if (!weaponStack) {
    return null;
  }
  return weaponStack[0];
}

export function getPlayerCombatMode(player: PlayerState): PlayerCombatMode {
  if (player.singleCastSpellId !== null) {
    return "magic";
  }
  if (player.autoCastSpellId !== null) {
    return "magic";
  }
  const weaponId = getPlayerWeaponId(player);
  if (weaponId !== null && isRangedWeapon(weaponId)) {
    return "range";
  }
  return "melee";
}

export function getPlayerAttackRange(
  player: PlayerState,
  spellCatalog: SpellCatalog | null | undefined
): number {
  const mode = getPlayerCombatMode(player);
  if (mode === "magic") {
    const spellId = player.singleCastSpellId ?? player.autoCastSpellId;
    if (spellId !== null && spellCatalog) {
      const spell = spellCatalog.getDefinitionById(spellId);
      if (spell && typeof spell.range === "number" && Number.isFinite(spell.range) && spell.range > 0) {
        return spell.range;
      }
    }
    return MAGIC_RANGE_DEFAULT;
  }
  if (mode === "range") {
    return RANGED_WEAPON_RANGE;
  }
  return 1;
}
