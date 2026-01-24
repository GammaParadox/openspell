import { assertIsArray, type PacketArray } from "../../codec/arrayCodec";
import { OpenedSkillingMenuFields } from "../../fields/actions/OpenedSkillingMenuFields";

/** Auto-generated from `apps/game/gameActionFactory.js` (OpenedSkillingMenu) */
export type OpenedSkillingMenuPayload = {
  TargetID: unknown;
  MenuType: unknown;
};

export function decodeOpenedSkillingMenuPayload(payload: unknown): OpenedSkillingMenuPayload {
  assertIsArray(payload, "OpenedSkillingMenu payload");
  const arr = payload as PacketArray;
  return {
    TargetID: arr[OpenedSkillingMenuFields.TargetID] as any,
    MenuType: arr[OpenedSkillingMenuFields.MenuType] as any,
  };
}

export function buildOpenedSkillingMenuPayload(data: OpenedSkillingMenuPayload): unknown[] {
  const arr: unknown[] = new Array(2);
  arr[OpenedSkillingMenuFields.TargetID] = data.TargetID;
  arr[OpenedSkillingMenuFields.MenuType] = data.MenuType;
  return arr;
}
