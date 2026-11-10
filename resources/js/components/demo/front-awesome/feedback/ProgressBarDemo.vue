<script setup>
import { ref } from 'vue';
import { ProgressBar, Button } from '@artisan-toolbox/front-awesome/components/WebAwesome';

const value = ref(25);
</script>

<template>
    <div class="flex min-w-0 flex-col gap-4" data-docs-outline-exclude>
        <div class="min-w-0">
            <ProgressBar :value="value" aria-label="Checklist progress">{{ value }}%</ProgressBar>
        </div>
        <div class="min-w-0">
            <Button @click="value = value === 100 ? 0 : value + 25">Advance or reset</Button>
        </div>
    </div>
</template>
