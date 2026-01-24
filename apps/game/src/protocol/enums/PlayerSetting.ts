// PlayerSetting enum - kept as const enum for inlining
const enum PlayerSetting {
    IsSprinting = 0,
    AutoRetaliate = 1,
    CombatStyle = 2,
    PublicChat = 3,
    GlobalChat = 4,
}

export { PlayerSetting };

// Runtime set of valid PlayerSetting values for validation
export const VALID_PLAYER_SETTINGS = new Set<number>([
    PlayerSetting.IsSprinting,
    PlayerSetting.AutoRetaliate,
    PlayerSetting.CombatStyle,
    PlayerSetting.PublicChat,
    PlayerSetting.GlobalChat,
]);

export function isValidPlayerSetting(value: unknown): value is PlayerSetting {
    return typeof value === "number" && Number.isInteger(value) && VALID_PLAYER_SETTINGS.has(value);
}

// Value enums with runtime validation sets

const enum IsSprintingValues {
    Off = 0,
    On = 1,
}

export { IsSprintingValues };

const VALID_IS_SPRINTING = new Set<number>([IsSprintingValues.Off, IsSprintingValues.On]);

const enum AutoRetaliateValues {
    Off = 0,
    On = 1,
}

export { AutoRetaliateValues };

const VALID_AUTO_RETALIATE = new Set<number>([AutoRetaliateValues.Off, AutoRetaliateValues.On]);

const enum CombatStyleValues {
    Accurate = 1,
    Strength = 2,
    Defense = 4,
}

export { CombatStyleValues };

// CombatStyle is a bitmask - valid values are any combination of the flags (1-7)
// 1=Accurate, 2=Strength, 3=Accurate+Strength, 4=Defense, 5=Accurate+Defense, 6=Strength+Defense, 7=All
const VALID_COMBAT_STYLE = new Set<number>([1, 2, 3, 4, 5, 6, 7]);
export { VALID_COMBAT_STYLE };

const enum PublicChatValues {
    Off = 0,
    On = 1,
}

export { PublicChatValues };

const VALID_PUBLIC_CHAT = new Set<number>([PublicChatValues.Off, PublicChatValues.On]);

const enum GlobalChatValues {
    Off = 0,
    On = 1,
}

export { GlobalChatValues };

const VALID_GLOBAL_CHAT = new Set<number>([GlobalChatValues.Off, GlobalChatValues.On]);

// Mapping from PlayerSetting to its valid value set
const SETTING_VALID_VALUES: ReadonlyMap<PlayerSetting, Set<number>> = new Map([
    [PlayerSetting.IsSprinting, VALID_IS_SPRINTING],
    [PlayerSetting.AutoRetaliate, VALID_AUTO_RETALIATE],
    [PlayerSetting.CombatStyle, VALID_COMBAT_STYLE],
    [PlayerSetting.PublicChat, VALID_PUBLIC_CHAT],
    [PlayerSetting.GlobalChat, VALID_GLOBAL_CHAT],
]);

/**
 * Validates that a value is valid for the given PlayerSetting.
 * Returns true if the value is a valid integer option for that setting.
 */
export function isValidSettingValue(setting: PlayerSetting, value: unknown): boolean {
    if (typeof value !== "number" || !Number.isFinite(value) || !Number.isInteger(value)) {
        return false;
    }
    const validSet = SETTING_VALID_VALUES.get(setting);
    if (!validSet) {
        return false;
    }
    return validSet.has(value);
}