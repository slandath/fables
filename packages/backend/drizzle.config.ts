import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: import.meta.env.DATABASE_URL ?? 'postgres://localhost:5432/fables',
  },
})
