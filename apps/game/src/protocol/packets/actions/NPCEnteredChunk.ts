import { assertIsArray, type PacketArray } from "../../codec/arrayCodec";
import { NPCEnteredChunkFields } from "../../fields/actions/NPCEnteredChunkFields";

/** Auto-generated from `apps/game/gameActionFactory.js` (NPCEnteredChunk) */
export type NPCEnteredChunkPayload = {
  EntityID: unknown;
  NPCID: unknown;
  CurrentMapLevel: unknown;
  X: unknown;
  Y: unknown;
  CurrentHitpointsLevel: unknown;
  VisibilityRequirements: unknown;
};

export function decodeNPCEnteredChunkPayload(payload: unknown): NPCEnteredChunkPayload {
  assertIsArray(payload, "NPCEnteredChunk payload");
  const arr = payload as PacketArray;
  return {
    EntityID: arr[NPCEnteredChunkFields.EntityID] as any,
    NPCID: arr[NPCEnteredChunkFields.NPCID] as any,
    CurrentMapLevel: arr[NPCEnteredChunkFields.CurrentMapLevel] as any,
    X: arr[NPCEnteredChunkFields.X] as any,
    Y: arr[NPCEnteredChunkFields.Y] as any,
    CurrentHitpointsLevel: arr[NPCEnteredChunkFields.CurrentHitpointsLevel] as any,
    VisibilityRequirements: arr[NPCEnteredChunkFields.VisibilityRequirements] as any,
  };
}

export function buildNPCEnteredChunkPayload(data: NPCEnteredChunkPayload): unknown[] {
  const arr: unknown[] = new Array(7);
  arr[NPCEnteredChunkFields.EntityID] = data.EntityID;
  arr[NPCEnteredChunkFields.NPCID] = data.NPCID;
  arr[NPCEnteredChunkFields.CurrentMapLevel] = data.CurrentMapLevel;
  arr[NPCEnteredChunkFields.X] = data.X;
  arr[NPCEnteredChunkFields.Y] = data.Y;
  arr[NPCEnteredChunkFields.CurrentHitpointsLevel] = data.CurrentHitpointsLevel;
  arr[NPCEnteredChunkFields.VisibilityRequirements] = data.VisibilityRequirements;
  return arr;
}
