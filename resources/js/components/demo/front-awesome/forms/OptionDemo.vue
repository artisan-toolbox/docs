<script setup>
import { ref } from 'vue';
import { Option } from '@artisan-toolbox/front-awesome/components/WebAwesome';
import '@web.awesome.me/webawesome-pro/dist/components/select/select.js';

const value = ref('still');
</script>

<template>
    <div class="flex min-w-0 flex-col gap-4" data-docs-outline-exclude>
        <wa-select label="Water" value="still" @change="value = $event.currentTarget.value">
            <Option value="still">Still</Option>
            <Option value="sparkling">Sparkling</Option>
            <Option value="flavored" disabled>Flavored (unavailable)</Option>
        </wa-select>
        <output aria-live="polite">Selected water: {{ value }}</output>
    </div>
</template>
