import { assertIsArray, type PacketArray } from "../../codec/arrayCodec";
import { StoppedSkillingFields } from "../../fields/actions/StoppedSkillingFields";

/** Auto-generated from `apps/game/gameActionFactory.js` (StoppedSkilling) */
export type StoppedSkillingPayload = {
  PlayerEntityID: unknown;
  Skill: unknown;
  DidExhaustResources: boolean;
};

export function decodeStoppedSkillingPayload(payload: unknown): StoppedSkillingPayload {
  assertIsArray(payload, "StoppedSkilling payload");
  const arr = payload as PacketArray;
  return {
    PlayerEntityID: arr[StoppedSkillingFields.PlayerEntityID] as any,
    Skill: arr[StoppedSkillingFields.Skill] as any,
    DidExhaustResources: arr[StoppedSkillingFields.DidExhaustResources] as any,
  };
}

export function buildStoppedSkillingPayload(data: StoppedSkillingPayload): unknown[] {
  const arr: unknown[] = new Array(3);
  arr[StoppedSkillingFields.PlayerEntityID] = data.PlayerEntityID;
  arr[StoppedSkillingFields.Skill] = data.Skill;
  arr[StoppedSkillingFields.DidExhaustResources] = data.DidExhaustResources ? 1 : 0;
  return arr;
}
