import jwt from "jsonwebtoken";
import { getPrisma } from "../../db";
import { buildLoggedInPayload } from "../../protocol/packets/actions/LoggedIn";
import { type PlayerState, type SkillSlug, type EquipmentSlot, serializePlayerAbilities, serializePlayerSettings } from "../../world/PlayerState";
import type { EquipmentStack } from "../../world/items/EquipmentStack";
import type { InGameClock } from "../../world/InGameClock";

export interface LoginResult {
  userId: number;
  username: string;
  emailVerified: boolean;
  serverId: number;
  persistenceId: number;
  lastLogin: {
    ip: string | null;
    browser: string | null;
    timeMs: number | null;
  };
}

export interface LoginServiceDependencies {
  dbEnabled: boolean;
  clock: InGameClock;
  playerStatesByUserId: Map<number, PlayerState>;
}

/**
 * Service for handling login verification and login packet composition.
 * Manages JWT token verification and database queries for authentication.
 */
export class LoginService {
  constructor(private readonly deps: LoginServiceDependencies) {}
  private readonly persistenceIdCache = new Map<number, number>();

  /**
   * Verifies a login token and returns user information.
   * In dev mode (no database), generates a pseudo-ID from username.
   * 
   * @param username The username attempting to log in
   * @param token The login token to verify
   * @returns User information including userId, username, and emailVerified status
   * @throws Error if token is invalid, already used, or expired
   */
  async verifyLogin(token: string): Promise<LoginResult> {
    const prisma = getPrisma();
    const row = await prisma.gameLoginToken.findUnique({
      where: { token },
      include: { user: true }
    });
    
    if (!row) throw new Error("Invalid login token");
    if (row.usedAt) throw new Error("Login token already used");
    if (row.expiresAt.getTime() <= Date.now()) throw new Error("Login token expired");

    const nowMs = Date.now();
    
    // Get the user's previous login time (before we update it)
    const previousLoginTimeMs = row.user.lastLoginAt ? row.user.lastLoginAt.getTime() : null;
    
    // Calculate time offset: milliseconds since last login
    // If this is first login (null), send 0 as offset
    const timeSinceLastLoginMs = previousLoginTimeMs ? (nowMs - previousLoginTimeMs) : 0;

    // Mark token as used and update user's last login time
    await Promise.all([
      prisma.gameLoginToken.update({ where: { token }, data: { usedAt: new Date() } }),
      prisma.user.update({ 
        where: { id: row.userId }, 
        data: { lastLoginAt: new Date(nowMs) } 
      })
    ]);

    const persistenceId = await this.resolvePersistenceId(row.serverId);

    return {
      userId: row.userId,
      username: row.user.username.toLowerCase(),
      emailVerified: !!row.user.emailVerified,
      serverId: row.serverId,
      persistenceId,
      lastLogin: {
        ip: row.ip ?? null,
        browser: row.userAgent ?? null,
        timeMs: timeSinceLastLoginMs
      }
    };
  }

  async resolvePersistenceId(serverId: number): Promise<number> {
    const cached = this.persistenceIdCache.get(serverId);
    if (cached) return cached;

    const prisma = getPrisma();
    const world = await prisma.world.findUnique({
      where: { serverId },
      select: { persistenceId: true }
    });

    const persistenceId = world?.persistenceId;
    if (typeof persistenceId !== "number" || !Number.isInteger(persistenceId) || persistenceId <= 0) {
      throw new Error(`World persistenceId not found for serverId ${serverId}`);
    }

    this.persistenceIdCache.set(serverId, persistenceId);
    return persistenceId;
  }

