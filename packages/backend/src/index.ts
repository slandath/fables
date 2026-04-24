import cors from '@fastify/cors'
import Fastify from 'fastify'
import { authRoutes } from './routes/auth.js'
import { healthRoutes } from './routes/health.js'
import { noteRoutes } from './routes/notes.js'
import { errorHandler } from './lib/error-handler.js'

const fastify = Fastify({
  logger: true,
})

async function start() {
  try {
    fastify.setErrorHandler(errorHandler)
    await fastify.register(cors, {
      origin: true,
      credentials: true,
    })

    await fastify.register(healthRoutes)
    await fastify.register(noteRoutes, { prefix: '/api/notes' })
    await fastify.register(authRoutes, { prefix: '/api/auth' })

    const port = Number.parseInt(process.env.PORT ?? '3001', 10)
    await fastify.listen({ port, host: '0.0.0.0' })

    fastify.log.info(`Server running on port ${port}`)
  
  }
  catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()
