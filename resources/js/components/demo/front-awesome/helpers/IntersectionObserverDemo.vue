<script setup>
import { ref } from 'vue';
import { IntersectionObserver, Button } from '@artisan-toolbox/front-awesome/components/WebAwesome';

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
            <IntersectionObserver :disabled="!observing" @wa-intersect="events++">
                <div class="rounded border p-8">Observed panel</div>
            </IntersectionObserver>
        </div>
        <div class="min-w-0">
            <output>Intersection events: {{ events }}</output>
        </div>
    </div>
</template>
