import { assertIsArray, type PacketArray } from "../../codec/arrayCodec";
import { PublicMessageFields } from "../../fields/actions/PublicMessageFields";

/** Auto-generated from `apps/game/gameActionFactory.js` (PublicMessage) */
export type PublicMessagePayload = {
  EntityID: unknown;
  Style: unknown;
  Message: unknown;
  PlayerType: unknown;
};

export function decodePublicMessagePayload(payload: unknown): PublicMessagePayload {
  assertIsArray(payload, "PublicMessage payload");
  const arr = payload as PacketArray;
  return {
    EntityID: arr[PublicMessageFields.EntityID] as any,
    Style: arr[PublicMessageFields.Style] as any,
    Message: arr[PublicMessageFields.Message] as any,
    PlayerType: arr[PublicMessageFields.PlayerType] as any,
  };
}

export function buildPublicMessagePayload(data: PublicMessagePayload): unknown[] {
  const arr: unknown[] = new Array(4);
  arr[PublicMessageFields.EntityID] = data.EntityID;
  arr[PublicMessageFields.Style] = data.Style;
  arr[PublicMessageFields.Message] = data.Message;
  arr[PublicMessageFields.PlayerType] = data.PlayerType;
  return arr;
}
