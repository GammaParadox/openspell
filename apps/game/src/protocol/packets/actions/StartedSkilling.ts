import { assertIsArray, type PacketArray } from "../../codec/arrayCodec";
import { StartedSkillingFields } from "../../fields/actions/StartedSkillingFields";

/** Auto-generated from `apps/game/gameActionFactory.js` (StartedSkilling) */
export type StartedSkillingPayload = {
  PlayerEntityID: unknown;
  TargetID: unknown;
  Skill: unknown;
  TargetType: unknown;
};

export function decodeStartedSkillingPayload(payload: unknown): StartedSkillingPayload {
  assertIsArray(payload, "StartedSkilling payload");
  const arr = payload as PacketArray;
  return {
    PlayerEntityID: arr[StartedSkillingFields.PlayerEntityID] as any,
    TargetID: arr[StartedSkillingFields.TargetID] as any,
    Skill: arr[StartedSkillingFields.Skill] as any,
    TargetType: arr[StartedSkillingFields.TargetType] as any,
  };
}

export function buildStartedSkillingPayload(data: StartedSkillingPayload): unknown[] {
  const arr: unknown[] = new Array(4);
  arr[StartedSkillingFields.PlayerEntityID] = data.PlayerEntityID;
  arr[StartedSkillingFields.TargetID] = data.TargetID;
  arr[StartedSkillingFields.Skill] = data.Skill;
  arr[StartedSkillingFields.TargetType] = data.TargetType;
  return arr;
}
