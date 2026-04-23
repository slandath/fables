import type { FastifyInstance } from 'fastify'

export async function authRoutes(fastify: FastifyInstance) {
  fastify.get('/', async () => {
    return { message: 'Auth endpoint - to be implemented with BetterAuth' }
  })

  fastify.get('/session', async (request) => {
    const userId = request.headers['x-user-id'] as string
    if (!userId) {
      return { session: null }
    }
    return {
      session: {
        user: {
          id: userId,
          email: 'user@example.com',
        },
      },
    }
  })
}
