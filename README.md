# Fables - D&D Session Assistant

A web app for D&D session notes with offline-first functionality.

## Tech Stack

- **Frontend:** Vue 3 + TypeScript + Shadcn Vue + TipTap + Pinia + IndexedDB
- **Backend:** Fastify + Zod + Drizzle ORM + BetterAuth
- **Database:** PostgreSQL with full-text search
- **PWA:** Offline-first with manual sync

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

## Project Structure

```
packages/
├── shared/       # Zod schemas and TypeScript types
├── frontend/     # Vue 3 + TipTap editor
└── backend/      # Fastify API + Drizzle ORM
```

## Features

- TipTap editor with custom D&D blocks
- Full-text search
- Offline-first with manual sync
- PWA support
