import { assertIsArray, type PacketArray } from "../../codec/arrayCodec";
import { ShowSkillCurrentLevelIncreasedOrDecreasedMessageFields } from "../../fields/actions/ShowSkillCurrentLevelIncreasedOrDecreasedMessageFields";

/** Auto-generated from `apps/game/gameActionFactory.js` (ShowSkillCurrentLevelIncreasedOrDecreasedMessage) */
export type ShowSkillCurrentLevelIncreasedOrDecreasedMessagePayload = {
  Skill: unknown;
  Level: unknown;
  PreviousCurrentLevel: unknown;
  CurrentLevel: unknown;
};

export function decodeShowSkillCurrentLevelIncreasedOrDecreasedMessagePayload(payload: unknown): ShowSkillCurrentLevelIncreasedOrDecreasedMessagePayload {
  assertIsArray(payload, "ShowSkillCurrentLevelIncreasedOrDecreasedMessage payload");
  const arr = payload as PacketArray;
  return {
    Skill: arr[ShowSkillCurrentLevelIncreasedOrDecreasedMessageFields.Skill] as any,
    Level: arr[ShowSkillCurrentLevelIncreasedOrDecreasedMessageFields.Level] as any,
    PreviousCurrentLevel: arr[ShowSkillCurrentLevelIncreasedOrDecreasedMessageFields.PreviousCurrentLevel] as any,
    CurrentLevel: arr[ShowSkillCurrentLevelIncreasedOrDecreasedMessageFields.CurrentLevel] as any,
  };
}

export function buildShowSkillCurrentLevelIncreasedOrDecreasedMessagePayload(data: ShowSkillCurrentLevelIncreasedOrDecreasedMessagePayload): unknown[] {
  const arr: unknown[] = new Array(4);
  arr[ShowSkillCurrentLevelIncreasedOrDecreasedMessageFields.Skill] = data.Skill;
  arr[ShowSkillCurrentLevelIncreasedOrDecreasedMessageFields.Level] = data.Level;
  arr[ShowSkillCurrentLevelIncreasedOrDecreasedMessageFields.PreviousCurrentLevel] = data.PreviousCurrentLevel;
  arr[ShowSkillCurrentLevelIncreasedOrDecreasedMessageFields.CurrentLevel] = data.CurrentLevel;
  return arr;
}
