import { assertIsArray, type PacketArray } from "../../codec/arrayCodec";
import { EntityPerformedPhysicalActionFields } from "../../fields/actions/EntityPerformedPhysicalActionFields";

/** Auto-generated from `apps/game/gameActionFactory.js` (EntityPerformedPhysicalAction) */
export type EntityPerformedPhysicalActionPayload = {
  EntityID: unknown;
  EntityType: unknown;
  Action: unknown;
  ActionTickLength: unknown;
  ActionValue: unknown;
  DelayTicks: unknown;
};

export function decodeEntityPerformedPhysicalActionPayload(payload: unknown): EntityPerformedPhysicalActionPayload {
  assertIsArray(payload, "EntityPerformedPhysicalAction payload");
  const arr = payload as PacketArray;
  return {
    EntityID: arr[EntityPerformedPhysicalActionFields.EntityID] as any,
    EntityType: arr[EntityPerformedPhysicalActionFields.EntityType] as any,
    Action: arr[EntityPerformedPhysicalActionFields.Action] as any,
    ActionTickLength: arr[EntityPerformedPhysicalActionFields.ActionTickLength] as any,
    ActionValue: arr[EntityPerformedPhysicalActionFields.ActionValue] as any,
    DelayTicks: arr[EntityPerformedPhysicalActionFields.DelayTicks] as any,
  };
}

export function buildEntityPerformedPhysicalActionPayload(data: EntityPerformedPhysicalActionPayload): unknown[] {
  const arr: unknown[] = new Array(6);
  arr[EntityPerformedPhysicalActionFields.EntityID] = data.EntityID;
  arr[EntityPerformedPhysicalActionFields.EntityType] = data.EntityType;
  arr[EntityPerformedPhysicalActionFields.Action] = data.Action;
  arr[EntityPerformedPhysicalActionFields.ActionTickLength] = data.ActionTickLength;
  arr[EntityPerformedPhysicalActionFields.ActionValue] = data.ActionValue;
  arr[EntityPerformedPhysicalActionFields.DelayTicks] = data.DelayTicks;
  return arr;
}
