import { assertIsArray, type PacketArray } from "../../codec/arrayCodec";
import { LoggedInFields } from "../../fields/actions/LoggedInFields";

/** Auto-generated from `apps/game/gameActionFactory.js` (LoggedIn) */
export type LoggedInPayload = {
  EntityID: unknown;
  EntityTypeID: unknown;
  PlayerType: unknown;
  Username: unknown;
  MapLevel: unknown;
  X: unknown;
  Y: unknown;
  Inventory: unknown;
  HairStyleID: unknown;
  BeardStyleID: unknown;
  ShirtID: unknown;
  BodyTypeID: unknown;
  LegsID: unknown;
  EquipmentHead: unknown;
  helmet?: unknown;
  EquipmentBody: unknown;
  chest?: unknown;
  EquipmentLegs: unknown;
  legs?: unknown;
  EquipmentBoots: unknown;
  boots?: unknown;
  EquipmentNecklace: unknown;
  neck?: unknown;
  EquipmentWeapon: unknown;
  weapon?: unknown;
  EquipmentShield: unknown;
  shield?: unknown;
  EquipmentBackPack: unknown;
  back?: unknown;
  EquipmentGloves: unknown;
  gloves?: unknown;
  EquipmentProjectile: unknown;
  projectile?: unknown;
  CurrentHour: unknown;
  HitpointsExp: unknown;
  HitpointsCurrLvl: unknown;
  AccuracyExp: unknown;
  AccuracyCurrLvl: unknown;
  StrengthExp: unknown;
  StrengthCurrLvl: unknown;
  DefenseExp: unknown;
  DefenseCurrLvl: unknown;
  MagicExp: unknown;
  MagicCurrLvl: unknown;
  FishingExp: unknown;
  FishingCurrLvl: unknown;
  CookingExp: unknown;
  CookingCurrLvl: unknown;
  ForestryExp: unknown;
  ForestryCurrLvl: unknown;
  MiningExp: unknown;
  MiningCurrLvl: unknown;
  CraftingExp: unknown;
  CraftingCurrLvl: unknown;
  CrimeExp: unknown;
  CrimeCurrLvl: unknown;
  PotionmakingExp: unknown;
  PotionmakingCurrLvl: unknown;
  SmithingExp: unknown;
  SmithingCurrLvl: unknown;
  HarvestingExp: unknown;
  HarvestingCurrLvl: unknown;
  EnchantingExp: unknown;
  EnchantingCurrLvl: unknown;
  RangeExp: unknown;
  RangeCurrLvl: unknown;
  AthleticsExp: unknown;
  AthleticsCurrLvl: unknown;
  QuestCheckpoints: unknown;
  IsEmailConfirmed: boolean;
  LastLoginIP: unknown;
  LastLoginBrowser: unknown;
  LastLoginTimeMS: unknown;
  CurrentState: unknown;
  PlayerSessionID: unknown;
  ChatToken: unknown;
  MentalClarity: unknown;
  Abilities: unknown;
  Settings: unknown;
};

