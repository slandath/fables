import type { FastifyInstance, FastifyReply } from 'fastify'
import type { z } from 'zod'
import {
  createNoteSchema,
  searchNotesQuerySchema,
  syncRequestSchema,
  updateNoteSchema,
} from '@fables/shared/schemas'
import { desc, eq, sql } from 'drizzle-orm'
import { db } from '../db/index.js'
import { notes } from '../db/schema.js'
import { requireAuth } from '../middleware/auth.js'

type CreateNoteInput = z.infer<typeof createNoteSchema>
type UpdateNoteInput = z.infer<typeof updateNoteSchema>
type SyncRequestInput = z.infer<typeof syncRequestSchema>

function extractSearchableText(content: unknown): string {
  if (!content || typeof content !== 'object')
    return ''

  const extract = (node: unknown): string => {
    if (!node || typeof node !== 'object')
      return ''
    const n = node as Record<string, unknown>

    if (n.text && typeof n.text === 'string')
      return `${n.text} `
    if (n.content && Array.isArray(n.content)) {
      return n.content.map(extract).join(' ')
    }
    return ''
  }

  return extract(content).trim()
}

export { extractSearchableText }

function unauthorized(reply: FastifyReply, message = 'Unauthorized') {
  return reply.code(401).send({ error: message })
}

function notFound(reply: FastifyReply, message = 'Not Found') {
  return reply.code(404).send({ error: message })
}

export async function noteRoutes(fastify: FastifyInstance) {
  fastify.addHook('preHandler', requireAuth)

  fastify.get('/', { schema: { querystring: searchNotesQuerySchema } }, async (request, reply) => {
    const { q, limit, offset } = request.query as z.infer<typeof searchNotesQuerySchema>
    const userId = request.session?.user.id

    if (!userId) {
      return unauthorized(reply, 'User ID required')
    }

    if (q) {
      const searchVector = sql`setweight(to_tsvector('english', ${notes.searchableText}), 'A')`
      const searchQuery = sql`websearch_to_tsquery('english', ${q})`
      const results = await db
        .select()
        .from(notes)
        .where(sql`${searchVector} @@ ${searchQuery} AND ${notes.ownerId} = ${userId}`)
        .orderBy(desc(notes.updatedAt))
        .limit(limit)
        .offset(offset)
      return results
    }

    const results = await db
      .select()
      .from(notes)
      .where(eq(notes.ownerId, userId))
      .orderBy(desc(notes.updatedAt))
      .limit(limit)
      .offset(offset)

    return results
  })

  fastify.get('/:id', async (request, reply) => {
    const { id } = request.params as { id: string }
    const userId = request.session?.user.id

    if (!userId) {
      return unauthorized(reply, 'User ID required')
    }

    const note = await db.select().from(notes).where(eq(notes.id, id)).limit(1)

    if (!note[0] || note[0].ownerId !== userId) {
      return notFound(reply, 'Note not found')
    }

    return note[0]
  })

  fastify.post('/', { schema: { body: createNoteSchema } }, async (request, reply) => {
    const data = request.body as CreateNoteInput
    const userId = request.session?.user.id

    if (!userId) {
      return unauthorized(reply, 'User ID required')
    }

    const searchableText = extractSearchableText(data.content)

    const [note] = await db
      .insert(notes)
      .values({
        title: data.title,
        content: data.content as object,
        searchableText,
        campaignId: data.campaignId ?? null,
        ownerId: userId,
      })
      .returning()

    reply.code(201)
    return note
  })

  fastify.patch('/:id', { schema: { body: updateNoteSchema } }, async (request, reply) => {
    const { id } = request.params as { id: string }
    const data = request.body as UpdateNoteInput
    const userId = request.session?.user.id

    if (!userId) {
      return unauthorized(reply, 'User ID required')
    }

    const existing = await db.select().from(notes).where(eq(notes.id, id)).limit(1)

    if (!existing[0] || existing[0].ownerId !== userId) {
      return notFound(reply, 'Note not found')
    }

    const updateData: Record<string, unknown> = {}

    if (data.title !== undefined)
      updateData.title = data.title
    if (data.content !== undefined) {
      updateData.content = data.content as object
      updateData.searchableText = extractSearchableText(data.content)
    }

    updateData.updatedAt = new Date()

    const [updated] = await db.update(notes).set(updateData).where(eq(notes.id, id)).returning()

    return updated
  })

  fastify.delete('/:id', async (request, reply) => {
    const { id } = request.params as { id: string }
    const userId = request.session?.user.id

    if (!userId) {
      return unauthorized(reply, 'User ID required')
    }

    const existing = await db.select().from(notes).where(eq(notes.id, id)).limit(1)

    if (!existing[0] || existing[0].ownerId !== userId) {
      return notFound(reply, 'Note not found')
    }

    await db.delete(notes).where(eq(notes.id, id))
    reply.code(204)
  })

  fastify.post('/sync', { schema: { body: syncRequestSchema } }, async (request, reply) => {
    const { notes: localNotes, lastSyncedAt: _lastSyncedAt } = request.body as SyncRequestInput
    const userId = request.session?.user.id

    if (!userId) {
      return unauthorized(reply, 'User ID required')
    }

    const conflicts: Array<{ id: string, serverVersion: unknown, localVersion: unknown }> = []
    const serverNotes = await db
      .select()
      .from(notes)
      .where(eq(notes.ownerId, userId))

    const serverNotesMap = new Map(serverNotes.map(n => [n.id, n]))

    for (const localNote of localNotes) {
      const serverNote = serverNotesMap.get(localNote.id)

      if (!serverNote) {
        await db.insert(notes).values({
          id: localNote.id,
          title: localNote.title,
          content: localNote.content as object,
          searchableText: extractSearchableText(localNote.content),
          campaignId: localNote.campaignId,
          ownerId: userId,
          createdAt: new Date(localNote.createdAt),
          updatedAt: new Date(localNote.updatedAt),
        })
      }
      else if (new Date(localNote.updatedAt) > new Date(serverNote.updatedAt)) {
        await db
          .update(notes)
          .set({
            title: localNote.title,
            content: localNote.content as object,
            searchableText: extractSearchableText(localNote.content),
            updatedAt: new Date(localNote.updatedAt),
          })
          .where(eq(notes.id, localNote.id))
      }
      else if (new Date(localNote.updatedAt) < new Date(serverNote.updatedAt)) {
        conflicts.push({
          id: localNote.id,
          serverVersion: serverNote,
          localVersion: localNote,
        })
      }
    }

    const updatedNotes = await db.select().from(notes).where(eq(notes.ownerId, userId))

    return {
      notes: updatedNotes,
      conflicts,
    }
  })
}
