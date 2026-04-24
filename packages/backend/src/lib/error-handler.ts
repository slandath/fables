import type { AppError } from '@fables/shared'
import type { FastifyReply, FastifyRequest } from 'fastify'
import { isAPIError } from 'better-auth/api'

export function createError(
  code: string,
  message: string,
  statusCode: number,
  details?: unknown,
): AppError {
  return { code, message, statusCode, details }
}

export function handleError(error: unknown): AppError {
  if (isAPIError(error)) {
    return createError('AUTH_ERROR', error.message, Number(error.status) || 400, error)
  }
  if (error instanceof Error && error.name === 'FastifyError') {
    return createError('VALIDATION_ERROR', error.message, 400, error)
  }
  if (error instanceof Error && error.message?.includes('database')) {
    return createError('DATABASE_ERROR', 'Database operation failed', 500, error)
  }

  return createError(
    'INTERNAL_ERROR',
    error instanceof Error ? error.message : 'An unexpected error occurred',
    500,
    error,
  )
}

export function sendError(reply: FastifyReply, error: AppError): void {
  reply.status(error.statusCode).send({
    error: {
      code: error.code,
      message: error.message,
      ...(process.env.NODE_ENV === 'development' && { details: error.details }),
    },
  })
}

export function logError(error: AppError, request?: FastifyRequest): void {
  const logData = {
    code: error.code,
    status: error.statusCode,
    message: error.message,
    ...(request && {
      path: request.url,
      method: request.method,
      requestId: request.id,
    }),
  }
  if (error.statusCode >= 500) {
    console.error('[ERROR]', logData)
  }
  else if (error.statusCode >= 400) {
    console.warn('[WARN]', logData)
  }
  else {
    console.log('[INFO]', logData)
  }
}

export function errorHandler(
  error: unknown,
  request: FastifyRequest,
  reply: FastifyReply,
): void {
  const appError = handleError(error)
  logError(appError, request)
  sendError(reply, appError)
}
