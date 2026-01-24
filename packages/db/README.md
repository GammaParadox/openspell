# @openspell/db

Shared database package for OpenSpell using Prisma ORM.

## Overview

This package contains:
- Prisma schema (`prisma/schema.prisma`)
- Database migrations (`prisma/migrations/`)
- Seed script (`prisma/seed.js`)
- Generated Prisma Client

## Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Create a `.env` file in the project root with:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/openspell?schema=public"
```

### 3. Run Migrations
```bash
npm run prisma:migrate      # Deploy migrations (production)
npm run prisma:migrate:dev  # Create/apply migrations (development)
```

### 4. Seed Database
```bash
npm run prisma:seed
```

## Available Scripts

### Database Operations
- `npm run prisma:generate` - Generate Prisma Client
- `npm run prisma:migrate` - Deploy migrations to database
- `npm run prisma:migrate:dev` - Create and apply new migrations
- `npm run prisma:studio` - Open Prisma Studio (database GUI)

### Seeding
- `npm run prisma:seed` - Seed database with initial data
- `npm run prisma:reset` - Reset database and run seed
- `npm run prisma:setup` - Deploy migrations and seed (first-time setup)

## Seed Script

The seed script (`prisma/seed.js`) populates:

### 1. Skills (18 total)
All game skills initialized:
- overall, hitpoints, accuracy, strength, defense
- magic, range, fishing, cooking, forestry
- mining, smithing, crafting, harvesting
- crime, potionmaking, enchanting, athletics

### 2. News Items
Imported from `apps/web/news.json`

### 3. Worlds (Game Servers)
- World 1 & 2 (production servers)
- World 100 & 101 (development servers)

### 4. Admin User
- **Username**: `admin`
- **Password**: `admin123`
- **Email**: `admin@openspell.com`
- **Permissions**: Admin, Email Verified

Complete player data initialized:
- ✅ Skills (all at level 1)
- ✅ Location (spawn: 78, -93)
- ✅ Equipment (10 empty slots)
- ✅ Inventory (4 starter items)

## Database Schema

### Core Tables
- `users` - User accounts and authentication
- `sessions` - Active user sessions
- `online_users` - Currently online players

### Game Data
- `skills` - Skill definitions
- `player_skills` - Player skill levels/XP
- `player_locations` - Player spawn locations
- `player_equipment` - Player equipment slots
- `player_inventory` - Player inventory items (28 slots)

### Content
- `news` - News articles
- `worlds` - Game server list

### Authentication
- `game_login_tokens` - Short-lived game login tokens
- `email_verifications` - Email verification tokens
- `password_resets` - Password reset tokens

## Usage in Other Packages

### Import Prisma Client
```javascript
const { PrismaClient } = require('@openspell/db');
const prisma = new PrismaClient();
```

### Or use helper functions
```javascript
const { connectDb, getPrisma, disconnectDb } = require('@openspell/db');

await connectDb();
const prisma = getPrisma();
// ... use prisma
await disconnectDb();
```

## Environment Variables

All Prisma commands use `dotenv-cli` to load environment variables from `../../.env`:

```bash
dotenv -e ../../.env -- prisma [command]
```

This ensures consistent environment configuration across all commands.

## Migrations

### Creating a New Migration
```bash
npm run prisma:migrate:dev -- --name migration_name
```

### Applying Migrations
```bash
npm run prisma:migrate
```

### Migration History
Migrations are stored in `prisma/migrations/` with timestamps:
- `20251231054012_init` - Initial schema
- `20260101000000_player_locations` - Player locations
- `20260101002000_player_equipment` - Player equipment
- `20260101004000_player_inventory` - Player inventory

## Development

### Prisma Studio
View and edit database data with a GUI:
```bash
npm run prisma:studio
```

Opens at `http://localhost:5555`

### Reset Database
⚠️ **Warning**: This will delete all data!
```bash
npm run prisma:reset
```

## Production Deployment

1. Set `DATABASE_URL` environment variable
2. Run migrations: `npm run prisma:migrate`
3. Seed initial data: `npm run prisma:seed`

Or use the setup command:
```bash
npm run prisma:setup
```

## Troubleshooting

### "Cannot find module '@openspell/db'"
Run `npm install` in the root or in this package.

### "Environment variable not found: DATABASE_URL"
Ensure `.env` file exists in project root with `DATABASE_URL` set.

### Prisma Client Out of Sync
Regenerate the client:
```bash
npm run prisma:generate
```

## Links

- [Prisma Documentation](https://www.prisma.io/docs)
- [Prisma Schema Reference](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference)
- [Prisma Client API](https://www.prisma.io/docs/reference/api-reference/prisma-client-reference)
