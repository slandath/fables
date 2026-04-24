import { index, jsonb, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'

export const notes = pgTable(
  'notes',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    title: text('title').notNull(),
    content: jsonb('content').notNull(),
    searchableText: text('searchable_text'),
    campaignId: uuid('campaign_id'),
    ownerId: uuid('owner_id').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  table => [
    index('notes_owner_id_idx').on(table.ownerId),
    index('notes_campaign_id_idx').on(table.campaignId),
  ],
)

export const campaigns = pgTable(
  'campaigns',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    name: text('name').notNull(),
    ownerId: uuid('owner_id').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  table => [
    index('campaigns_owner_id_idx').on(table.ownerId),
  ],
)

export type Note = typeof notes.$inferSelect
export type NewNote = typeof notes.$inferInsert
export type Campaign = typeof campaigns.$inferSelect
export type NewCampaign = typeof campaigns.$inferInsert
