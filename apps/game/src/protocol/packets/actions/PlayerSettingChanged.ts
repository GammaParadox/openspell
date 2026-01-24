import { assertIsArray, type PacketArray } from "../../codec/arrayCodec";
import { PlayerSettingChangedFields } from "../../fields/actions/PlayerSettingChangedFields";

/** Auto-generated from `apps/game/gameActionFactory.js` (PlayerSettingChanged) */
export type PlayerSettingChangedPayload = {
  Setting: unknown;
  Value: unknown;
};

export function decodePlayerSettingChangedPayload(payload: unknown): PlayerSettingChangedPayload {
  assertIsArray(payload, "PlayerSettingChanged payload");
  const arr = payload as PacketArray;
  return {
    Setting: arr[PlayerSettingChangedFields.Setting] as any,
    Value: arr[PlayerSettingChangedFields.Value] as any,
  };
}

export function buildPlayerSettingChangedPayload(data: PlayerSettingChangedPayload): unknown[] {
  const arr: unknown[] = new Array(2);
  arr[PlayerSettingChangedFields.Setting] = data.Setting;
  arr[PlayerSettingChangedFields.Value] = data.Value;
  return arr;
}
