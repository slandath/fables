import type { FastifyInstance } from 'fastify'
import { db } from '../db'
import { notes } from '../db/schema'

export async function healthRoutes(fastify: FastifyInstance) {
  fastify.get('/health', async () => {
    return { status: 'ok', timestamp: new Date().toISOString() }
  })

  fastify.get('/ready', async () => {
    try {
      await db.select().from(notes).limit(1)
      return { status: 'ready', timestamp: new Date().toISOString() }
    }
    catch (err) {
      console.error('DB Error:', err)
      throw err
    }
  })
}
