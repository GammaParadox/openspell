import { assertIsArray, type PacketArray } from "../../codec/arrayCodec";
import { PlayerSkillLevelIncreasedFields } from "../../fields/actions/PlayerSkillLevelIncreasedFields";

/** Auto-generated from `apps/game/gameActionFactory.js` (PlayerSkillLevelIncreased) */
export type PlayerSkillLevelIncreasedPayload = {
  PlayerEntityID: unknown;
  Skill: unknown;
  LevelsGained: unknown;
  NewLevel: unknown;
};

export function decodePlayerSkillLevelIncreasedPayload(payload: unknown): PlayerSkillLevelIncreasedPayload {
  assertIsArray(payload, "PlayerSkillLevelIncreased payload");
  const arr = payload as PacketArray;
  return {
    PlayerEntityID: arr[PlayerSkillLevelIncreasedFields.PlayerEntityID] as any,
    Skill: arr[PlayerSkillLevelIncreasedFields.Skill] as any,
    LevelsGained: arr[PlayerSkillLevelIncreasedFields.LevelsGained] as any,
    NewLevel: arr[PlayerSkillLevelIncreasedFields.NewLevel] as any,
  };
}

export function buildPlayerSkillLevelIncreasedPayload(data: PlayerSkillLevelIncreasedPayload): unknown[] {
  const arr: unknown[] = new Array(4);
  arr[PlayerSkillLevelIncreasedFields.PlayerEntityID] = data.PlayerEntityID;
  arr[PlayerSkillLevelIncreasedFields.Skill] = data.Skill;
  arr[PlayerSkillLevelIncreasedFields.LevelsGained] = data.LevelsGained;
  arr[PlayerSkillLevelIncreasedFields.NewLevel] = data.NewLevel;
  return arr;
}
