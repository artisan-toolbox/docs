<script setup>
import { Button } from '@artisan-toolbox/front-awesome/components/WebAwesome';
import { ref } from 'vue';
import DemoFrame from '@/components/demo/DemoFrame.vue';
import SharedAdapterSession from './SharedAdapterSession.vue';
import sessionSource from './SharedAdapterSession.vue?raw';
import controlsSource from './SharedControls.vue?raw';
import viewSource from '../listing/CatalogView.vue?raw';
import productsSource from '../listing/products.js?raw';

const running = ref(false);
const sources = [
    { label: 'SharedAdapterSession.vue', language: 'vue', code: sessionSource },
    { label: 'SharedControls.vue', language: 'vue', code: controlsSource },
    { label: 'CatalogView.vue', language: 'vue', code: viewSource },
    { label: 'products.js', language: 'js', code: productsSource },
];
</script>

<template>
    <DemoFrame
        data-search-exclude
        data-dapter-shared
        title="Shared adapter controls"
        description="One host, child controls, and a bound component share one catalog. A second named store stays independent. Start creates both stores; Reset disposes them."
        :sources="sources">
        <div class="flex min-w-0 flex-col gap-5">
            <div class="flex flex-wrap gap-3">
                <Button :disabled="running" @click="running = true">Start example</Button>
                <Button variant="neutral" @click="running = false">Reset</Button>
            </div>
            <p v-if="!running" role="status" class="text-sm">
                Ready. Start the example to create the two stores.
            </p>
            <SharedAdapterSession v-if="running" />
        </div>
    </DemoFrame>
</template>