export function decodeLoggedInPayload(payload: unknown): LoggedInPayload {
  assertIsArray(payload, "LoggedIn payload");
  const arr = payload as PacketArray;
  return {
    EntityID: arr[LoggedInFields.EntityID] as any,
    EntityTypeID: arr[LoggedInFields.EntityTypeID] as any,
    PlayerType: arr[LoggedInFields.PlayerType] as any,
    Username: arr[LoggedInFields.Username] as any,
    MapLevel: arr[LoggedInFields.MapLevel] as any,
    X: arr[LoggedInFields.X] as any,
    Y: arr[LoggedInFields.Y] as any,
    Inventory: arr[LoggedInFields.Inventory] as any,
    HairStyleID: arr[LoggedInFields.HairStyleID] as any,
    BeardStyleID: arr[LoggedInFields.BeardStyleID] as any,
    ShirtID: arr[LoggedInFields.ShirtID] as any,
    BodyTypeID: arr[LoggedInFields.BodyTypeID] as any,
    LegsID: arr[LoggedInFields.LegsID] as any,
    EquipmentHead: arr[LoggedInFields.EquipmentHead] as any,
    helmet: arr[LoggedInFields.helmet] as any,
    EquipmentBody: arr[LoggedInFields.EquipmentBody] as any,
    chest: arr[LoggedInFields.chest] as any,
    EquipmentLegs: arr[LoggedInFields.EquipmentLegs] as any,
    legs: arr[LoggedInFields.legs] as any,
    EquipmentBoots: arr[LoggedInFields.EquipmentBoots] as any,
    boots: arr[LoggedInFields.boots] as any,
    EquipmentNecklace: arr[LoggedInFields.EquipmentNecklace] as any,
    neck: arr[LoggedInFields.neck] as any,
    EquipmentWeapon: arr[LoggedInFields.EquipmentWeapon] as any,
    weapon: arr[LoggedInFields.weapon] as any,
    EquipmentShield: arr[LoggedInFields.EquipmentShield] as any,
    shield: arr[LoggedInFields.shield] as any,
    EquipmentBackPack: arr[LoggedInFields.EquipmentBackPack] as any,
    back: arr[LoggedInFields.back] as any,
    EquipmentGloves: arr[LoggedInFields.EquipmentGloves] as any,
    gloves: arr[LoggedInFields.gloves] as any,
    EquipmentProjectile: arr[LoggedInFields.EquipmentProjectile] as any,
    projectile: arr[LoggedInFields.projectile] as any,
    CurrentHour: arr[LoggedInFields.CurrentHour] as any,
    HitpointsExp: arr[LoggedInFields.HitpointsExp] as any,
    HitpointsCurrLvl: arr[LoggedInFields.HitpointsCurrLvl] as any,
    AccuracyExp: arr[LoggedInFields.AccuracyExp] as any,
    AccuracyCurrLvl: arr[LoggedInFields.AccuracyCurrLvl] as any,
    StrengthExp: arr[LoggedInFields.StrengthExp] as any,
    StrengthCurrLvl: arr[LoggedInFields.StrengthCurrLvl] as any,
    DefenseExp: arr[LoggedInFields.DefenseExp] as any,
    DefenseCurrLvl: arr[LoggedInFields.DefenseCurrLvl] as any,
    MagicExp: arr[LoggedInFields.MagicExp] as any,
    MagicCurrLvl: arr[LoggedInFields.MagicCurrLvl] as any,
    FishingExp: arr[LoggedInFields.FishingExp] as any,
    FishingCurrLvl: arr[LoggedInFields.FishingCurrLvl] as any,
    CookingExp: arr[LoggedInFields.CookingExp] as any,
    CookingCurrLvl: arr[LoggedInFields.CookingCurrLvl] as any,
    ForestryExp: arr[LoggedInFields.ForestryExp] as any,
    ForestryCurrLvl: arr[LoggedInFields.ForestryCurrLvl] as any,
    MiningExp: arr[LoggedInFields.MiningExp] as any,
    MiningCurrLvl: arr[LoggedInFields.MiningCurrLvl] as any,
    CraftingExp: arr[LoggedInFields.CraftingExp] as any,
    CraftingCurrLvl: arr[LoggedInFields.CraftingCurrLvl] as any,
    CrimeExp: arr[LoggedInFields.CrimeExp] as any,
    CrimeCurrLvl: arr[LoggedInFields.CrimeCurrLvl] as any,
    PotionmakingExp: arr[LoggedInFields.PotionmakingExp] as any,
    PotionmakingCurrLvl: arr[LoggedInFields.PotionmakingCurrLvl] as any,
    SmithingExp: arr[LoggedInFields.SmithingExp] as any,
    SmithingCurrLvl: arr[LoggedInFields.SmithingCurrLvl] as any,
    HarvestingExp: arr[LoggedInFields.HarvestingExp] as any,
    HarvestingCurrLvl: arr[LoggedInFields.HarvestingCurrLvl] as any,
    EnchantingExp: arr[LoggedInFields.EnchantingExp] as any,
    EnchantingCurrLvl: arr[LoggedInFields.EnchantingCurrLvl] as any,
    RangeExp: arr[LoggedInFields.RangeExp] as any,
    RangeCurrLvl: arr[LoggedInFields.RangeCurrLvl] as any,
    AthleticsExp: arr[LoggedInFields.AthleticsExp] as any,
    AthleticsCurrLvl: arr[LoggedInFields.AthleticsCurrLvl] as any,
    QuestCheckpoints: arr[LoggedInFields.QuestCheckpoints] as any,
    IsEmailConfirmed: arr[LoggedInFields.IsEmailConfirmed] as any,
    LastLoginIP: arr[LoggedInFields.LastLoginIP] as any,
    LastLoginBrowser: arr[LoggedInFields.LastLoginBrowser] as any,
    LastLoginTimeMS: arr[LoggedInFields.LastLoginTimeMS] as any,
    CurrentState: arr[LoggedInFields.CurrentState] as any,
    PlayerSessionID: arr[LoggedInFields.PlayerSessionID] as any,
    ChatToken: arr[LoggedInFields.ChatToken] as any,
    MentalClarity: arr[LoggedInFields.MentalClarity] as any,
    Abilities: arr[LoggedInFields.Abilities] as any,
    Settings: arr[LoggedInFields.Settings] as any,
  };
}

