import { GameAction } from "../../protocol/enums/GameAction";
import { decodeToggleAutoCastPayload } from "../../protocol/packets/actions/ToggleAutoCast";
import { buildToggledAutoCastPayload } from "../../protocol/packets/actions/ToggledAutoCast";
import type { ActionHandler } from "./types";

export const handleToggleAutoCast: ActionHandler = (ctx, actionData) => {
  if (ctx.userId === null) return;

  const playerState = ctx.playerStatesByUserId.get(ctx.userId);
  if (!playerState) return;

  const decoded = decodeToggleAutoCastPayload(actionData);
  const rawSpellId = decoded.SpellID;
  const requestedSpellId = rawSpellId === null || rawSpellId === undefined
    ? null
    : Number(rawSpellId);
  const isValidSpellId = requestedSpellId !== null && Number.isFinite(requestedSpellId);
  const spellDef = isValidSpellId
    ? ctx.spellCatalog?.getDefinitionById(requestedSpellId)
    : undefined;

  const isCombatSpell = !!spellDef && spellDef.type === "combat";
  playerState.autoCastSpellId = isCombatSpell ? requestedSpellId : null;

  const confirmedSpellId = isCombatSpell ? requestedSpellId : null;
  const payload = buildToggledAutoCastPayload({
    SpellID: confirmedSpellId
  });
  ctx.enqueueUserMessage(ctx.userId, GameAction.ToggledAutoCast, payload);
};
