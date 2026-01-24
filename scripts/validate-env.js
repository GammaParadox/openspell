const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");

const rootDir = process.cwd();
const envFiles = [
  path.join(rootDir, ".env"),
  path.join(rootDir, "config", "docker.env"),
  path.join(rootDir, "config", "docker.env.prod"),
  path.join(rootDir, "apps", "shared-assets", "base", "shared.env"),
  path.join(rootDir, "apps", "api", ".env"),
  path.join(rootDir, "apps", "web", ".env"),
  path.join(rootDir, "apps", "game", ".env")
];

for (const envPath of envFiles) {
  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath, override: false });
  }
}

const service = (process.argv[2] || "all").toLowerCase();
const isProd = (process.env.NODE_ENV || "").toLowerCase() === "production";

const requireOneOf = (keys) => keys.some((key) => !!process.env[key]);

const rules = {
  api: [
    { keys: ["DATABASE_URL"], label: "DATABASE_URL" },
    { keys: ["JWT_SECRET", "API_JWT_SECRET"], label: "JWT_SECRET or API_JWT_SECRET" },
    { keys: ["API_WEB_SECRET"], label: "API_WEB_SECRET" },
    { keys: ["GAME_SERVER_SECRET"], label: "GAME_SERVER_SECRET" },
    { keys: ["WORLD_REGISTRATION_SECRET"], label: "WORLD_REGISTRATION_SECRET" },
    { keys: ["HISCORES_UPDATE_SECRET"], label: "HISCORES_UPDATE_SECRET" },
    { keys: ["API_URL"], label: "API_URL" },
    { keys: ["WEB_URL"], label: "WEB_URL" }
  ],
  web: [
    { keys: ["SESSION_SECRET", "WEB_SESSION_SECRET"], label: "SESSION_SECRET or WEB_SESSION_SECRET" },
    { keys: ["API_URL"], label: "API_URL" },
    { keys: ["WEB_URL"], label: "WEB_URL" },
    { keys: ["CHAT_URL"], label: "CHAT_URL" },
    { keys: ["CDN_URL"], label: "CDN_URL" },
    { keys: ["CLIENT_API_URL"], label: "CLIENT_API_URL" }
  ],
  game: [
    { keys: ["DATABASE_URL"], label: "DATABASE_URL" },
    { keys: ["JWT_SECRET"], label: "JWT_SECRET" },
    { keys: ["API_URL"], label: "API_URL" },
    { keys: ["HISCORES_UPDATE_SECRET"], label: "HISCORES_UPDATE_SECRET" },
    { keys: ["SERVER_ID"], label: "SERVER_ID" },
    { keys: ["TICK_MS"], label: "TICK_MS" }
  ],
  migrate: [
    { keys: ["DATABASE_URL"], label: "DATABASE_URL" }
  ]
};

const selected = service === "all"
  ? ["api", "web", "game"]
  : [service];

const missing = [];
for (const name of selected) {
  const checks = rules[name];
  if (!checks) continue;
  for (const rule of checks) {
    if (!requireOneOf(rule.keys)) {
      missing.push(`[${name}] ${rule.label}`);
    }
  }
}

if (missing.length > 0) {
  const message = `[env] Missing required variables:\n- ${missing.join("\n- ")}`;
  if (isProd) {
    console.error(message);
    process.exit(1);
  } else {
    console.warn(`${message}\n[env] Non-production mode; continuing.`);
  }
}
