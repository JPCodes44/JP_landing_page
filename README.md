# JP Landing Page

A landing page for agentic services, built with Vite + React (frontend) and Next.js + Supabase (backend) in a Bun monorepo.

## Stack

- **Frontend**: Vite + React, port 5173
- **Backend**: Next.js App Router, port 3000
- **Shared**: Zod schemas in `packages/common`
- **Database**: Supabase (contacts table)

## Setup

```bash
# 1. Clone and enter the repo
git clone <repo-url>
cd JP_landing_page

# 2. Copy env and fill in Supabase credentials
cp .env.example .env

# 3. Install dependencies
bun install
```

## Development

```bash
# Run both services locally
bun run dev

# Or run individually
bun run --cwd packages/backend dev   # Next.js on :3000
bun run --cwd packages/frontend dev  # Vite on :5173

# Docker (mounts repo root as volume — no rebuild needed)
docker compose up
```

## Quality Gates

```bash
bun run lint       # Biome linter
bun run typecheck  # TypeScript across all packages
bun run test       # Tests (common package)
bun run quality    # Full quality gate script
```

## Supabase Setup

Create a `contacts` table:

```sql
create table contacts (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  message text not null,
  created_at timestamptz default now()
);
```

## Architecture

- `packages/common` — shared Zod schemas and utility types
- `packages/backend` — Next.js API routes; server-only Supabase client
- `packages/frontend` — Vite + React app; `/api` proxied to backend in dev
