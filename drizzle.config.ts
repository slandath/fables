import { defineConfig } from "drizzle-kit";

export default defineConfig({
  strict: true,
  out: "./drizzle",
  schema: "./server/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
