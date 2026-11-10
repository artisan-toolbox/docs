<script setup>
import { ref } from 'vue';
import { Include, Button } from '@artisan-toolbox/front-awesome/components/WebAwesome';

const loaded = ref(false);
const status = ref('Ready');
</script>

<template>
    <div class="flex min-w-0 flex-col gap-4" data-docs-outline-exclude>
        <div class="min-w-0">
            <Button
                @click="
                    loaded = !loaded;
                    status = loaded ? 'Loading local content...' : 'Ready';
                "
                >{{ loaded ? 'Reset include' : 'Load local content' }}</Button
            >
        </div>
        <div class="min-w-0">
            <Include
                v-if="loaded"
                src="/examples/front-awesome/include.html"
                @wa-load="status = 'Local content loaded'"
                @wa-error="status = 'Content unavailable. Reset and try again.'" />
        </div>
        <div class="min-w-0">
            <output aria-live="polite">{{ status }}</output>
        </div>
    </div>
</template>
