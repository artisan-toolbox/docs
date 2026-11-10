<script setup>
import { ref } from 'vue';
import { ZoomableFrame, Button } from '@artisan-toolbox/front-awesome/components/WebAwesome';

const loaded = ref(false);
const status = ref('Ready');
</script>

<template>
    <div class="flex min-w-0 flex-col gap-4" data-docs-outline-exclude>
        <div class="min-w-0">
            <Button
                @click="
                    loaded = !loaded;
                    status = loaded ? 'Loading local document...' : 'Ready';
                "
                >{{ loaded ? 'Close frame' : 'Open frame' }}</Button
            >
        </div>
        <div class="min-w-0">
            <ZoomableFrame
                v-if="loaded"
                label="Local layout preview"
                @load="status = 'Local document loaded'"
                @error="status = 'Document unavailable. Close and try again.'"
                srcdoc="<!doctype html>
            <html lang='en'>
            <title>Preview</title>
            <body>
            <h1>Local preview</h1>
            <p>Resize and zoom this document.</p>
            </body>
            </html>"
                sandbox=""
                :zoom="0.75"
                class="block h-72" />
        </div>
        <div class="min-w-0">
            <output aria-live="polite">{{ status }}</output>
        </div>
    </div>
</template>
