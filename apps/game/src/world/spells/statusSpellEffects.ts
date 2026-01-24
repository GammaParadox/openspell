import { SKILLS, type SkillSlug } from "../PlayerState";

export type StatusSpellEffect =
  | { kind: "stat"; skill: SkillSlug; reductionPercent: number }
  | { kind: "confuse" };

export const STATUS_SPELL_EFFECTS: Record<number, StatusSpellEffect> = {
  12: { kind: "stat", skill: SKILLS.strength, reductionPercent: 5 },
  13: { kind: "stat", skill: SKILLS.accuracy, reductionPercent: 5 },
  14: { kind: "stat", skill: SKILLS.defense, reductionPercent: 5 },
  33: { kind: "confuse" }
};

export function getStatusSpellEffect(spellId: number): StatusSpellEffect | null {
  return STATUS_SPELL_EFFECTS[spellId] ?? null;
}
