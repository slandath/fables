<script setup lang="ts">
import { useRouter } from 'vue-router';

const props = defineProps<{
    error?: string
    message?: string
}>()

const router = useRouter()

const errorMessages: Record<string, string> = {
    signed_out: 'You have been signed out successfully.',
    invalid_session: 'Your session has expired.  Please sign in again.',
    oauth_error: 'OAuth authentication failed.  Please try again.',
    access_denied: 'Access denied.  Please allow the app to access your Discord account.',
    default: 'An authentication error occurred.  Please try again.'
}

const getErrorMessage = () => {
    if (props.message) return props.message
    return errorMessages[props.error || ''] || errorMessages.default
}

const goHome = () => {
    router.push('/')
}
</script>

<template>
    <div class="min-h-screen bg-background flex items-center justify-center p-4">
        <div class="max-w-md w-full bg-card rounded-lg shadow-lg p-8 text-center">
            <div class="text-6xl mb-4">⚠️</div>
            <h1 class="text-2xl font-bold text-destructive mb-4">
                Authentication Error
            </h1>
            <p class="text-muted-foreground mb-6">
                {{ getErrorMessage }}
            </p>
            <div class="space-y-3">
                <button class="w-full bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition"
          @click="goHome">
                Go Home
                </button>
                <a href="/api/auth/sign-in/discord" class="block w-full bg-[#5865F2] text-white px-4 py-2 rounded-md hover:bg-[#4752C4] transition">
                    Sign in with Discord
                </a>
            </div>
        </div>
    </div>
</template>