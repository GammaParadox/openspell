import { assertIsArray, type PacketArray } from "../../codec/arrayCodec";
import { FiredProjectileFields } from "../../fields/actions/FiredProjectileFields";

/** Auto-generated from `apps/game/gameActionFactory.js` (FiredProjectile) */
export type FiredProjectilePayload = {
  ProjectileID: unknown;
  RangerID: unknown;
  RangerEntityType: unknown;
  TargetID: unknown;
  TargetEntityType: unknown;
  DamageAmount: unknown;
  IsConfused: boolean;
};

export function decodeFiredProjectilePayload(payload: unknown): FiredProjectilePayload {
  assertIsArray(payload, "FiredProjectile payload");
  const arr = payload as PacketArray;
  return {
    ProjectileID: arr[FiredProjectileFields.ProjectileID] as any,
    RangerID: arr[FiredProjectileFields.RangerID] as any,
    RangerEntityType: arr[FiredProjectileFields.RangerEntityType] as any,
    TargetID: arr[FiredProjectileFields.TargetID] as any,
    TargetEntityType: arr[FiredProjectileFields.TargetEntityType] as any,
    DamageAmount: arr[FiredProjectileFields.DamageAmount] as any,
    IsConfused: arr[FiredProjectileFields.IsConfused] as any,
  };
}

export function buildFiredProjectilePayload(data: FiredProjectilePayload): unknown[] {
  const arr: unknown[] = new Array(7);
  arr[FiredProjectileFields.ProjectileID] = data.ProjectileID;
  arr[FiredProjectileFields.RangerID] = data.RangerID;
  arr[FiredProjectileFields.RangerEntityType] = data.RangerEntityType;
  arr[FiredProjectileFields.TargetID] = data.TargetID;
  arr[FiredProjectileFields.TargetEntityType] = data.TargetEntityType;
  arr[FiredProjectileFields.DamageAmount] = data.DamageAmount;
  arr[FiredProjectileFields.IsConfused] = data.IsConfused ? 1 : 0;
  return arr;
}
