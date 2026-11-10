<script setup>
import { ref } from 'vue';
import { Chart } from '@artisan-toolbox/front-awesome/components/WebAwesome/Pro';
import { Button } from '@artisan-toolbox/front-awesome/components/WebAwesome';

const loaded = ref(false);
const config = {
    type: 'bar',
    data: {
        labels: ['Core', 'Front Awesome', 'Mosaicast'],
        datasets: [
            {
                label: 'Example count',
                data: [3, 5, 4],
            },
        ],
    },
    options: {
        animation: false,
    },
};
</script>

<template>
    <div class="flex min-w-0 flex-col gap-4" data-docs-outline-exclude>
        <div class="min-w-0">
            <Button @click="loaded = !loaded">{{ loaded ? 'Reset chart' : 'Render chart' }}</Button>
        </div>
        <div class="min-w-0">
            <Chart
                v-if="loaded"
                label="Example package counts"
                description="Synthetic values for Core, Front Awesome, and Mosaicast"
                :config="config"
                :without-animation="true"
                class="block h-72 min-w-0" />
        </div>
        <div class="min-w-0">
            <p>Example counts: Core 3, Front Awesome 5, Mosaicast 4.</p>
        </div>
    </div>
</template>
