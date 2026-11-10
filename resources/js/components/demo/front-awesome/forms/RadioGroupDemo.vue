<script setup>
import { ref } from 'vue';
import { RadioGroup, Radio } from '@artisan-toolbox/front-awesome/components/WebAwesome';

const value = ref('stable');
</script>

<template>
    <div class="flex min-w-0 flex-col gap-4" data-docs-outline-exclude>
        <div class="min-w-0">
            <RadioGroup label="Release channel" v-model="value">
                <Radio value="stable">Stable</Radio>
                <Radio value="preview">Preview</Radio>
            </RadioGroup>
        </div>
        <div class="min-w-0">
            <output>Selected channel: {{ value }}</output>
        </div>
    </div>
</template>
