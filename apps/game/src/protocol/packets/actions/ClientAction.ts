import { assertIsArray, type PacketArray } from "../../codec/arrayCodec";
import { ClientActionFields } from "../../fields/actions/ClientActionFields";

/** Auto-generated from `apps/game/gameActionFactory.js` (ClientAction) */
export type ClientActionPayload = {
  ActionType: unknown;
  ActionData: unknown;
};

export function decodeClientActionPayload(payload: unknown): ClientActionPayload {
  assertIsArray(payload, "ClientAction payload");
  const arr = payload as PacketArray;
  return {
    ActionType: arr[ClientActionFields.ActionType] as any,
    ActionData: arr[ClientActionFields.ActionData] as any,
  };
}

export function buildClientActionPayload(data: ClientActionPayload): unknown[] {
  const arr: unknown[] = new Array(2);
  arr[ClientActionFields.ActionType] = data.ActionType;
  arr[ClientActionFields.ActionData] = data.ActionData;
  return arr;
}
