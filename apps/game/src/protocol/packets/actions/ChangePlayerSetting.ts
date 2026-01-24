import { assertIsArray, type PacketArray } from "../../codec/arrayCodec";
import { ChangePlayerSettingFields } from "../../fields/actions/ChangePlayerSettingFields";

/** Auto-generated from `apps/game/gameActionFactory.js` (ChangePlayerSetting) */
export type ChangePlayerSettingPayload = {
  Setting: unknown;
  Value: unknown;
};

export function decodeChangePlayerSettingPayload(payload: unknown): ChangePlayerSettingPayload {
  assertIsArray(payload, "ChangePlayerSetting payload");
  const arr = payload as PacketArray;
  return {
    Setting: arr[ChangePlayerSettingFields.Setting] as any,
    Value: arr[ChangePlayerSettingFields.Value] as any,
  };
}

export function buildChangePlayerSettingPayload(data: ChangePlayerSettingPayload): unknown[] {
  const arr: unknown[] = new Array(2);
  arr[ChangePlayerSettingFields.Setting] = data.Setting;
  arr[ChangePlayerSettingFields.Value] = data.Value;
  return arr;
}
