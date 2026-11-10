<script setup>
import { ref } from 'vue';
import { Checkbox, Button } from '@artisan-toolbox/front-awesome/components/WebAwesome';

const checked = ref(false);
</script>

<template>
    <div class="flex min-w-0 flex-col gap-4" data-docs-outline-exclude>
        <div class="min-w-0">
            <Checkbox v-model="checked">Receive release updates</Checkbox>
        </div>
        <div class="min-w-0">
            <output aria-live="polite">Enabled: {{ checked }}</output>
        </div>
        <div class="min-w-0">
            <Button type="button" @click="checked = false">Reset</Button>
        </div>
    </div>
</template>
