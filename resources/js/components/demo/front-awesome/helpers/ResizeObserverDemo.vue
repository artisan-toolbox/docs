<script setup>
import { ref } from 'vue';
import { ResizeObserver, Button } from '@artisan-toolbox/front-awesome/components/WebAwesome';

const observing = ref(false);
const events = ref(0);
</script>

<template>
    <div class="flex min-w-0 flex-col gap-4" data-docs-outline-exclude>
        <div class="min-w-0">
            <Button @click="observing = !observing">{{
                observing ? 'Stop observing' : 'Start observing'
            }}</Button>
        </div>
        <div class="min-w-0">
            <ResizeObserver :disabled="!observing" @wa-resize="events++">
                <div class="h-28 w-48 max-w-full resize overflow-auto rounded border p-4">
                    Drag this panel corner.
                </div>
            </ResizeObserver>
        </div>
        <div class="min-w-0">
            <output>Resize events: {{ events }}</output>
        </div>
    </div>
</template>
