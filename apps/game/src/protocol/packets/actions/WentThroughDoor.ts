import { assertIsArray, type PacketArray } from "../../codec/arrayCodec";
import { WentThroughDoorFields } from "../../fields/actions/WentThroughDoorFields";

/** Auto-generated from `apps/game/gameActionFactory.js` (WentThroughDoor) */
export type WentThroughDoorPayload = {
  DoorEntityTypeID: unknown;
  EntityID: unknown;
};

export function decodeWentThroughDoorPayload(payload: unknown): WentThroughDoorPayload {
  assertIsArray(payload, "WentThroughDoor payload");
  const arr = payload as PacketArray;
  return {
    DoorEntityTypeID: arr[WentThroughDoorFields.DoorEntityTypeID] as any,
    EntityID: arr[WentThroughDoorFields.EntityID] as any,
  };
}

export function buildWentThroughDoorPayload(data: WentThroughDoorPayload): unknown[] {
  const arr: unknown[] = new Array(2);
  arr[WentThroughDoorFields.DoorEntityTypeID] = data.DoorEntityTypeID;
  arr[WentThroughDoorFields.EntityID] = data.EntityID;
  return arr;
}
