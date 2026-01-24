createGameAction(e, t) {
    return new AN(e,t)
}
createGameStateUpdateAction(e) {
    let t = new Array(e.length);
    for (let i = 0; i < e.length; i++) {
        let n = new Array(VT);
        n[UT.GameActionName] = e[i].Name,
        n[UT.GameActionData] = e[i].Data,
        t[i] = n
    }
    return new AN(gameActions.GameStateUpdate,t)
}
createClientActionAction(e) {
    let t = new Array(zT);
    return t[GT.ActionType] = e.Name,
    t[GT.ActionData] = e.Data,
    new AN(gameActions.ClientAction,t)
}
createEntityMoveToAction(e, t, i, n) {
    let r = new Array(HT);
    return r[WT.EntityID] = e,
    r[WT.EntityType] = t,
    r[WT.X] = i,
    r[WT.Y] = n,
    new AN(gameActions.EntityMoveTo,r)
}
createPlayerEnteredChunkAction(e, t, i, n, r, s, a, o, l, h, c, u, d) {
    let p = new Array(qT);
    return p[XT.EntityID] = e,
    p[XT.EntityTypeID] = t,
    p[XT.PlayerType] = i,
    p[XT.Username] = n,
    p[XT.CombatLevel] = r,
    p[XT.HitpointsLevel] = s,
    p[XT.CurrentHitpointsLevel] = a,
    p[XT.MapLevel] = o,
    p[XT.X] = l,
    p[XT.Y] = h,
    p[XT.HairStyleID] = c.HairID,
    p[XT.BeardStyleID] = c.BeardID,
    p[XT.ShirtID] = c.ShirtID,
    p[XT.BodyTypeID] = c.BodyID,
    p[XT.LegsID] = c.LegsID,
    p[XT.EquipmentHeadID] = null !== c.EquippedItems[kP.helmet] ? c.EquippedItems[kP.helmet].Def.ID : null,
    p[XT.EquipmentBodyID] = null !== c.EquippedItems[kP.chest] ? c.EquippedItems[kP.chest].Def.ID : null,
    p[XT.EquipmentLegsID] = null !== c.EquippedItems[kP.legs] ? c.EquippedItems[kP.legs].Def.ID : null,
    p[XT.EquipmentBootsID] = null !== c.EquippedItems[kP.boots] ? c.EquippedItems[kP.boots].Def.ID : null,
    p[XT.EquipmentNecklaceID] = null !== c.EquippedItems[kP.neck] ? c.EquippedItems[kP.neck].Def.ID : null,
    p[XT.EquipmentWeaponID] = null !== c.EquippedItems[kP.weapon] ? c.EquippedItems[kP.weapon].Def.ID : null,
    p[XT.EquipmentShieldID] = null !== c.EquippedItems[kP.shield] ? c.EquippedItems[kP.shield].Def.ID : null,
    p[XT.EquipmentBackPackID] = null !== c.EquippedItems[kP.back] ? c.EquippedItems[kP.back].Def.ID : null,
    p[XT.EquipmentGlovesID] = null !== c.EquippedItems[kP.gloves] ? c.EquippedItems[kP.gloves].Def.ID : null,
    p[XT.EquipmentProjectileID] = null !== c.EquippedItems[kP.projectile] ? c.EquippedItems[kP.projectile].Def.ID : null,
    p[XT.CurrentState] = u,
    p[XT.MentalClarity] = d,
    new AN(gameActions.PlayerEnteredChunk,p)
}
createNPCEnteredChunkAction(e, t, i, n, r, s, a) {
    let o = new Array(jT);
    return o[YT.EntityID] = e,
    o[YT.NPCID] = t,
    o[YT.CurrentMapLevel] = i,
    o[YT.X] = n,
    o[YT.Y] = r,
    o[YT.CurrentHitpointsLevel] = s,
    o[YT.VisibilityRequirements] = a,
    new AN(gameActions.NPCEnteredChunk,o)
}
createItemEnteredChunkAction(e, t, i, n, r, s, a) {
    let o = new Array(KT);
    return o[$T.EntityID] = e,
    o[$T.ItemID] = t,
    o[$T.Amount] = i,
    o[$T.IsIOU] = n ? 1 : 0,
    o[$T.MapLevel] = r,
    o[$T.X] = s,
    o[$T.Y] = a,
    new AN(gameActions.ItemEnteredChunk,o)
}
createEntityExitedChunkAction(e, t) {
    let i = new Array(QT);
    return i[ZT.EntityID] = e,
    i[ZT.EntityType] = t,
    new AN(gameActions.EntityExitedChunk,i)
}
createInGameHourChangedAction(e) {
    let t = new Array(ix);
    return t[tx.CurrentHour] = e,
    new AN(gameActions.InGameHourChanged,t)
}
createShowDamageAction(e, t, i) {
    let n = new Array(rx);
    return n[nx.SenderEntityID] = e,
    n[nx.ReceiverEntityID] = t,
    n[nx.DamageAmount] = i,
    new AN(gameActions.ShowDamage,n)
}
createSendMovementPathAction(e, t) {
    let i = new Array(ax);
    return i[sx.X] = e,
    i[sx.Y] = t,
    new AN(gameActions.SendMovementPath,i)
}
createObtainedResourceAction(e) {
    let t = new Array(ex);
    return t[JT.ItemID] = e,
    new AN(gameActions.ObtainedResource,t)
}
createPublicMessageAction(e, t, i, n) {
    let r = new Array(lx);
    return r[ox.EntityID] = e,
    r[ox.Style] = t,
    r[ox.Message] = i,
    r[ox.PlayerType] = n,
    new AN(gameActions.PublicMessage,r)
}
createEnteredIdleStateAction(e, t) {
    let i = new Array(cx);
    return i[hx.EntityID] = e,
    i[hx.EntityType] = t,
    new AN(gameActions.EnteredIdleState,i)
}
createLoginAction(e, t, i) {
    let n = new Array(dx);
    return n[ux.Username] = e,
    n[ux.Token] = t,
    n[ux.CurrentClientVersion] = i,
    new AN(gameActions.Login,n)
}
createLoginFailedAction(e) {
    let t = new Array(fx);
    return t[px.Reason] = e,
    new AN(gameActions.LoginFailed,t)
}
createLoggedInAction(e, t, i, n, r, s, a, o, l, h, c, u, d, p, f, _, m, g, v, S, C, E, y) {
    let T = new Array(mx);
    return T[_x.EntityID] = e,
    T[_x.EntityTypeID] = t,
    T[_x.PlayerType] = i,
    T[_x.Username] = n,
    T[_x.MapLevel] = r,
    T[_x.X] = s,
    T[_x.Y] = a,
    T[_x.Inventory] = c.map((e => e ? [e.Def.ID, e.Amount, e.IsIOU ? 1 : 0] : null)),
    T[_x.HairStyleID] = o.HairID,
    T[_x.BeardStyleID] = o.BeardID,
    T[_x.ShirtID] = o.ShirtID,
    T[_x.BodyTypeID] = o.BodyID,
    T[_x.LegsID] = o.LegsID,
    T[_x.EquipmentHead] = null !== o.EquippedItems[kP.helmet] ? [o.EquippedItems[kP.helmet].Def.ID, o.EquippedItems[kP.helmet].Amount] : null,
    T[_x.EquipmentBody] = null !== o.EquippedItems[kP.chest] ? [o.EquippedItems[kP.chest].Def.ID, o.EquippedItems[kP.chest].Amount] : null,
    T[_x.EquipmentLegs] = null !== o.EquippedItems[kP.legs] ? [o.EquippedItems[kP.legs].Def.ID, o.EquippedItems[kP.legs].Amount] : null,
    T[_x.EquipmentBoots] = null !== o.EquippedItems[kP.boots] ? [o.EquippedItems[kP.boots].Def.ID, o.EquippedItems[kP.boots].Amount] : null,
    T[_x.EquipmentNecklace] = null !== o.EquippedItems[kP.neck] ? [o.EquippedItems[kP.neck].Def.ID, o.EquippedItems[kP.neck].Amount] : null,
    T[_x.EquipmentWeapon] = null !== o.EquippedItems[kP.weapon] ? [o.EquippedItems[kP.weapon].Def.ID, o.EquippedItems[kP.weapon].Amount] : null,
    T[_x.EquipmentShield] = null !== o.EquippedItems[kP.shield] ? [o.EquippedItems[kP.shield].Def.ID, o.EquippedItems[kP.shield].Amount] : null,
    T[_x.EquipmentBackPack] = null !== o.EquippedItems[kP.back] ? [o.EquippedItems[kP.back].Def.ID, o.EquippedItems[kP.back].Amount] : null,
    T[_x.EquipmentGloves] = null !== o.EquippedItems[kP.gloves] ? [o.EquippedItems[kP.gloves].Def.ID, o.EquippedItems[kP.gloves].Amount] : null,
    T[_x.EquipmentProjectile] = null !== o.EquippedItems[kP.projectile] ? [o.EquippedItems[kP.projectile].Def.ID, o.EquippedItems[kP.projectile].Amount] : null,
    T[_x.CurrentHour] = u,
    T[_x.HitpointsExp] = l.getSkill(EP.hitpoints).XP,
    T[_x.HitpointsCurrLvl] = l.getSkill(EP.hitpoints).CurrentLevel,
    T[_x.AccuracyExp] = l.getSkill(EP.accuracy).XP,
    T[_x.AccuracyCurrLvl] = l.getSkill(EP.accuracy).CurrentLevel,
    T[_x.StrengthExp] = l.getSkill(EP.strength).XP,
    T[_x.StrengthCurrLvl] = l.getSkill(EP.strength).CurrentLevel,
    T[_x.DefenseExp] = l.getSkill(EP.defense).XP,
    T[_x.DefenseCurrLvl] = l.getSkill(EP.defense).CurrentLevel,
    T[_x.MagicExp] = l.getSkill(EP.magic).XP,
    T[_x.MagicCurrLvl] = l.getSkill(EP.magic).CurrentLevel,
    T[_x.FishingExp] = h.getSkill(EP.fishing).XP,
    T[_x.FishingCurrLvl] = h.getSkill(EP.fishing).CurrentLevel,
    T[_x.CookingExp] = h.getSkill(EP.cooking).XP,
    T[_x.CookingCurrLvl] = h.getSkill(EP.cooking).CurrentLevel,
    T[_x.ForestryExp] = h.getSkill(EP.forestry).XP,
    T[_x.ForestryCurrLvl] = h.getSkill(EP.forestry).CurrentLevel,
    T[_x.MiningExp] = h.getSkill(EP.mining).XP,
    T[_x.MiningCurrLvl] = h.getSkill(EP.mining).CurrentLevel,
    T[_x.CraftingExp] = h.getSkill(EP.crafting).XP,
    T[_x.CraftingCurrLvl] = h.getSkill(EP.crafting).CurrentLevel,
    T[_x.CrimeExp] = h.getSkill(EP.crime).XP,
    T[_x.CrimeCurrLvl] = h.getSkill(EP.crime).CurrentLevel,
    T[_x.PotionmakingExp] = h.getSkill(EP.potionmaking).XP,
    T[_x.PotionmakingCurrLvl] = h.getSkill(EP.potionmaking).CurrentLevel,
    T[_x.SmithingExp] = h.getSkill(EP.smithing).XP,
    T[_x.SmithingCurrLvl] = h.getSkill(EP.smithing).CurrentLevel,
    T[_x.HarvestingExp] = h.getSkill(EP.harvesting).XP,
    T[_x.HarvestingCurrLvl] = h.getSkill(EP.harvesting).CurrentLevel,
    T[_x.EnchantingExp] = h.getSkill(EP.enchanting).XP,
    T[_x.EnchantingCurrLvl] = h.getSkill(EP.enchanting).CurrentLevel,
    T[_x.RangeExp] = l.getSkill(EP.range).XP,
    T[_x.RangeCurrLvl] = l.getSkill(EP.range).CurrentLevel,
    T[_x.AthleticsExp] = h.getSkill(EP.athletics).XP,
    T[_x.AthleticsCurrLvl] = h.getSkill(EP.athletics).CurrentLevel,
    T[_x.QuestCheckpoints] = d,
    T[_x.IsEmailConfirmed] = p ? 1 : 0,
    T[_x.LastLoginIP] = f,
    T[_x.LastLoginBrowser] = _,
    T[_x.LastLoginTimeMS] = m,
    T[_x.CurrentState] = g,
    T[_x.PlayerSessionID] = v,
    T[_x.ChatToken] = S,
    T[_x.MentalClarity] = C,
    T[_x.Abilities] = E,
    T[_x.Settings] = y,
    new AN(gameActions.LoggedIn,T)
}
createLogoutAction(e) {
    let t = new Array(vx);
    return t[gx.EntityID] = e,
    new AN(gameActions.Logout,t)
}
createLogoutFailedAction(e) {
    let t = new Array(Cx);
    return t[Sx.Reason] = e,
    new AN(gameActions.LogoutFailed,t)
}
createLoggedOutAction(e) {
    let t = new Array(yx);
    return t[Ex.EntityID] = e,
    new AN(gameActions.LoggedOut,t)
}
createStartedBankingAction(e, t) {
    let i = new Array(xx);
    return i[Tx.EntityID] = e,
    i[Tx.BankID] = t,
    new AN(gameActions.StartedBanking,i)
}
createStoppedBankingAction(e) {
    let t = new Array(Ix);
    return t[bx.EntityID] = e,
    new AN(gameActions.StoppedBanking,t)
}
createReceivedBankitemsAction(e) {
    let t = new Array(Px);
    return t[Ax.Items] = e.map((e => e ? [e.Def.ID, e.Amount] : null)),
    new AN(gameActions.ReceivedBankItems,t)
}
createTradeRequestedAction(e, t) {
    let i = new Array(Rx);
    return i[Mx.RequestingPlayerID] = e,
    i[Mx.OtherPlayerID] = t,
    new AN(gameActions.TradeRequested,i)
}
createPlayerAcceptedAction(e) {
    let t = new Array(Ox);
    return t[Dx.PlayerID] = e,
    new AN(gameActions.TradePlayerAccepted,t)
}
createTradeStatusResetAction() {
    return new AN(gameActions.TradeStatusReset,null)
}
createTradeGoToFinalStepAction() {
    return new AN(gameActions.TradeGoToFinalStep,null)
}
createTradeStartedAction(e, t) {
    let i = new Array(Fx);
    return i[Nx.Player1ID] = e,
    i[Nx.Player2ID] = t,
    new AN(gameActions.TradeStarted,i)
}
createTradeCancelledAction(e, t, i) {
    let n = new Array(kx);
    return n[Bx.Player1ID] = e,
    n[Bx.Player2ID] = t,
    n[Bx.Reason] = i,
    new AN(gameActions.TradeCancelled,n)
}
createTradeCompletedAction(e, t, i) {
    let n = new Array(Vx);
    return n[Ux.Player1ID] = e,
    n[Ux.Player2ID] = t,
    n[Ux.CurrentInventory] = i ? i.map((e => e ? e.toSocketArray() : null)) : new Array(28).fill(null),
    new AN(gameActions.TradeCompleted,n)
}
createUseItemOnEntityAction(e, t, i) {
    let n = new Array(zx);
    return n[Gx.ItemID] = e,
    n[Gx.EntityType] = t,
    n[Gx.EntityID] = i,
    new AN(gameActions.UseItemOnEntity,n)
}
createCreateItemAction(e, t, i) {
    let n = new Array(Hx);
    return n[Wx.ItemID] = e,
    n[Wx.Amount] = t,
    n[Wx.MenuType] = i,
    new AN(gameActions.CreateItem,n)
}
createCreatedItemAction(e, t, i) {
    let n = new Array(qx);
    return n[Xx.ItemID] = e,
    n[Xx.Amount] = t,
    n[Xx.RecipeInstancesToRemove] = i,
    new AN(gameActions.CreatedItem,n)
}
createStartedTargetingAction(e, t, i, n) {
    let r = new Array(jx);
    return r[Yx.EntityID] = e,
    r[Yx.EntityType] = t,
    r[Yx.TargetID] = i,
    r[Yx.TargetType] = n,
    new AN(gameActions.StartedTargeting,r)
}
createStoppedTargetingAction(e, t) {
    let i = new Array(Kx);
    return i[$x.EntityID] = e,
    i[$x.EntityType] = t,
    new AN(gameActions.StoppedTargeting,i)
}
createStartedSkillingAction(e, t, i, n=VM.Environment) {
    let r = new Array(Qx);
    return r[Zx.PlayerEntityID] = e,
    r[Zx.TargetID] = t,
    r[Zx.Skill] = i,
    r[Zx.TargetType] = n,
    new AN(gameActions.StartedSkilling,r)
}
createStoppedSkillingAction(e, t, i) {
    let n = new Array(eb);
    return n[Jx.PlayerEntityID] = e,
    n[Jx.Skill] = t,
    n[Jx.DidExhaustResources] = i ? 1 : 0,
    new AN(gameActions.StoppedSkilling,n)
}
createEquippedItemAction(e, t) {
    let i = new Array(ib);
    return i[tb.PlayerEntityID] = e,
    i[tb.ItemID] = t,
    new AN(gameActions.EquippedItem,i)
}
createUnequippedItemAction(e, t) {
    let i = new Array(rb);
    return i[nb.PlayerEntityID] = e,
    i[nb.ItemID] = t,
    new AN(gameActions.UnequippedItem,i)
}
createPlayerSkillLevelIncreasedAction(e, t, i, n) {
    let r = new Array(ab);
    return r[sb.PlayerEntityID] = e,
    r[sb.Skill] = t,
    r[sb.LevelsGained] = i,
    r[sb.NewLevel] = n,
    new AN(gameActions.PlayerSkillLevelIncreased,r)
}
createPlayerCombatLevelIncreasedAction(e, t) {
    let i = new Array(lb);
    return i[ob.PlayerEntityID] = e,
    i[ob.NewCombatLevel] = t,
    new AN(gameActions.PlayerCombatLevelIncreased,i)
}
createCookedItemAction(e) {
    let t = new Array(cb);
    return t[hb.ItemID] = e,
    new AN(gameActions.CookedItem,t)
}
createOvercookedItemAction(e) {
    let t = new Array(db);
    return t[ub.ItemID] = e,
    new AN(gameActions.OvercookedItem,t)
}
createPerformActionOnEntityAction(e, t, i) {
    let n = new Array(fb);
    return n[pb.TargetAction] = e,
    n[pb.EntityType] = t,
    n[pb.EntityID] = i,
    new AN(gameActions.PerformActionOnEntity,n)
}
createIncreasedCombatExpAction(e, t) {
    let i = new Array(mb);
    return i[_b.Style] = e,
    i[_b.DamageAmount] = t,
    new AN(gameActions.IncreaseCombatExp,i)
}
createTeleportToAction(e, t, i, n, r, s, a=-1) {
    let o = new Array(vb);
    return o[gb.EntityID] = e,
    o[gb.EntityType] = t,
    o[gb.X] = i,
    o[gb.Y] = n,
    o[gb.MapLevel] = r,
    o[gb.Type] = s,
    o[gb.SpellID] = a,
    new AN(gameActions.TeleportTo,o)
}
createPlayerDiedAction(e, t=-1) {
    let i = new Array(Cb);
    return i[Sb.VictimEntityID] = e,
    i[Sb.PKerEntityID] = t,
    new AN(gameActions.PlayerDied,i)
}
createStartedShoppingAction(e, t, i) {
    let n = new Array(yb);
    return n[Eb.ShopID] = e,
    n[Eb.EntityID] = t,
    n[Eb.CurrentStock] = i ? i.map((e => e ? [e.Def.ID, e.Amount] : null)) : null,
    new AN(gameActions.StartedShopping,n)
}
createStoppedShoppingAction(e, t) {
    let i = new Array(xb);
    return i[Tb.ShopID] = e,
    i[Tb.EntityID] = t,
    new AN(gameActions.StoppedShopping,i)
}
createUpdatedShopStockAction(e, t) {
    let i = new Array(Ib);
    return i[bb.ItemID] = e,
    i[bb.Amount] = t,
    new AN(gameActions.UpdatedShopStock,i)
}
createStartedChangingAppearanceAction(e, t) {
    let i = new Array(Pb);
    return i[Ab.EntityID] = e,
    i[Ab.IsFirstTime] = t ? 1 : 0,
    new AN(gameActions.StartedChangingAppearance,i)
}
createStoppedChangingAppearanceAction(e) {
    let t = new Array(Rb);
    return t[Mb.EntityID] = e,
    new AN(gameActions.StoppedChangingAppearance,t)
}
createChangeAppearanceAction(e, t, i, n, r) {
    let s = new Array(Ob);
    return s[Db.HairID] = e,
    s[Db.BeardID] = t,
    s[Db.ShirtID] = i,
    s[Db.BodyID] = n,
    s[Db.PantsID] = r,
    new AN(gameActions.ChangeAppearance,s)
}
createChangedAppearanceAction(e, t, i, n, r, s) {
    let a = new Array(wb);
    return a[Lb.EntityID] = e,
    a[Lb.HairID] = t,
    a[Lb.BeardID] = i,
    a[Lb.ShirtID] = n,
    a[Lb.BodyID] = r,
    a[Lb.PantsID] = s,
    new AN(gameActions.ChangedAppearance,a)
}
createMenuStateKeepAlivePingAction(e) {
    let t = new Array(Fb);
    return t[Nb.IsActive] = e ? 1 : 0,
    new AN(gameActions.MenuStateKeepAlivePing,t)
}
createEntityExhaustedResourcesAction(e) {
    let t = new Array(kb);
    return t[Bb.EntityTypeID] = e,
    new AN(gameActions.EntityExhaustedResources,t)
}
createEntityReplenishedResourcesAction(e) {
    let t = new Array(Vb);
    return t[Ub.EntityTypeID] = e,
    new AN(gameActions.EntityReplenishedResources,t)
}
createShookTreeAction(e, t, i) {
    let n = new Array(zb);
    return n[Gb.TreeShakerEntityID] = e,
    n[Gb.TreeShakerEntityType] = t,
    n[Gb.TreeID] = i,
    new AN(gameActions.ShookTree,n)
}
createGainedExpAction(e, t) {
    let i = new Array(Hb);
    return i[Wb.Skill] = e,
    i[Wb.Amount] = t,
    new AN(gameActions.GainedExp,i)
}
createShakeTreeResultMessageAction(e=0, t=!1) {
    let i = new Array(qb);
    return i[Xb.ItemID] = e,
    i[Xb.IsRare] = t ? 1 : 0,
    new AN(gameActions.ShakeTreeResult,i)
}
createOpenedSkillingMenuAction(e, t) {
    let i = new Array(jb);
    return i[Yb.TargetID] = e,
    i[Yb.MenuType] = t,
    new AN(gameActions.OpenedSkillingMenu,i)
}
createUseItemOnItemAction(e, t, i, n, r, s, a, o, l) {
    let h = new Array(Kb);
    return h[$b.MenuType] = e,
    h[$b.UsingItemSlot] = t,
    h[$b.UsingItemID] = i,
    h[$b.UsingItemIsIOU] = n ? 1 : 0,
    h[$b.TargetItemSlot] = r,
    h[$b.TargetItemID] = s,
    h[$b.TargetItemIsIOU] = a ? 1 : 0,
    h[$b.ItemOnItemActionResultIndex] = o,
    h[$b.AmountToCreate] = l,
    new AN(gameActions.UseItemOnItem,h)
}
createUsedItemOnItemAction(e, t, i, n, r, s, a, o, l, h) {
    let c = new Array(Kb);
    return c[Zb.MenuType] = e,
    c[Zb.UsingItemSlot] = t,
    c[Zb.UsingItemID] = i,
    c[Zb.UsingItemIsIOU] = n ? 1 : 0,
    c[Zb.TargetItemSlot] = r,
    c[Zb.TargetItemID] = s,
    c[Zb.TargetItemIsIOU] = a ? 1 : 0,
    c[Zb.ItemOnItemActionResultIndex] = o,
    c[Zb.AmountToCreate] = l,
    c[Zb.Success] = h ? 1 : 0,
    new AN(gameActions.UsedItemOnItem,c)
}
createWentThroughDoorAction(e, t) {
    let i = new Array(Jb);
    return i[Qb.DoorEntityTypeID] = e,
    i[Qb.EntityID] = t,
    new AN(gameActions.WentThroughDoor,i)
}
createCastTeleportSpellAction(e) {
    let t = new Array(tI);
    return t[eI.SpellID] = e,
    new AN(gameActions.CastTeleportSpell,t)
}
createCastedTeleportSpellAction(e, t, i) {
    let n = new Array(nI);
    return n[iI.EntityID] = e,
    n[iI.EntityType] = t,
    n[iI.SpellID] = i,
    new AN(gameActions.CastedTeleportSpell,n)
}
createCastInventorySpellAction(e, t, i, n, r) {
    let s = new Array(sI);
    return s[rI.SpellID] = e,
    s[rI.Menu] = t,
    s[rI.Slot] = i,
    s[rI.ItemID] = n,
    s[rI.IsIOU] = r ? 1 : 0,
    new AN(gameActions.CastInventorySpell,s)
}
createCastedInventorySpellAction(e, t, i, n) {
    let r = new Array(oI);
    return r[aI.EntityID] = e,
    r[aI.EntityType] = t,
    r[aI.SpellID] = i,
    r[aI.TargetItemID] = n,
    new AN(gameActions.CastedInventorySpell,r)
}
createCastSingleCombatOrStatusSpellAction(e, t, i) {
    let n = new Array(hI);
    return n[lI.SpellID] = e,
    n[lI.TargetID] = t,
    n[lI.TargetEntityType] = i,
    new AN(gameActions.CastSingleCombatOrStatusSpell,n)
}
createCastedSingleCombatOrStatusSpellAction(e, t, i, n, r, s, a) {
    let o = new Array(uI);
    return o[cI.SpellID] = e,
    o[cI.CasterID] = t,
    o[cI.CasterEntityType] = i,
    o[cI.TargetID] = n,
    o[cI.TargetEntityType] = r,
    o[cI.DamageAmount] = s,
    o[cI.IsConfused] = a ? 1 : 0,
    new AN(gameActions.CastedSingleCombatOrStatusSpell,o)
}
createToggleAutoCastAction(e) {
    let t = new Array(pI);
    return t[dI.SpellID] = e,
    new AN(gameActions.ToggleAutoCast,t)
}
createToggledAutoCastAction(e) {
    let t = new Array(_I);
    return t[fI.SpellID] = e,
    new AN(gameActions.ToggledAutoCast,t)
}
createSkillCurrentLevelChangedAction(e, t) {
    let i = new Array(gI);
    return i[mI.Skill] = e,
    i[mI.CurrentLevel] = t,
    new AN(gameActions.SkillCurrentLevelChanged,i)
}
createHitpointsCurrentLevelChangedAction(e, t, i) {
    let n = new Array(vI);
    return n[vI.EntityType] = e,
    n[vI.EntityID] = t,
    n[vI.CurrentHealth] = i,
    new AN(gameActions.HitpointsCurrentLevelChanged,n)
}
createShowSkillCurrentLevelIncreasedOrDecreasedMessageAction(e, t, i, n) {
    let r = new Array(CI);
    return r[SI.Skill] = e,
    r[SI.Level] = t,
    r[SI.PreviousCurrentLevel] = i,
    r[SI.CurrentLevel] = n,
    new AN(gameActions.ShowSkillCurrentLevelIncreasedOrDecreasedMessage,r)
}
createServerInfoMessageAction(e, t) {
    let i = new Array(yI);
    return i[EI.Message] = e,
    i[EI.Style] = t,
    new AN(gameActions.ServerInfoMessage,i)
}
createForcePublicMessageAction(e, t, i) {
    let n = new Array(xI);
    return n[TI.EntityID] = e,
    n[TI.EntityType] = t,
    n[TI.Message] = i,
    new AN(gameActions.ForcePublicMessage,n)
}
createQuestProgressedAction(e, t) {
    let i = new Array(II);
    return i[bI.QuestID] = e,
    i[bI.CurrentCheckpoint] = t,
    new AN(gameActions.QuestProgressed,i)
}
createCreatedUseItemOnItemActionItemsAction(e, t, i) {
    let n = new Array(PI);
    return n[AI.UseItemID] = e,
    n[AI.UsedItemOnID] = t,
    n[AI.UseItemOnItemIndex] = i,
    new AN(gameActions.CreatedUseItemOnItemActionItems,n)
}
createPathfindingFailedAction(e) {
    let t = new Array(RI);
    return t[MI.EntityID] = e,
    new AN(gameActions.PathfindingFailed,t)
}
createFiredProjectileAction(e, t, i, n, r, s, a) {
    let o = new Array(OI);
    return o[DI.ProjectileID] = e,
    o[DI.RangerID] = t,
    o[DI.RangerEntityType] = i,
    o[DI.TargetID] = n,
    o[DI.TargetEntityType] = r,
    o[DI.DamageAmount] = s,
    o[DI.IsConfused] = a ? 1 : 0,
    new AN(gameActions.FiredProjectile,o)
}
createServerShutdownCountdownAction(e) {
    let t = new Array(wI);
    return t[LI.MinutesUntilShutdown] = e,
    new AN(gameActions.ServerShutdownCountdown,t)
}
createCanLoginAction() {
    return new AN(gameActions.CanLogin,[])
}
createReconnectToServerAction(e, t) {
    let i = new Array(BI);
    return i[FI.Username] = e,
    i[FI.PlayerSessionID] = t,
    new AN(gameActions.ReconnectToServer,i)
}
createEntityStunnedAction(e, t, i) {
    let n = new Array(UI);
    return n[kI.EntityID] = e,
    n[kI.EntityType] = t,
    n[kI.StunTicks] = i,
    new AN(gameActions.EntityStunned,n)
}
createGlobalPublicMessageAction(e, t, i, n) {
    let r = new Array(GI);
    return r[VI.EntityID] = e,
    r[VI.Name] = t,
    r[VI.Message] = i,
    r[VI.PlayerType] = n,
    new AN(gameActions.GlobalPublicMessage,r)
}
createPlayerCountChangedAction(e) {
    let t = new Array(WI);
    return t[zI.CurrentPlayerCount] = e,
    new AN(gameActions.PlayerCountChanged,t)
}
createReceivedNPCConversationDialogue(e, t, i, n, r, s) {
    let a = new Array(XI);
    return a[HI.EntityID] = e,
    a[HI.NPCConversationID] = t,
    a[HI.ConversationDialogueID] = i,
    a[HI.IsInitialDialogue] = n ? 1 : 0,
    a[HI.NPCText] = r,
    a[HI.PlayerConversationOptions] = s,
    new AN(gameActions.ReceivedNPCConversationDialogue,a)
}
createSelectNPCConversationOption(e) {
    let t = new Array(YI);
    return t[qI.PlayerConversationOptionID] = e,
    new AN(gameActions.SelectNPCConversationOption,t)
}
createEndedNPCConversationAction(e) {
    let t = new Array($I);
    return t[jI.EntityID] = e,
    new AN(gameActions.EndedNPCConversation,t)
}
createInvokeInventoryItemActionAction(e, t, i, n, r, s) {
    let a = new Array(ZI);
    return a[KI.Action] = e,
    a[KI.MenuType] = t,
    a[KI.Slot] = i,
    a[KI.ItemID] = n,
    a[KI.Amount] = r,
    a[KI.IsIOU] = s ? 1 : 0,
    new AN(gameActions.InvokeInventoryItemAction,a)
}
createInvokedInventoryItemActionAction(e, t, i, n, r, s, a, o) {
    let l = new Array(ZI);
    return l[QI.Action] = e,
    l[QI.MenuType] = t,
    l[QI.Slot] = i,
    l[QI.ItemID] = n,
    l[QI.Amount] = r,
    l[QI.IsIOU] = s ? 1 : 0,
    l[QI.Success] = a ? 1 : 0,
    l[QI.Data] = null === o || 0 === o.length ? 0 : o,
    new AN(gameActions.InvokedInventoryItemAction,l)
}
createUsedItemOnEntityAction(e, t, i, n, r, s) {
    let a = new Array(eA);
    return a[JI.EntityID] = e,
    a[JI.EntityType] = t,
    a[JI.TargetEntityID] = i,
    a[JI.TargetEntityType] = n,
    a[JI.ItemID] = r,
    a[JI.Success] = s ? 1 : 0,
    new AN(gameActions.UsedItemOnEntity,a)
}
createInsertAtBankStorageSlotAction(e, t) {
    let i = new Array(iA);
    return i[tA.Slot1] = e,
    i[tA.Slot2] = t,
    new AN(gameActions.InsertAtBankStorageSlot,i)
}
createInsertedAtBankStorageSlotAction(e) {
    let t = new Array(rA);
    return t[nA.Result] = 0 !== e ? 1 : 0,
    new AN(gameActions.InsertedAtBankStorageSlot,t)
}
createRemovedItemAtInventorySlotAction(e, t, i, n, r, s) {
    let a = new Array(aA);
    return a[sA.MenuType] = e,
    a[sA.Slot] = t,
    a[sA.ItemID] = i,
    a[sA.Amount] = n,
    a[sA.IsIOU] = r ? 1 : 0,
    a[sA.RemainingAmountAtSlot] = s,
    new AN(gameActions.RemovedItemFromInventoryAtSlot,a)
}
createAddedItemAtInventorySlotAction(e, t, i, n, r, s) {
    let a = new Array(lA);
    return a[oA.MenuType] = e,
    a[oA.Slot] = t,
    a[oA.ItemID] = i,
    a[oA.Amount] = n,
    a[oA.IsIOU] = r ? 1 : 0,
    a[oA.PreviousAmountAtSlot] = s,
    new AN(gameActions.AddedItemAtInventorySlot,a)
}
createShowLootMenuAction(e, t) {
    let i = new Array(cA);
    return i[hA.Items] = e ? e.map((e => e ? e.toSocketArray() : null)) : null,
    i[hA.Type] = null === t ? DN.Default : t,
    new AN(gameActions.ShowLootMenu,i)
}
createReorganizeInventorySlotsAction(e, t, i, n, r, s, a, o) {
    let l = new Array(dA);
    return l[uA.Menu] = e,
    l[uA.Slot1] = t,
    l[uA.ItemID1] = i,
    l[uA.IsIOU1] = n ? 1 : 0,
    l[uA.Slot2] = r,
    l[uA.ItemID2] = s,
    l[uA.IsIOU2] = a ? 1 : 0,
    l[uA.Type] = o,
    new AN(gameActions.ReorganizeInventorySlots,l)
}
createReorganizedInventorySlotsAction(e, t, i, n, r, s, a, o, l) {
    let h = new Array(fA);
    return h[pA.Menu] = e,
    h[pA.Slot1] = t,
    h[pA.ItemID1] = i,
    h[pA.IsIOU1] = n ? 1 : 0,
    h[pA.Slot2] = r,
    h[pA.ItemID2] = s,
    h[pA.IsIOU2] = a ? 1 : 0,
    h[pA.Type] = o,
    h[pA.Success] = l ? 1 : 0,
    new AN(gameActions.ReorganizedInventorySlots,h)
}
createSwitchToIdleStateAction() {
    let e = new Array(mA);
    return e[_A.Switch] = 1,
    new AN(gameActions.SwitchToIdleState,e)
}
createUpdateTradeStatusAction(e) {
    let t = new Array(vA);
    return t[gA.Status] = e,
    new AN(gameActions.UpdateTradeStatus,t)
}
createStartedDiggingAction(e) {
    let t = new Array(CA);
    return t[SA.EntityID] = e,
    new AN(gameActions.StartedDigging,t)
}
createStoppedDiggingAction(e) {
    let t = new Array(yA);
    return t[EA.EntityID] = e,
    new AN(gameActions.StoppedDigging,t)
}
createPlayerInfoAction(e) {
    let t = new Array(xA);
    return t[TA.Info] = e,
    new AN(gameActions.PlayerInfo,t)
}
createCaptchaActionAction(e, t) {
    let i = new Array(IA);
    return i[bA.CaptchaActionType] = e,
    i[bA.CaptchaGuessText] = t,
    new AN(gameActions.CaptchaAction,i)
}
createOpenedCaptchaScreenAction(e) {
    let t = new Array(PA);
    return t[AA.EntityID] = e,
    new AN(gameActions.OpenedCaptchaScreen,t)
}
createReceivedCaptchaAction(e, t, i) {
    let n = new Array(RA);
    return n[MA.ImageDataURL] = e,
    n[MA.Width] = t,
    n[MA.Height] = i,
    new AN(gameActions.ReceivedCaptcha,n)
}
createCaptchaActionResultAction(e) {
    let t = new Array(OA);
    return t[DA.CaptchaActionType] = e,
    new AN(gameActions.CaptchaActionResult,t)
}
createMentalClarityChangedAction(e, t, i) {
    let n = new Array(wA);
    return n[LA.EntityID] = e,
    n[LA.OldMentalClarity] = t,
    n[LA.NewMentalClarity] = i,
    new AN(gameActions.MentalClarityChanged,n)
}
createMutedPlayerAction(e, t) {
    let i = new Array(FA);
    return i[NA.Name] = e.toLowerCase(),
    i[NA.IsMuted] = t,
    new AN(gameActions.MutedPlayer,i)
}
createChangePlayerSettingAction(e, t) {
    let i = new Array(kA);
    return i[BA.Setting] = e,
    i[BA.Value] = t,
    new AN(gameActions.ChangePlayerSetting,i)
}
createPlayerSettingChangedAction(e, t) {
    let i = new Array(VA);
    return i[UA.Setting] = e,
    i[UA.Value] = t,
    new AN(gameActions.PlayerSettingChanged,i)
}
createPlayerAbilityChangedAction(e, t) {
    let i = new Array(zA);
    return i[GA.Ability] = e,
    i[GA.Value] = t,
    new AN(gameActions.PlayerAbilityChanged,i)
}
createPlayerWeightChangedAction(e, t) {
    let i = new Array(HA);
    return i[WA.EquippedItemsWeight] = Math.round(e),
    i[WA.InventoryItemsWeight] = Math.round(t),
    new AN(gameActions.PlayerWeightChanged,i)
}
createEntityPerformedPhysicalActionAction(e, t, i, n, r, s) {
    let a = new Array(qA);
    return a[XA.EntityID] = e,
    a[XA.EntityType] = t,
    a[XA.Action] = i,
    a[XA.ActionTickLength] = n,
    a[XA.ActionValue] = r,
    a[XA.DelayTicks] = s,
    new AN(gameActions.EntityPerformedPhysicalAction,a)
}
createEntitySleepingAction(e, t, i, n, r, s, a) {
    let o = new Array(jA);
    return o[YA.WorldEntityID] = e,
    o[YA.EntityID] = t,
    o[YA.EntityType] = i,
    o[YA.FeetX] = n,
    o[YA.FeetY] = r,
    o[YA.HeadX] = s,
    o[YA.HeadY] = a,
    new AN(gameActions.EntitySleeping,o)
}
createEntityWokeUpAction(e, t) {
    let i = new Array(KA);
    return i[$A.EntityID] = e,
    i[$A.EntityType] = t,
    new AN(gameActions.EntityWokeUp,i)
}
}