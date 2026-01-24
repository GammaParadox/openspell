import { assertIsArray, type PacketArray } from "../../codec/arrayCodec";
import { GlobalPublicMessageFields } from "../../fields/actions/GlobalPublicMessageFields";

/** Auto-generated from `apps/game/gameActionFactory.js` (GlobalPublicMessage) */
export type GlobalPublicMessagePayload = {
  EntityID: unknown;
  Name: unknown;
  Message: unknown;
  PlayerType: unknown;
};

export function decodeGlobalPublicMessagePayload(payload: unknown): GlobalPublicMessagePayload {
  assertIsArray(payload, "GlobalPublicMessage payload");
  const arr = payload as PacketArray;
  return {
    EntityID: arr[GlobalPublicMessageFields.EntityID] as any,
    Name: arr[GlobalPublicMessageFields.Name] as any,
    Message: arr[GlobalPublicMessageFields.Message] as any,
    PlayerType: arr[GlobalPublicMessageFields.PlayerType] as any,
  };
}

export function buildGlobalPublicMessagePayload(data: GlobalPublicMessagePayload): unknown[] {
  const arr: unknown[] = new Array(4);
  arr[GlobalPublicMessageFields.EntityID] = data.EntityID;
  arr[GlobalPublicMessageFields.Name] = data.Name;
  arr[GlobalPublicMessageFields.Message] = data.Message;
  arr[GlobalPublicMessageFields.PlayerType] = data.PlayerType;
  return arr;
}
