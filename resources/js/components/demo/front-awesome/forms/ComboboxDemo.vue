<script setup>
import { ref } from 'vue';
import { Combobox } from '@artisan-toolbox/front-awesome/components/WebAwesome/Pro';

const value = ref('core');
const packageGroups = [
    {
        label: 'Foundations',
        options: [{ id: 'core', name: 'Core' }],
    },
    {
        label: 'Frontend',
        options: [
            { id: 'front-awesome', name: 'Front Awesome' },
            { id: 'mosaicast', name: 'Mosaicast' },
        ],
    },
];
</script>

<template>
    <div class="flex min-w-0 flex-col gap-4" data-docs-outline-exclude>
        <Combobox
            v-model="value"
            label="Package"
            :options="packageGroups"
            grouped
            option-value="id"
            option-label="name" />
        <output aria-live="polite">Selected package: {{ value }}</output>
    </div>
</template>
