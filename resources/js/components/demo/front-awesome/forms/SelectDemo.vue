<script setup>
import { ref } from 'vue';
import { Select, Option } from '@artisan-toolbox/front-awesome/components/WebAwesome';

const value = ref('core');
</script>

<template>
    <div class="flex min-w-0 flex-col gap-4" data-docs-outline-exclude>
        <div class="min-w-0">
            <Select label="Package" v-model="value">
                <Option value="core">Core</Option>
                <Option value="front-awesome">Front Awesome</Option>
                <Option value="unavailable" :disabled="true">Unavailable</Option>
            </Select>
        </div>
        <div class="min-w-0">
            <output>Selected package: {{ value }}</output>
        </div>
    </div>
</template>
