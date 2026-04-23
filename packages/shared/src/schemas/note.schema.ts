import { z } from 'zod'

export const tipTapMarkSchema: z.ZodType<import('../types').TipTapMark> = z.object({
  type: z.string(),
  attrs: z.record(z.unknown()).optional(),
})

export const tipTapNodeSchema: z.ZodType<import('../types').TipTapNode> = z.lazy(() =>
  z.object({
    type: z.string(),
    attrs: z.record(z.unknown()).optional(),
    content: z.array(tipTapNodeSchema).optional(),
    marks: z.array(tipTapMarkSchema).optional(),
    text: z.string().optional(),
  }),
)

export const tipTapDocSchema: z.ZodType<import('../types').TipTapDoc> = z.object({
  type: z.literal('doc'),
  content: z.array(tipTapNodeSchema),
})

const tipTapDocJsonSchema = {
  type: 'object',
  required: ['type', 'content'],
  properties: {
    type: { type: 'string', const: 'doc' },
    content: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          type: { type: 'string' },
          attrs: { type: 'object' },
          content: { type: 'array' },
          marks: { type: 'array' },
          text: { type: 'string' },
        },
      },
    },
  },
} as const

export const createNoteSchema = {
  type: 'object',
  required: ['title', 'content'],
  properties: {
    title: { type: 'string', minLength: 1, maxLength: 200 },
    content: tipTapDocJsonSchema,
    campaignId: { type: ['string', 'null'], format: 'uuid' },
  },
} as const

export const updateNoteSchema = {
  type: 'object',
  required: ['id'],
  properties: {
    id: { type: 'string', format: 'uuid' },
    title: { type: 'string', minLength: 1, maxLength: 200 },
    content: tipTapDocJsonSchema,
  },
} as const

export const noteResponseSchema = {
  type: 'object',
  required: ['id', 'title', 'content', 'createdAt', 'updatedAt'],
  properties: {
    id: { type: 'string', format: 'uuid' },
    title: { type: 'string' },
    content: tipTapDocJsonSchema,
    campaignId: { type: ['string', 'null'], format: 'uuid' },
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' },
  },
} as const

export const noteListResponseSchema = {
  type: 'array',
  items: noteResponseSchema,
}

export const searchNotesQuerySchema = {
  type: 'object',
  required: [],
  properties: {
    q: { type: 'string', minLength: 1 },
    limit: { type: 'number', minimum: 1, maximum: 100, default: 20 },
    offset: { type: 'number', minimum: 0, default: 0 },
  },
} as const

export const syncRequestSchema = {
  type: 'object',
  required: ['notes'],
  properties: {
    notes: {
      type: 'array',
      items: {
        type: 'object',
        required: ['id', 'title', 'content', 'createdAt', 'updatedAt'],
        properties: {
          id: { type: 'string', format: 'uuid' },
          title: { type: 'string' },
          content: tipTapDocJsonSchema,
          campaignId: { type: ['string', 'null'], format: 'uuid' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
    },
    lastSyncedAt: { type: ['string', 'null'], format: 'date-time' },
  },
} as const

export const syncResponseSchema = {
  type: 'object',
  required: ['notes', 'conflicts'],
  properties: {
    notes: {
      type: 'array',
      items: noteResponseSchema,
    },
    conflicts: {
      type: 'array',
      items: {
        type: 'object',
        required: ['id', 'serverVersion', 'localVersion'],
        properties: {
          id: { type: 'string', format: 'uuid' },
          serverVersion: noteResponseSchema,
          localVersion: noteResponseSchema,
        },
      },
    },
  },
} as const