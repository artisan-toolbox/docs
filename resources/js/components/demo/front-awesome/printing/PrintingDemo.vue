<script setup>
import { onBeforeUnmount, ref } from 'vue';
import { useHttp } from '@inertiajs/vue3';
import { route } from 'ziggy-js';
import { Button, Checkbox, Details } from '@artisan-toolbox/front-awesome/components/WebAwesome';
import { createPrinting, PrintDrawer } from '@artisan-toolbox/front-awesome/printing';
import DemoFrame from '@/components/demo/DemoFrame.vue';
import controllerSource from '../../../../../../app/Demo/FrontAwesome/Printing/DocumentsController.php?raw';
import clientSource from './PrintingDemo.vue?raw';

const form = useHttp({});
const offline = ref(false);
const uncertain = ref(false);
const confirmSteps = ref(false);
const showSummary = ref(false);
const result = ref(null);
const submissions = ref(0);
const previewError = ref('');
const printing = createPrinting({
    storage: false,
    previewOptions: {
        escpos: { widthDots: 576 },
        zpl: { widthMm: 100, heightMm: 50, dpmm: 8 },
    },
    messages: {
        connected: 'Demonstration destination ready',
        connect: 'Connect demonstration destination',
        connecting: 'Connecting demonstration destination…',
        connectionFailed:
            'The simulated connection is unavailable. Disable the connection failure and reconnect.',
        submit: 'Simulate sending document',
        submitting: 'Simulating submission…',
        accepted:
            'The demonstration accepted this request. Nothing was sent to a physical printer.',
        statusSubmitted: 'Simulation accepted',
    },
    bridge: {
        async prepare(document, options) {
            const { preparePrintDocument } = await import('@artisan-toolbox/qztray');
            return preparePrintDocument(document, {
                requestInit:
                    options?.requestInit ??
                    (document.type === 'pdf' ? options?.pdf?.requestInit : undefined),
            });
        },
        async connect() {
            if (offline.value) throw new Error('Demonstration connection failure.');
        },
        async getPrinters() {
            return ['Demonstration printer'];
        },
        async render(document, options) {
            previewError.value = '';
            try {
                const { renderPrintRequest } = await import('@artisan-toolbox/qztray');
                return await renderPrintRequest(document, options);
            } catch (error) {
                previewError.value =
                    error instanceof Error ? error.message : 'Local rendering failed.';
                throw error;
            }
        },
        async print() {
            submissions.value++;
            if (uncertain.value) throw new Error('Demonstration submission outcome unknown.');
        },
    },
});

function open() {
    if (printing.currentJob.value) {
        printing.show();
        return;
    }
    result.value = null;
    const source = form.post(route('demo.front-awesome.printing.documents')).then((documents) => {
        if (!documents) throw new Error('Could not generate demonstration documents.');
        return documents;
    });
    const job = printing.job({
        title: 'Order ATB-1001 demonstration',
        autoAdvance: !confirmSteps.value,
        showSummary: showSummary.value,
        source,
        steps: [
            { type: 'escpos', flavor: 'base64', key: 'receipt', title: 'Receipt' },
            { type: 'pdf', flavor: 'base64', key: 'invoice', title: 'Invoice and packing list' },
            { type: 'zpl', key: 'labels', title: 'Shipping label' },
        ],
    });
    void job.finished.then((value) => {
        result.value = value;
    });
}

onBeforeUnmount(() => {
    form.cancel();
    printing.dispose();
});
</script>

<template>
    <DemoFrame
        title="Review a complete print job"
        description="Real PHP generation and local previews. Every destination and submission in this demonstration is simulated."
        :sources="[
            { label: 'PrintingDemo.vue', language: 'vue', code: clientSource },
            { label: 'DocumentsController.php', language: 'php', code: controllerSource },
        ]"
        data-printing-demo
        data-search-exclude>
        <div class="flex flex-col gap-4">
            <div><Button variant="brand" @click="open">Open print demonstration</Button></div>
            <div><Checkbox v-model="confirmSteps">Confirm between documents</Checkbox></div>
            <div><Checkbox v-model="showSummary">Show final report</Checkbox></div>
            <Details summary="Simulate failures">
                <div class="flex flex-col gap-3">
                    <div><Checkbox v-model="offline">Simulate connection failure</Checkbox></div>
                    <div>
                        <Checkbox v-model="uncertain"
                            >Simulate missing submission response</Checkbox
                        >
                    </div>
                </div>
            </Details>
            <p role="status" class="text-sm text-slate-600 dark:text-slate-400">
                {{ submissions }} simulated submissions. No physical printing.
            </p>
            <ul
                v-if="showSummary && result"
                aria-label="Demonstration results"
                class="list-inside list-disc text-sm">
                <li v-for="step in result.steps" :key="step.id">
                    {{ step.title }}. {{ step.status }}.
                </li>
            </ul>
        </div>
        <PrintDrawer :service="printing">
            <template #settings-extra>
                <p v-if="previewError" role="alert">{{ previewError }}</p>
            </template>
        </PrintDrawer>
    </DemoFrame>
</template>