  /**
   * Composes the LoggedIn packet payload with player state, skills, and equipment.
   * 
   * @param params Login parameters including accountId, name, emailVerified, and lastLogin info
   * @returns The LoggedIn packet payload
   */
  async composeLoggedInPacket(params: {
    accountId: number;
    name: string;
    displayName?: string;
    emailVerified: boolean;
    lastLogin: { ip: string | null; browser: string | null; timeMs: number | null };
  }): Promise<unknown[]> {
    const secret = process.env.JWT_SECRET || "dev-secret-change-me";
    const nowMs = Date.now();
    const token = jwt.sign(
      { id: params.accountId, name: params.name, time: nowMs, isMuted: false, type: 0 },
      secret,
      { algorithm: "HS256", expiresIn: "7d" }
    );

    const playerState = this.deps.playerStatesByUserId.get(params.accountId);
    if (!playerState) {
      throw new Error("Player state not found");
    }

    // Send boosted level (current effective level) to client, not actual level
    const getLvl = (slug: SkillSlug) => playerState.skills[slug]?.boostedLevel ?? 1;
    const getXp = (slug: SkillSlug) => playerState.skills[slug]?.xp ?? 0;
    const getEquip = (slot: EquipmentSlot): EquipmentStack | null => {
      const v = playerState.equipment[slot];
      return v === undefined ? null : v;
    };

    return buildLoggedInPayload({
      EntityID: params.accountId,
      EntityTypeID: params.accountId,
      PlayerType: playerState.playerType,
      Username: params.displayName ?? params.name,
      MapLevel: playerState.mapLevel,
      X: playerState.x,
      Y: playerState.y,
      Inventory: playerState.inventory,

      HairStyleID: playerState.appearance.hairStyleId,
      BeardStyleID: playerState.appearance.beardStyleId,
      ShirtID: playerState.appearance.shirtId,
      BodyTypeID: playerState.appearance.bodyTypeId,
      LegsID: playerState.appearance.legsId,

      EquipmentHead: getEquip("helmet"),
      EquipmentBody: getEquip("chest"),
      EquipmentLegs: getEquip("legs"),
      EquipmentBoots: getEquip("boots"),
      EquipmentNecklace: getEquip("neck"),
      EquipmentWeapon: getEquip("weapon"),
      EquipmentShield: getEquip("shield"),
      EquipmentBackPack: getEquip("back"),
      EquipmentGloves: getEquip("gloves"),
      EquipmentProjectile: getEquip("projectile"),

      CurrentHour: this.deps.clock.getCurrentHour(),

      HitpointsExp: getXp("hitpoints"),
      HitpointsCurrLvl: getLvl("hitpoints"),
      AccuracyExp: getXp("accuracy"),
      AccuracyCurrLvl: getLvl("accuracy"),
      StrengthExp: getXp("strength"),
      StrengthCurrLvl: getLvl("strength"),
      DefenseExp: getXp("defense"),
      DefenseCurrLvl: getLvl("defense"),
      MagicExp: getXp("magic"),
      MagicCurrLvl: getLvl("magic"),
      FishingExp: getXp("fishing"),
      FishingCurrLvl: getLvl("fishing"),
      CookingExp: getXp("cooking"),
      CookingCurrLvl: getLvl("cooking"),
      ForestryExp: getXp("forestry"),
      ForestryCurrLvl: getLvl("forestry"),
      MiningExp: getXp("mining"),
      MiningCurrLvl: getLvl("mining"),
      CraftingExp: getXp("crafting"),
      CraftingCurrLvl: getLvl("crafting"),
      CrimeExp: getXp("crime"),
      CrimeCurrLvl: getLvl("crime"),
      PotionmakingExp: getXp("potionmaking"),
      PotionmakingCurrLvl: getLvl("potionmaking"),
      SmithingExp: getXp("smithing"),
      SmithingCurrLvl: getLvl("smithing"),
      HarvestingExp: getXp("harvesting"),
      HarvestingCurrLvl: getLvl("harvesting"),
      EnchantingExp: getXp("enchanting"),
      EnchantingCurrLvl: getLvl("enchanting"),
      RangeExp: getXp("range"),
      RangeCurrLvl: getLvl("range"),
      AthleticsExp: getXp("athletics"),
      AthleticsCurrLvl: getLvl("athletics"),

      QuestCheckpoints: [0, 0, 0, 0],
      IsEmailConfirmed: params.emailVerified,
      LastLoginIP: params.lastLogin.ip ?? "",
      LastLoginBrowser: params.lastLogin.browser ?? "",
      LastLoginTimeMS: params.lastLogin.timeMs ?? 0,
      CurrentState: playerState.currentState,
      PlayerSessionID: params.accountId,
      ChatToken: token,
      MentalClarity: 0,
      Abilities: serializePlayerAbilities(playerState.abilities),
      Settings: serializePlayerSettings(playerState.settings)
    });
  }
}
