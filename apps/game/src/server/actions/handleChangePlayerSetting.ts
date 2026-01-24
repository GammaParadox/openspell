import { GameAction } from "../../protocol/enums/GameAction";
import { decodeChangePlayerSettingPayload, buildChangePlayerSettingPayload } from "../../protocol/packets/actions/ChangePlayerSetting";
import { buildPlayerSettingChangedPayload } from "../../protocol/packets/actions/PlayerSettingChanged";
import type { ActionHandler } from "./types";

/**
 * Handles player setting change requests (e.g., sprint toggle, auto-retaliate, etc.)
 */
export const handleChangePlayerSetting: ActionHandler = (ctx, actionData) => {
  if (ctx.userId === null) return;
  
  const changePlayerSetting = decodeChangePlayerSettingPayload(actionData);
  if (!changePlayerSetting) return; // Invalid packet, already logged in decode
  
  const playerState = ctx.playerStatesByUserId.get(ctx.userId);
  if (!playerState) return;

  playerState.updateSetting(changePlayerSetting.Setting as number, changePlayerSetting.Value as number);
  
  ctx.enqueueUserMessage(
    ctx.userId,
    GameAction.PlayerSettingChanged,
    buildPlayerSettingChangedPayload({
      Setting: changePlayerSetting.Setting,
      Value: playerState.settings[changePlayerSetting.Setting as keyof typeof playerState.settings]
    })
  );
};
