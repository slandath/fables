interface ImportMetaEnv {
  readonly DATABASE_URL: string
  readonly PORT: string
  readonly NODE_ENV: string
  readonly AUTH_SECRET: string
  readonly GITHUB_CLIENT_ID: string
  readonly GITHUB_CLIENT_SECRET: string
  readonly DISCORD_CLIENT_ID: string
  readonly DISCORD_CLIENT_SECRET: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module '*.ts' {
  // For route imports
}
