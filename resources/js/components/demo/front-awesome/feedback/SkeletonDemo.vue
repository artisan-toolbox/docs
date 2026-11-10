<script setup>
import { ref } from 'vue';
import { Button, Skeleton } from '@artisan-toolbox/front-awesome/components/WebAwesome';

const animate = ref(false);
</script>

<template>
    <div class="flex min-w-0 flex-col gap-5" data-docs-outline-exclude>
        <div class="min-w-0">
            <div class="grid gap-5 sm:grid-cols-3">
                <div class="flex min-w-0 flex-col gap-3">
                    <p class="text-sm font-medium">Static</p>
                    <Skeleton effect="none" class="h-6 w-full max-w-48" />
                </div>
                <div class="flex min-w-0 flex-col gap-3">
                    <p class="text-sm font-medium">Pulse</p>
                    <Skeleton :effect="animate ? 'pulse' : 'none'" class="h-6 w-full max-w-48" />
                </div>
                <div class="flex min-w-0 flex-col gap-3">
                    <p class="text-sm font-medium">Sheen</p>
                    <Skeleton :effect="animate ? 'sheen' : 'none'" class="h-6 w-full max-w-48" />
                </div>
            </div>
        </div>
        <div class="min-w-0">
            <div class="min-w-0">
                <Button type="button" @click="animate = !animate">{{
                    animate ? 'Pause animations' : 'Animate placeholders'
                }}</Button>
            </div>
        </div>
        <div class="min-w-0">
            <output aria-live="polite">{{
                animate ? 'Pulse and sheen animations running.' : 'Animations paused.'
            }}</output>
        </div>
    </div>
</template>
