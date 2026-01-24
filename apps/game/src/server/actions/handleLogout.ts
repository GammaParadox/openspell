import { GameAction } from "../../protocol/enums/GameAction";
import { buildLoggedOutPayload } from "../../protocol/packets/actions/LoggedOut";
import type { ActionHandler } from "./types";

/**
 * Handles player logout requests.
 * Note: The actual cleanup is handled by the socket disconnect handler in GameServer.
 * This just sends the LoggedOut packet and disconnects the socket.
 */
export const handleLogout: ActionHandler = async (ctx, actionData) => {
  if (ctx.userId === null) return;
  
  ctx.socket.emit(
    GameAction.LoggedOut.toString(),
    buildLoggedOutPayload({ EntityID: ctx.userId })
  );
  
  // Socket disconnect will trigger cleanupConnectedUser in GameServer
  ctx.socket.disconnect(true);
};
