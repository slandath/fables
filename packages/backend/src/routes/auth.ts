import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { fromNodeHeaders } from 'better-auth/node'
import { auth } from '../auth/auth'
import { errorHandler } from '../lib/error-handler'

export async function authRoutes(fastify: FastifyInstance) {
  fastify.route({
    method: ['GET', 'POST'],
    url: '/*',
    handler: async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const url = new URL(request.url, `http://${request.headers.host}`)
        const req = new Request(url.toString(), {
          method: request.method,
          headers: fromNodeHeaders(request.headers),
          body: request.body ? JSON.stringify(request.body) : undefined,
        })
        const response = await auth.handler(req)
        reply.status(response.status)
        response.headers.forEach((value, key) => reply.header(key, value))
        return reply.send(response.body ? await response.text() : null)
      }
      catch (error) {
        errorHandler(error, request, reply)
      }
    }
  })

  fastify.get('/session', async (request, reply) => {
    try {
      const headers = fromNodeHeaders(request.headers)
      const session = await auth.api.getSession({headers})
      if (!session) {
        return reply.status(401).send({
          error: { code: 'UNAUTHORIZED', message: 'No active session' }
        })
      }
      return { session }
    }
    catch (error) {
      errorHandler(error, request, reply)
    }
  })

  fastify.post('/sign-out', async (request, reply) => {
    try {
      const headers = fromNodeHeaders(request.headers)
      await auth.api.signOut({headers})
      reply.header('Set-Cookie', 'better-auth.session=; Max-Age=0; Path=/; HttpOnly')
      return reply.redirect('/auth/error?error=signed_out&message=You have been signed out')
    }
    catch (error) {
      errorHandler(error, request, reply)
    }
  })
}
