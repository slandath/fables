import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { db } from '../db/index.js'
import { createError, handleError } from '../lib/error-handler.js'

function validateEnv(): void {
    const required = ['DISCORD_CLIENT_ID', 'DISCORD_CLIENT_SECRET', 'AUTH_SECRET']
    const missing = required.filter(key => !process.env[key])

    if (missing.length > 0) {
        throw createError(
            'CONFIG_ERROR', `Missing required environment variables: ${missing.join(', ')}`, 500
        )
    }
}

validateEnv()

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: 'pg',
    }),
    secret: process.env.AUTH_SECRET!,

    socialProviders: {
        discord: {
            clientId: process.env.DISCORD_CLIENT_ID!,
            clientSecret: process.env.DISCORD_CLIENT_SECRET!,
        },
    },

    onAPIError: {
        throw: true,
        onError: (error) => {
            const appError = handleError(error)
            console.error('[Auth Error]', {
                code: appError.code,
                message: appError.message,
                status: appError.statusCode,
            })
        },
        errorURL: '/auth/error',
    },
    user: {
        modelName: 'user',
    },
    session: {
        modelName: 'session',
        expiresIn: 60 * 60 * 24 * 7,
    },
    account: {
        accountLinking: {
            enabled: true,
        }
    }
})