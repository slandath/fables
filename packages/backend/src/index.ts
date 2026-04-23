import cors from '@fastify/cors'
import Fastify from 'fastify'
import { authRoutes } from './routes/auth.js'
import { healthRoutes } from './routes/health.js'
import { noteRoutes } from './routes/notes.js'

const fastify = Fastify({
  logger: true,
})

async function start() {
  try {
    await fastify.register(cors, {
      origin: true,
    })

    await fastify.register(healthRoutes)
    await fastify.register(noteRoutes, { prefix: '/api/notes' })
    await fastify.register(authRoutes, { prefix: '/api/auth' })

    const port = Number.parseInt(import.meta.env.PORT ?? '3001', 10)
    await fastify.listen({ port, host: '0.0.0.0' })
  }
  catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()