export function buildLoggedInPayload(data: LoggedInPayload): unknown[] {
  const arr: unknown[] = new Array(79);
  arr[LoggedInFields.EntityID] = data.EntityID;
  arr[LoggedInFields.EntityTypeID] = data.EntityTypeID;
  arr[LoggedInFields.PlayerType] = data.PlayerType;
  arr[LoggedInFields.Username] = data.Username;
  arr[LoggedInFields.MapLevel] = data.MapLevel;
  arr[LoggedInFields.X] = data.X;
  arr[LoggedInFields.Y] = data.Y;
  arr[LoggedInFields.Inventory] = data.Inventory;
  arr[LoggedInFields.HairStyleID] = data.HairStyleID;
  arr[LoggedInFields.BeardStyleID] = data.BeardStyleID;
  arr[LoggedInFields.ShirtID] = data.ShirtID;
  arr[LoggedInFields.BodyTypeID] = data.BodyTypeID;
  arr[LoggedInFields.LegsID] = data.LegsID;
  arr[LoggedInFields.EquipmentHead] = data.EquipmentHead;
  arr[LoggedInFields.helmet] = data.helmet;
  arr[LoggedInFields.EquipmentBody] = data.EquipmentBody;
  arr[LoggedInFields.chest] = data.chest;
  arr[LoggedInFields.EquipmentLegs] = data.EquipmentLegs;
  arr[LoggedInFields.legs] = data.legs;
  arr[LoggedInFields.EquipmentBoots] = data.EquipmentBoots;
  arr[LoggedInFields.boots] = data.boots;
  arr[LoggedInFields.EquipmentNecklace] = data.EquipmentNecklace;
  arr[LoggedInFields.neck] = data.neck;
  arr[LoggedInFields.EquipmentWeapon] = data.EquipmentWeapon;
  arr[LoggedInFields.weapon] = data.weapon;
  arr[LoggedInFields.EquipmentShield] = data.EquipmentShield;
  arr[LoggedInFields.shield] = data.shield;
  arr[LoggedInFields.EquipmentBackPack] = data.EquipmentBackPack;
  arr[LoggedInFields.back] = data.back;
  arr[LoggedInFields.EquipmentGloves] = data.EquipmentGloves;
  arr[LoggedInFields.gloves] = data.gloves;
  arr[LoggedInFields.EquipmentProjectile] = data.EquipmentProjectile;
  arr[LoggedInFields.projectile] = data.projectile;
  arr[LoggedInFields.CurrentHour] = data.CurrentHour;
  arr[LoggedInFields.HitpointsExp] = data.HitpointsExp;
  arr[LoggedInFields.HitpointsCurrLvl] = data.HitpointsCurrLvl;
  arr[LoggedInFields.AccuracyExp] = data.AccuracyExp;
  arr[LoggedInFields.AccuracyCurrLvl] = data.AccuracyCurrLvl;
  arr[LoggedInFields.StrengthExp] = data.StrengthExp;
  arr[LoggedInFields.StrengthCurrLvl] = data.StrengthCurrLvl;
  arr[LoggedInFields.DefenseExp] = data.DefenseExp;
  arr[LoggedInFields.DefenseCurrLvl] = data.DefenseCurrLvl;
  arr[LoggedInFields.MagicExp] = data.MagicExp;
  arr[LoggedInFields.MagicCurrLvl] = data.MagicCurrLvl;
  arr[LoggedInFields.FishingExp] = data.FishingExp;
  arr[LoggedInFields.FishingCurrLvl] = data.FishingCurrLvl;
  arr[LoggedInFields.CookingExp] = data.CookingExp;
  arr[LoggedInFields.CookingCurrLvl] = data.CookingCurrLvl;
  arr[LoggedInFields.ForestryExp] = data.ForestryExp;
  arr[LoggedInFields.ForestryCurrLvl] = data.ForestryCurrLvl;
  arr[LoggedInFields.MiningExp] = data.MiningExp;
  arr[LoggedInFields.MiningCurrLvl] = data.MiningCurrLvl;
  arr[LoggedInFields.CraftingExp] = data.CraftingExp;
  arr[LoggedInFields.CraftingCurrLvl] = data.CraftingCurrLvl;
  arr[LoggedInFields.CrimeExp] = data.CrimeExp;
  arr[LoggedInFields.CrimeCurrLvl] = data.CrimeCurrLvl;
  arr[LoggedInFields.PotionmakingExp] = data.PotionmakingExp;
  arr[LoggedInFields.PotionmakingCurrLvl] = data.PotionmakingCurrLvl;
  arr[LoggedInFields.SmithingExp] = data.SmithingExp;
  arr[LoggedInFields.SmithingCurrLvl] = data.SmithingCurrLvl;
  arr[LoggedInFields.HarvestingExp] = data.HarvestingExp;
  arr[LoggedInFields.HarvestingCurrLvl] = data.HarvestingCurrLvl;
  arr[LoggedInFields.EnchantingExp] = data.EnchantingExp;
  arr[LoggedInFields.EnchantingCurrLvl] = data.EnchantingCurrLvl;
  arr[LoggedInFields.RangeExp] = data.RangeExp;
  arr[LoggedInFields.RangeCurrLvl] = data.RangeCurrLvl;
  arr[LoggedInFields.AthleticsExp] = data.AthleticsExp;
  arr[LoggedInFields.AthleticsCurrLvl] = data.AthleticsCurrLvl;
  arr[LoggedInFields.QuestCheckpoints] = data.QuestCheckpoints;
  arr[LoggedInFields.IsEmailConfirmed] = data.IsEmailConfirmed ? 1 : 0;
  arr[LoggedInFields.LastLoginIP] = data.LastLoginIP;
  arr[LoggedInFields.LastLoginBrowser] = data.LastLoginBrowser;
  arr[LoggedInFields.LastLoginTimeMS] = data.LastLoginTimeMS;
  arr[LoggedInFields.CurrentState] = data.CurrentState;
  arr[LoggedInFields.PlayerSessionID] = data.PlayerSessionID;
  arr[LoggedInFields.ChatToken] = data.ChatToken;
  arr[LoggedInFields.MentalClarity] = data.MentalClarity;
  arr[LoggedInFields.Abilities] = data.Abilities;
  arr[LoggedInFields.Settings] = data.Settings;
  return arr;
}
