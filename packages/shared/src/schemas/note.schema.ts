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

export const createNoteSchema = z.object({
  title: z.string().min(1).max(200),
  content: tipTapDocSchema,
  campaignId: z.string().uuid().nullable().optional(),
})

export const updateNoteSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1).max(200).optional(),
  content: tipTapDocSchema.optional(),
})

export const noteResponseSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  content: tipTapDocSchema,
  campaignId: z.string().uuid().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})

export const noteListResponseSchema = z.array(noteResponseSchema)

export const searchNotesQuerySchema = z.object({
  q: z.string().min(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  offset: z.coerce.number().min(0).default(0),
})

export const syncRequestSchema = z.object({
  notes: z.array(
    z.object({
      id: z.string().uuid(),
      title: z.string(),
      content: tipTapDocSchema,
      campaignId: z.string().uuid().nullable(),
      createdAt: z.string().datetime(),
      updatedAt: z.string().datetime(),
    }),
  ),
  lastSyncedAt: z.string().datetime().nullable().optional(),
})

export const syncResponseSchema = z.object({
  notes: z.array(noteResponseSchema),
  conflicts: z.array(
    z.object({
      id: z.string().uuid(),
      serverVersion: noteResponseSchema,
      localVersion: noteResponseSchema,
    }),
  ),
})
