<script setup>
import { ref } from 'vue';
import { DatePicker } from '@artisan-toolbox/front-awesome/components/WebAwesome/Pro';
import { Button } from '@artisan-toolbox/front-awesome/components/WebAwesome';

const value = ref('2026-11-09');
</script>

<template>
    <div class="flex min-w-0 flex-col gap-4" data-docs-outline-exclude>
        <div class="min-w-0">
            <DatePicker
                aria-label="Release date"
                v-model="value"
                min="2026-11-01"
                max="2026-11-30"
                today="2026-11-09" />
        </div>
        <div class="min-w-0">
            <output>Selected date: {{ value }}</output>
        </div>
        <div class="min-w-0">
            <Button @click="value = '2026-11-09'">Reset date</Button>
        </div>
    </div>
</template>
