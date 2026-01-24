import type {
  EquipmentSlot,
  FullInventory,
  PlayerAppearance,
  PlayerEquipment,
  PlayerSkills,
  PlayerAbilities,
  PlayerSettings
} from "../world/PlayerState";

export type PlayerLocationDTO = {
  mapLevel: number;
  x: number;
  y: number;
};

export type PlayerEquipmentRowDTO = {
  userId: number;
  persistenceId: number;
  slot: EquipmentSlot;
  itemDefId: number | null;
  amount: number | null;
};

export type PlayerInventorySlotDTO = {
  userId: number;
  persistenceId: number;
  slot: number;
  itemId: number;
  amount: number;
  isIOU: number;
};

export type PlayerStateSnapshotMetadataDTO = {
  lastDirtyAt: number;
  savedAt: number;
};

export type PlayerStateSnapshotDTO = {
  version: number;
  username: string;
  location: PlayerLocationDTO;
  skills: PlayerSkills;
  equipment: PlayerEquipment;
  inventory: FullInventory;
  appearance: PlayerAppearance;
  abilities: PlayerAbilities;
  settings: PlayerSettings;
  metadata: PlayerStateSnapshotMetadataDTO;
};

export type NormalizedPlayerStateWrites = {
  location: PlayerLocationDTO;
  equipment: PlayerEquipmentRowDTO[];
  inventory: PlayerInventorySlotDTO[];
};
