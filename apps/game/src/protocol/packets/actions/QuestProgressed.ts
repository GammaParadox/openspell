import { assertIsArray, type PacketArray } from "../../codec/arrayCodec";
import { QuestProgressedFields } from "../../fields/actions/QuestProgressedFields";

/** Auto-generated from `apps/game/gameActionFactory.js` (QuestProgressed) */
export type QuestProgressedPayload = {
  QuestID: unknown;
  CurrentCheckpoint: unknown;
};

export function decodeQuestProgressedPayload(payload: unknown): QuestProgressedPayload {
  assertIsArray(payload, "QuestProgressed payload");
  const arr = payload as PacketArray;
  return {
    QuestID: arr[QuestProgressedFields.QuestID] as any,
    CurrentCheckpoint: arr[QuestProgressedFields.CurrentCheckpoint] as any,
  };
}

export function buildQuestProgressedPayload(data: QuestProgressedPayload): unknown[] {
  const arr: unknown[] = new Array(2);
  arr[QuestProgressedFields.QuestID] = data.QuestID;
  arr[QuestProgressedFields.CurrentCheckpoint] = data.CurrentCheckpoint;
  return arr;
}
