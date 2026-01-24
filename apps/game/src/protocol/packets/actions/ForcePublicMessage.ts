import { assertIsArray, type PacketArray } from "../../codec/arrayCodec";
import { ForcePublicMessageFields } from "../../fields/actions/ForcePublicMessageFields";

/** Auto-generated from `apps/game/gameActionFactory.js` (ForcePublicMessage) */
export type ForcePublicMessagePayload = {
  EntityID: unknown;
  EntityType: unknown;
  Message: unknown;
};

export function decodeForcePublicMessagePayload(payload: unknown): ForcePublicMessagePayload {
  assertIsArray(payload, "ForcePublicMessage payload");
  const arr = payload as PacketArray;
  return {
    EntityID: arr[ForcePublicMessageFields.EntityID] as any,
    EntityType: arr[ForcePublicMessageFields.EntityType] as any,
    Message: arr[ForcePublicMessageFields.Message] as any,
  };
}

export function buildForcePublicMessagePayload(data: ForcePublicMessagePayload): unknown[] {
  const arr: unknown[] = new Array(3);
  arr[ForcePublicMessageFields.EntityID] = data.EntityID;
  arr[ForcePublicMessageFields.EntityType] = data.EntityType;
  arr[ForcePublicMessageFields.Message] = data.Message;
  return arr;
}
