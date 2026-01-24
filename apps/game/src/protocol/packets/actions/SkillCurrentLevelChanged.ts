import { assertIsArray, type PacketArray } from "../../codec/arrayCodec";
import { SkillCurrentLevelChangedFields } from "../../fields/actions/SkillCurrentLevelChangedFields";

/** Auto-generated from `apps/game/gameActionFactory.js` (SkillCurrentLevelChanged) */
export type SkillCurrentLevelChangedPayload = {
  Skill: unknown;
  CurrentLevel: unknown;
};

export function decodeSkillCurrentLevelChangedPayload(payload: unknown): SkillCurrentLevelChangedPayload {
  assertIsArray(payload, "SkillCurrentLevelChanged payload");
  const arr = payload as PacketArray;
  return {
    Skill: arr[SkillCurrentLevelChangedFields.Skill] as any,
    CurrentLevel: arr[SkillCurrentLevelChangedFields.CurrentLevel] as any,
  };
}

export function buildSkillCurrentLevelChangedPayload(data: SkillCurrentLevelChangedPayload): unknown[] {
  const arr: unknown[] = new Array(2);
  arr[SkillCurrentLevelChangedFields.Skill] = data.Skill;
  arr[SkillCurrentLevelChangedFields.CurrentLevel] = data.CurrentLevel;
  return arr;
}
