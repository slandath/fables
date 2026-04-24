<script setup lang="ts">
import { useOnline } from '@vueuse/core';
import { onMounted, ref } from 'vue';

const isOnline = useOnline()
const syncStatus = ref<'synced' | 'pending' | 'offline'>('synced')

onMounted(()=>{
    if (!isOnline.value) {
        syncStatus.value = 'offline'
    }
})
</script>

<template>
    <div class="min-h-screen bg-background">
        <header class="border-b border-border">
            <div class="container flex items-center justify-between h-14">
                <h1 class="text-xl font-bold text-primary">
                    Fables
                </h1>
                <div class="flex items-center gap-2">
                    <span class="text-xs px-2 py-1 rounded-full" :class="{
                'bg-green-500/20 text-green-400': syncStatus === 'synced',
                'bg-yellow-500/20 text-yellow-400': syncStatus === 'pending',
                'bg-red-500/20 text-red-400': syncStatus === 'offline',
                    }"
                    >
                    {{ syncStatus === 'synced' ? 'Synced' : syncStatus === 'pending' ? 'Pending' : 'Offline' }}
                    </span>
                    <button v-if="syncStatus === 'pending' && isOnline" class="text-sm text-primary hover:underline">
                        Sync Now
                    </button>
                </div>
            </div>
        </header>
        <main class="container py-6">
            <div class="text-center text-muted-foreground">
                <p>
                    Session notes coming soon...
                </p>
            </div>
        </main>
    </div>
</template>