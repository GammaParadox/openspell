# Shared Assets

This directory contains static assets and shared configuration that are used across multiple services (web, game, api, chat) and can be mounted as volumes in Docker containers.

## Structure

Each subdirectory represents a different asset set/theme:

- `base/` - Default/vanilla assets and configuration used by the standard game
- Future: `custom/`, `hardcore/`, etc. - Additional asset sets for different game modes

## Contents

Each asset folder contains:

### Static Files

- `css/` - Stylesheets for the web interface and game client
- `js/` - JavaScript files including the game client bundles
- `images/` - Image assets (logos, icons, news thumbnails, etc.)
- `static/` - Static game data files (.carbon files, heightmaps, world entities, etc.)

### Configuration

- `shared.env` - **Shared environment variables** for all services using this asset set
  - Server URLs (API_URL, WEB_URL, CHAT_URL, CDN_URL)
  - Rate limiting configuration
  - Game client configuration
  - Static assets paths
- `assetsClient.json` - **Client asset manifest** served by the API server
  - Defines latest client/server versions
  - Maps asset URLs for the game client to download
  - Only accessible without authentication (public endpoint)

## Environment Variable Loading Order

Each service should load environment variables in this order:

1. **Root `.env`** (repo root) - Database connection and NODE_ENV
2. **`apps/shared-assets/base/shared.env`** - Shared configuration (URLs, rate limits, asset paths)
3. **Service-specific `.env`** - Service secrets (JWT_SECRET, SESSION_SECRET, etc.)

Example in Node.js:

```javascript
require('dotenv').config({ path: '../../.env' }); // Root .env
require('dotenv').config({ path: '../shared-assets/base/shared.env' }); // Shared config
require('dotenv').config(); // Service-specific .env
```

## Docker Usage

In your Docker Compose file, mount this directory as a volume:

```yaml
services:
  web:
    volumes:
      - ./apps/shared-assets:/app/shared-assets:ro
    environment:
      # Load shared.env variables
      - STATIC_ASSETS_PATH=/app/shared-assets/base/static
  
  game:
    volumes:
      - ./apps/shared-assets:/app/shared-assets:ro
    environment:
      # Override for Docker paths
      - STATIC_ASSETS_PATH=/app/shared-assets/base/static
  
  api:
    volumes:
      - ./apps/shared-assets:/app/shared-assets:ro
```

### Docker Environment Configuration

When running in Docker containers:

1. Each container mounts `shared-assets` as a read-only volume
2. Service startup scripts load:
   - Root .env from the repo root (mounted separately or baked into image)
   - `shared.env` from `/app/shared-assets/base/shared.env`
   - Service-specific .env from its app directory

3. Override paths for Docker:
   ```env
   STATIC_ASSETS_PATH=/app/shared-assets/base/static
   ```

## Development

During development, services reference these assets directly from the repository:

- **Web Server**: Serves from `../shared-assets/base/` relative to `apps/web/`
- **Game Server**: Loads world entities from `../shared-assets/base/static/` (or via STATIC_ASSETS_PATH env var)
- **API Server**: References configuration from shared.env

Run the setup script to configure all environment files:

```powershell
# Windows
.\setup-env.ps1

# Linux/Mac
./setup-env.sh
```

## Adding New Asset Sets

To add a new asset set (e.g., for a custom game mode):

1. Create a new directory: `apps/shared-assets/custom/`
2. Copy the base structure:
   ```bash
   cp -r apps/shared-assets/base/* apps/shared-assets/custom/
   ```
3. Update `shared.env` in the new folder with custom URLs or settings
4. Update service configuration to reference the new asset set:
   ```env
   STATIC_ASSETS_PATH=../shared-assets/custom/static
   ```

## Environment Variables Reference

### Shared Variables (in shared.env)

| Variable | Description | Default |
|----------|-------------|---------|
| `API_URL` | API server base URL | `http://localhost:3002` |
| `WEB_URL` | Web server base URL | `http://localhost:8887` |
| `CHAT_URL` | Chat server WebSocket URL | `http://localhost:8765` |
| `CDN_URL` | CDN/assets server URL | `http://localhost:8887` |
| `CLIENT_API_URL` | API URL exposed to game client | `http://localhost:3002` |
| `ASSET_SET` | Asset set to use (base, custom, hardcore) | `base` |
| `ASSETS_ROOT` | Path to assets root (web CSS/JS/images) | (empty = auto-detect) |
| `STATIC_ASSETS_PATH` | Path to .carbon files and game data | (empty = auto-detect) |
| `WORLD_ENTITIES_FILE` | World entities data file | `worldentities.26.carbon` |
| `WORLD_ENTITY_DEFS_FILE` | World entity definitions file | `worldentitydefs.13.carbon` |
| `WORLD_ENTITY_ACTIONS_FILE` | World entity actions configuration | `worldentityactions.4.carbon` |
| `NPC_ENTITY_DEFS_FILE` | NPC entity definitions file | `npcentitydefs.22.carbon` |
| `NPC_ENTITIES_FILE` | NPC entities data file | `npcentities.16.carbon` |
| `ITEM_DEFS_FILE` | Item definitions file | `itemdefs.33.carbon` |
| `GROUND_ITEMS_FILE` | Ground items data file | `grounditems.12.carbon` |
| `NPC_CONVERSATION_DEFS_FILE` | NPC conversation definitions file | `npcconversationdefs.2.carbon` |
| `SHOP_DEFS_FILE` | Shop definitions file | `shopdefs.11.carbon` |
| `WEB_AUTH_WINDOW_MS` | Rate limit window for web auth | `900000` (15 min) |
| `WEB_AUTH_MAX` | Max auth attempts per window | `5` |
| `WEB_REGISTER_MAX` | Max registration attempts | `3` |
| `WEB_EMAIL_MAX` | Max email operations | `3` |
| `WEB_VERIFICATION_MAX` | Max verification attempts | `10` |
| `GET_LOGIN_WINDOW_MS` | Rate limit window for login tokens | `900000` |
| `GET_LOGIN_MAX` | Max login token requests | `15` |
| `WORLD_HEARTBEAT_TIMEOUT_SEC` | World offline threshold | `120` seconds |
| `GAME_LOGIN_TOKEN_TTL_SEC` | Login token lifetime | `60` seconds |

### Service-Specific Variables (in app .env files)

Each service has its own `.env` file containing secrets:

- **API**: `JWT_SECRET`, `SESSION_SECRET`, `API_WEB_SECRET`, `GAME_SERVER_SECRET`, `WORLD_REGISTRATION_SECRET`, `HISCORES_UPDATE_SECRET`
- **Web**: `SESSION_SECRET`, `API_WEB_SECRET`
- **Game**: `JWT_SECRET`, `GAME_SERVER_SECRET`, `SERVER_ID`, `DISABLE_STAMINA`
- **Chat**: (minimal for now, placeholder)

### Root Variables (in repo root .env)

- `DATABASE_URL` - PostgreSQL connection string
- `NODE_ENV` - Development/production environment

## Security Note

- **Never commit `.env` files** containing secrets to version control
- The `shared.env` file in this directory contains **non-secret configuration** and can be committed
- Service-specific `.env` files contain **secrets** and should be in `.gitignore`
