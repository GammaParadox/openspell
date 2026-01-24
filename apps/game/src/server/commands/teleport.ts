import { PlayerType } from "../../protocol/enums/PlayerType";
import { MessageStyle } from "../../protocol/enums/MessageStyle";
import type { CommandContext, CommandHandler } from "./types";

// ============================================================================
// Teleport Locations Registry
// ============================================================================
// Add new teleport locations here. Each entry maps a location name to coords.
// Usage: /teleport <location> [username]

interface TeleportLocation {
  x: number;
  y: number;
  mapLevel: number;
  description?: string;
}

/**
 * Registry of named teleport locations.
 * 
 * To add a new location:
 * 1. Add an entry to this object with the location name as key
 * 2. That's it! The command will automatically support it.
 * 
 * Example: /teleport lumbridge
 *          /teleport varrock PlayerName
 */
const TELEPORT_LOCATIONS: Record<string, TeleportLocation> = {
  home: {
    x: 78,
    y: -93,
    mapLevel: 1,
    description: "Spawn point"
  },
  celadon: {
    x: 325,
    y: -20,
    mapLevel: 1,
    description: "Celadon city"
  },
  summerton: {
    x: -160,
    y: -335,
    mapLevel: 1,
    description: "Summerton"
  },
  highcove:{
    x: -244,
    y: -353,
    mapLevel: 1,
    description: "Highcove"
  },
  icitrine:{
    x: 13,
    y: 207,
    mapLevel: 1,
    description: "Icitrine city"
  }
  // -------------------------------------------------------------------------
  // Add more locations below following this pattern:
  // -------------------------------------------------------------------------
  // lumbridge: {
  //   x: 100,
  //   y: 200,
  //   mapLevel: 1,
  //   description: "Lumbridge town center"
  // },
  // varrock: {
  //   x: 300,
  //   y: 400,
  //   mapLevel: 1,
  //   description: "Varrock square"
  // },
  // dungeon1: {
  //   x: 50,
  //   y: 50,
  //   mapLevel: 2,
  //   description: "First dungeon entrance"
  // },
};

// ============================================================================
// Teleport Subcommand Handlers
// ============================================================================
// For complex subcommands that need custom logic beyond simple location teleport

type TeleportSubcommandHandler = (
  ctx: CommandContext,
  args: string[] // args after the subcommand
) => void;

/**
 * Registry of special teleport subcommands with custom logic.
 * These take precedence over location lookups.
 * 
 * Use this for subcommands that need logic beyond simple coordinate teleport,
 * such as "to" (teleport to another player's position).
 */
const TELEPORT_SUBCOMMANDS: Record<string, TeleportSubcommandHandler> = {
  // Example: /teleport to <username> - teleport self to another player's location
  // to: (ctx, args) => {
  //   const targetName = args[0];
  //   if (!targetName) {
  //     ctx.reply("Usage: /teleport to <username>", MessageStyle.Warning);
  //     return;
  //   }
  //   const targetId = ctx.getPlayerIdByUsername(targetName);
  //   if (!targetId) {
  //     ctx.reply(`Player "${targetName}" not found`, MessageStyle.Warning);
  //     return;
  //   }
  //   // Would need to get target's position and teleport to it
  //   // ctx.teleportToPlayer(ctx.userId, targetId);
  //   ctx.reply(`Teleported to ${targetName}`, MessageStyle.Green);
  // },

  // Example: /teleport bring <username> - bring another player to your location
  // bring: (ctx, args) => {
  //   const targetName = args[0];
  //   if (!targetName) {
  //     ctx.reply("Usage: /teleport bring <username>", MessageStyle.Warning);
  //     return;
  //   }
  //   const targetId = ctx.getPlayerIdByUsername(targetName);
  //   if (!targetId) {
  //     ctx.reply(`Player "${targetName}" not found`, MessageStyle.Warning);
  //     return;
  //   }
  //   // Would teleport target to caller's position
  //   // ctx.teleportToPlayer(targetId, ctx.userId);
  //   ctx.reply(`Brought ${targetName} to your location`, MessageStyle.Green);
  // },
};

// ============================================================================
// Main Teleport Command Handler
// ============================================================================

/**
 * Handles location-based teleport: /teleport <location> [username]
 */
function handleLocationTeleport(
  ctx: CommandContext,
  locationName: string,
  location: TeleportLocation,
  targetUsername?: string
): void {
  if (targetUsername) {
    // Teleport another player to the location
    const targetId = ctx.getPlayerIdByUsername(targetUsername);
    if (!targetId) {
      ctx.reply(`Player "${targetUsername}" not found`, MessageStyle.Warning);
      return;
    }
    ctx.teleportPlayer(targetId, location.x, location.y, location.mapLevel);
    ctx.reply(`Teleported ${targetUsername} to ${locationName}`, MessageStyle.Green);
  } else {
    // Teleport self to the location
    ctx.teleportPlayer(ctx.userId, location.x, location.y, location.mapLevel);
    ctx.reply(`Teleported to ${locationName}`, MessageStyle.Green);
  }
}

/**
 * Main teleport command handler
 * 
 * Usage:
 *   /teleport <location>           - Teleport self to location
 *   /teleport <location> <user>    - Teleport user to location
 *   /teleport help                 - Show available locations
 */
export const teleportCommand: CommandHandler = (ctx, args) => {
  const subcommand = args[0]?.toLowerCase();

  // No subcommand or help requested
  if (!subcommand || subcommand === "help") {
    const locations = Object.keys(TELEPORT_LOCATIONS).join(", ");
    ctx.reply(`Available locations: ${locations}`, MessageStyle.Green);
    ctx.reply("Usage: /teleport <location> [username]", MessageStyle.Green);
    return;
  }

  // Check for special subcommands first
  const specialHandler = TELEPORT_SUBCOMMANDS[subcommand];
  if (specialHandler) {
    specialHandler(ctx, args.slice(1));
    return;
  }

  // Check for location-based teleport
  const location = TELEPORT_LOCATIONS[subcommand];
  if (location) {
    handleLocationTeleport(ctx, subcommand, location, args[1]);
    return;
  }

  // Unknown subcommand/location
  const locations = Object.keys(TELEPORT_LOCATIONS).join(", ");
  ctx.reply(`Unknown location: "${subcommand}"`, MessageStyle.Warning);
  ctx.reply(`Available: ${locations}`, MessageStyle.Green);
};
