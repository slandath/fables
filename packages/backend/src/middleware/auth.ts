import type { FastifyReply, FastifyRequest } from 'fastify'
import { fromNodeHeaders } from 'better-auth/node'
import { auth } from '../auth/auth.js'
import { errorHandler } from '../lib/error-handler.js'

export async function requireAuth(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  try {
    const headers = fromNodeHeaders(request.headers)
    const session = await auth.api.getSession({ headers })

    if (!session) {
      reply.status(401).send({
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authentication required',
        },
      })
      return
    }

    // Attach session to request for downstream use
    request.session = session
  }
  catch (error) {
    errorHandler(error, request, reply)
  }
}

// Type augmentation for Fastify
declare module 'fastify' {
  interface FastifyRequest {
    session?: {
      user: {
        id: string
        email: string
        name?: string
        image?: string
      }
      session: {
        id: string
        expiresAt: Date
      }
    }
  }
}
