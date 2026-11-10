<script setup>
import { ref } from 'vue';
import { NumberInput, Button } from '@artisan-toolbox/front-awesome/components/WebAwesome';

const initialValue = '2';
const value = ref(initialValue);
</script>

<template>
    <div class="flex min-w-0 flex-col gap-4" data-docs-outline-exclude>
        <div class="min-w-0">
            <NumberInput label="Quantity" v-model="value" :min="1" :max="10" />
        </div>
        <div class="min-w-0">
            <output aria-live="polite">Current value: {{ value }}</output>
        </div>
        <div class="min-w-0">
            <Button type="button" @click="value = initialValue">Reset</Button>
        </div>
    </div>
</template>
