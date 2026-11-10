<script setup>
import { ref } from 'vue';
import { BubbleChart } from '@artisan-toolbox/front-awesome/components/WebAwesome/Pro';
import { Button } from '@artisan-toolbox/front-awesome/components/WebAwesome';

const loaded = ref(false);
const config = {
    type: 'bubble',
    data: {
        labels: ['Core', 'Front Awesome', 'Mosaicast'],
        datasets: [
            {
                label: 'Example count',
                data: [
                    {
                        x: 1,
                        y: 3,
                        r: 8,
                    },
                    {
                        x: 2,
                        y: 5,
                        r: 12,
                    },
                    {
                        x: 3,
                        y: 4,
                        r: 10,
                    },
                ],
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
            <BubbleChart
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
