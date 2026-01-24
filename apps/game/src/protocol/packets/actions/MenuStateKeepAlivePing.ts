import { assertIsArray, type PacketArray } from "../../codec/arrayCodec";
import { MenuStateKeepAlivePingFields } from "../../fields/actions/MenuStateKeepAlivePingFields";

/** Auto-generated from `apps/game/gameActionFactory.js` (MenuStateKeepAlivePing) */
export type MenuStateKeepAlivePingPayload = {
  IsActive: boolean;
};

export function decodeMenuStateKeepAlivePingPayload(payload: unknown): MenuStateKeepAlivePingPayload {
  assertIsArray(payload, "MenuStateKeepAlivePing payload");
  const arr = payload as PacketArray;
  return {
    IsActive: arr[MenuStateKeepAlivePingFields.IsActive] as any,
  };
}

export function buildMenuStateKeepAlivePingPayload(data: MenuStateKeepAlivePingPayload): unknown[] {
  const arr: unknown[] = new Array(1);
  arr[MenuStateKeepAlivePingFields.IsActive] = data.IsActive ? 1 : 0;
  return arr;
}
