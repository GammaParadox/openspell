import { assertIsArray, type PacketArray } from "../../codec/arrayCodec";
import { SwitchToIdleStateFields } from "../../fields/actions/SwitchToIdleStateFields";

/** Auto-generated from `apps/game/gameActionFactory.js` (SwitchToIdleState) */
export type SwitchToIdleStatePayload = {
  Switch: unknown;
};

export function decodeSwitchToIdleStatePayload(payload: unknown): SwitchToIdleStatePayload {
  assertIsArray(payload, "SwitchToIdleState payload");
  const arr = payload as PacketArray;
  return {
    Switch: arr[SwitchToIdleStateFields.Switch] as any,
  };
}

export function buildSwitchToIdleStatePayload(data: SwitchToIdleStatePayload): unknown[] {
  const arr: unknown[] = new Array(1);
  arr[SwitchToIdleStateFields.Switch] = data.Switch;
  return arr;
}
