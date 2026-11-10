<script setup>
import { ref } from 'vue';
import { AnimatedImage, Button } from '@artisan-toolbox/front-awesome/components/WebAwesome';

const loaded = ref(false);
const error = ref(false);
const status = ref('Ready');
</script>

<template>
    <div class="flex min-w-0 flex-col gap-4" data-docs-outline-exclude>
        <div class="min-w-0">
            <Button
                @click="
                    loaded = !loaded;
                    error = false;
                    status = loaded ? 'Loading local image...' : 'Ready';
                "
                >{{ loaded ? 'Reset image' : 'Load image' }}</Button
            >
        </div>
        <div class="min-w-0">
            <AnimatedImage
                v-if="loaded"
                class="h-24 w-24"
                src="/examples/front-awesome/status.gif"
                alt="A square alternating between light and dark"
                :play="false"
                @wa-load="status = 'Image loaded. Use the native play control to animate it.'"
                @wa-error="
                    error = true;
                    status = 'Image unavailable';
                " />
        </div>
        <div class="min-w-0">
            <output aria-live="polite">{{ status }}</output>
        </div>
        <div class="min-w-0">
            <p v-if="error" role="alert">Image unavailable. Reset and try again.</p>
        </div>
    </div>
</template>
