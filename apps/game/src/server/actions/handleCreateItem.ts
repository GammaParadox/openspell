import { decodeCreateItemPayload } from "../../protocol/packets/actions/CreateItem";
import type { ActionContext } from "./types";

export function handleCreateItem(ctx: ActionContext, actionData: unknown): void {
  if (ctx.userId === null) {
    return;
  }

  const payload = decodeCreateItemPayload(actionData);
  ctx.skillingMenuService.handleCreateItem(ctx.userId, payload);
}
