<script setup>
import { ref } from 'vue';
import { TagInput, Button } from '@artisan-toolbox/front-awesome/components/WebAwesome';

const initialValue = ['laravel', 'vue'];
const value = ref([...initialValue]);
</script>

<template>
    <div class="flex min-w-0 flex-col gap-4" data-docs-outline-exclude>
        <div class="min-w-0">
            <TagInput label="Keywords" v-model="value" placeholder="Add a keyword" />
        </div>
        <div class="min-w-0">
            <output aria-live="polite">Current value: {{ value.join(', ') }}</output>
        </div>
        <div class="min-w-0">
            <Button type="button" @click="value = [...initialValue]">Reset</Button>
        </div>
    </div>
</template>
