<script setup>
import { onBeforeUnmount, ref } from 'vue';
import DemoAction from '@/components/demo/DemoAction.vue';
import DemoFrame from '@/components/demo/DemoFrame.vue';
import source from './ZplPreviewDemo.vue?raw';

const state = ref({ status: 'idle', url: '', error: '' });
let generation = 0;

function clear() {
    generation++;
    state.value = { status: 'idle', url: '', error: '' };
}

async function previewLabel() {
    const request = ++generation;
    state.value = { status: 'loading', url: '', error: '' };

    try {
        const { renderZpl } = await import('@artisan-toolbox/qztray');
        const url = await renderZpl('^XA^FO20,20^A0N,30,30^FDHello^FS^XZ', {
            widthMm: 100,
            heightMm: 150,
            dpmm: 8,
        });
        if (request === generation) state.value = { status: 'ready', url, error: '' };
    } catch (error) {
        if (request === generation) {
            state.value = {
                status: 'error',
                url: '',
                error: error instanceof Error ? error.message : 'Preview failed.',
            };
        }
    }
}

onBeforeUnmount(clear);
</script>

<template>
    <DemoFrame
        title="Try a local label preview"
        description="Render the Hello label in your browser. No printer or credentials are required."
        :sources="[{ label: 'ZplPreviewDemo.vue', language: 'vue', code: source }]"
        data-search-exclude>
        <div class="flex flex-col items-start gap-4">
            <div class="flex flex-wrap gap-2">
                <DemoAction :busy="state.status === 'loading'" @click="previewLabel">
                    Preview label
                </DemoAction>
                <DemoAction variant="neutral" :disabled="state.status === 'idle'" @click="clear">
                    Clear preview
                </DemoAction>
            </div>
            <p role="status" class="text-sm text-slate-600 dark:text-slate-400">
                {{
                    state.status === 'loading'
                        ? 'Rendering label…'
                        : state.status === 'ready'
                          ? 'Label preview ready.'
                          : 'Select Preview label to render Hello.'
                }}
            </p>
            <p v-if="state.error" role="alert" class="text-sm text-red-700 dark:text-red-300">
                {{ state.error }}
            </p>
            <img
                v-if="state.url"
                :src="state.url"
                alt="Label containing Hello"
                class="max-h-80 max-w-full rounded border border-slate-200 bg-white" />
        </div>
    </DemoFrame>
</template>
