import { GameAction } from "./GameAction";

/**
 * Client->server "commands" sent inside the Socket.IO event `GameAction.ClientAction` ("1").
 *
 * The client does NOT emit these as Socket.IO event names directly.
 * Instead it emits:
 *   socket.emit("1", [actionType, actionData])
 * where actionType is one of the values below.
 *
 * Source: client `create<Something>Action()` methods that are used by `SocketManager.emitPacket(...)`.
 */
export const ClientActionTypes = {
  // Movement / interaction
  SendMovementPath: GameAction.SendMovementPath, // createSendMovementPathAction
  SwitchToIdleState: GameAction.SwitchToIdleState, // createSwitchToIdleStateAction
  PerformActionOnEntity: GameAction.PerformActionOnEntity, // createPerformActionOnEntityAction

  // Inventory / item interactions
  UseItemOnEntity: GameAction.UseItemOnEntity, // createUseItemOnEntityAction
  UseItemOnItem: GameAction.UseItemOnItem, // createUseItemOnItemAction
  InvokeInventoryItemAction: GameAction.InvokeInventoryItemAction, // createInvokeInventoryItemActionAction
  ReorganizeInventorySlots: GameAction.ReorganizeInventorySlots, // createReorganizeInventorySlotsAction
  CreateItem: GameAction.CreateItem, // createCreateItemAction

  // NPC / chat
  SelectNPCConversationOption: GameAction.SelectNPCConversationOption, // createSelectNPCConversationOption
  PublicMessage: GameAction.PublicMessage, // createPublicMessageAction

  // Settings / misc
  ChangePlayerSetting: GameAction.ChangePlayerSetting, // createChangePlayerSettingAction
  ToggleAutoCast: GameAction.ToggleAutoCast, // createToggleAutoCastAction
  CaptchaAction: GameAction.CaptchaAction, // createCaptchaActionAction
  ChangeAppearance: GameAction.ChangeAppearance, // createChangeAppearanceAction

  // Trade
  UpdateTradeStatus: GameAction.UpdateTradeStatus, // createUpdateTradeStatusAction

  // Spells
  CastTeleportSpell: GameAction.CastTeleportSpell, // createCastTeleportSpellAction
  CastInventorySpell: GameAction.CastInventorySpell, // createCastInventorySpellAction
  CastSingleCombatOrStatusSpell: GameAction.CastSingleCombatOrStatusSpell // createCastSingleCombatOrStatusSpellAction
  ,
  // Session
  Logout: GameAction.Logout // createLogoutAction
} as const;

export type ClientActionType = (typeof ClientActionTypes)[keyof typeof ClientActionTypes];

export function isClientActionType(value: number): value is ClientActionType {
  // small set; linear scan is fine
  return (Object.values(ClientActionTypes) as number[]).includes(value);
}

