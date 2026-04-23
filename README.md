# Fables - D&D Session Assistant

A web app for D&D session notes with offline-first functionality.

## Tech Stack

- **Frontend:** Vue 3 + TypeScript + Shadcn Vue + TipTap + Pinia + IndexedDB
- **Backend:** Fastify + Zod + Drizzle ORM + BetterAuth
- **Database:** PostgreSQL with full-text search
- **PWA:** Offline-first with manual sync

## Project Structure

```
packages/
├── shared/       # Zod schemas and TypeScript types
├── frontend/     # Vue 3 + TipTap editor
└── backend/       # Fastify API + Drizzle ORM
```

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm
- PostgreSQL (local or cloud)

### Installation

```bash
# Install dependencies
pnpm install

# Set up environment variables
cp packages/backend/.env.example packages/backend/.env
# Edit .env with your database URL and auth credentials
```

### Development

```bash
# Start backend (port 3001)
cd packages/backend
pnpm dev

# Start frontend (port 3000)
cd packages/frontend
pnpm dev
```

### Database Setup

```bash
# Generate migrations
cd packages/backend
pnpm db:generate

# Push schema to database
pnpm db:push
```

### Testing

```bash
# Run tests in watch mode
pnpm test

# Run tests once
pnpm test:run
```

## Features

- TipTap editor with custom D&D blocks
- Full-text search
- Offline-first with manual sync
- PWA support

## Current Progress

### Completed

- [x] Project setup and monorepo configuration
- [x] Backend database connection (Railway Postgres)
- [x] Database schema (notes, campaigns tables)
- [x] Health check endpoints (`/health`, `/ready`)
- [x] Shared Zod schemas with Fastify JSON schema conversion
- [x] Unit tests (27 tests passing)
  - 15 tests for Zod schema validation
  - 12 tests for full-text search helper

### In Progress

- [ ] Connect Frontend to Backend API
- [ ] Implement TipTap Editor for Session Notes
- [ ] Set Up IndexedDB for Offline Storage
- [ ] Implement Manual Sync Functionality

### Blocked

- (none)

## Devcontainer

A VS Code devcontainer configuration is included for a consistent development environment.

```bash
# Open in container
code --remote container .
```

## Tech Decisions

| Decision | Choice | Reason |
|----------|--------|--------|
| Testing framework | Vitest | Compatible with @antfu/eslint-config |
| Environment loading | Node.js --env-file | Native support, no extra packages |
| Schema validation | Fastify JSON schemas | Required for Fastify route validation |
| Sync strategy | Manual "Sync Now" button | Explicit control, no background sync |

## Key Files

| File | Purpose |
|------|---------|
| `packages/shared/src/schemas/note.schema.ts` | Zod schemas for note validation |
| `packages/backend/src/routes/health.ts` | Health check endpoints |
| `packages/backend/src/db/schema.ts` | Drizzle ORM schema |
| `packages/shared/src/schemas/note.schema.test.ts` | Schema unit tests |
| `packages/backend/src/routes/notes.test.ts` | Helper function tests |
| `vitest.config.ts` | Test configuration |