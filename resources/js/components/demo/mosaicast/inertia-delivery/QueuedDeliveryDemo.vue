<script setup>
import { computed, onUnmounted, ref } from 'vue';
import { router, usePage } from '@inertiajs/vue3';
import { mosaicast } from '@artisan-toolbox/mosaicast';
import DemoAction from '@/components/demo/DemoAction.vue';
import DemoFrame from '@/components/demo/DemoFrame.vue';
import DeliveryLog from './DeliveryLog.vue';
import { connectDemoBroadcast, hasDemoBroadcast } from './broadcast';

const props = defineProps({
    configuration: { type: Object, required: true },
    sources: { type: Array, required: true },
});
const page = usePage();
const phase = ref('idle');
const received = ref([]);
const error = ref('');
const available = computed(
    () =>
        props.configuration.queueAllowed &&
        props.configuration.queueConfigured &&
        hasDemoBroadcast(),
);
let activeRun = null;
let unsubscribe = null;
let timeout = null;

function cleanup() {
    unsubscribe?.();
    unsubscribe = null;
    clearTimeout(timeout);
}

function reset() {
    cleanup();
    activeRun = null;
    phase.value = 'idle';
    received.value = [];
    error.value = '';
}

async function start() {
    if (!available.value || ['connecting', 'requesting', 'waiting'].includes(phase.value)) return;
    reset();
    activeRun = crypto.randomUUID();
    const runId = activeRun;
    phase.value = 'connecting';
    unsubscribe = mosaicast().on('demo.jobs.completed', (payload, source) => {
        if (payload.runId !== activeRun) return;
        received.value.push({ name: 'demo.jobs.completed', payload, source });
        phase.value = 'complete';
        cleanup();
    });

    try {
        await connectDemoBroadcast(
            page.props.mosaicastSessionIdentifier,
            props.configuration.channelPrefix,
        );
    } catch {
        if (activeRun !== runId) return;
        error.value =
            'The private broadcast subscription could not connect. Check Reverb and channel authorization before trying again.';
        phase.value = 'failed';
        cleanup();
        return;
    }

    if (activeRun !== runId) return;
    phase.value = 'requesting';
    router.post(
        props.configuration.queueUrl,
        {
            scenario: 'string',
            message: 'Order 42 finished in the queue.',
            runId: activeRun,
        },
        {
            only: ['mosaicast', 'demoResult'],
            preserveState: true,
            preserveScroll: true,
            preserveUrl: true,
            replace: true,
            onSuccess() {
                if (activeRun !== runId || phase.value === 'complete') return;
                phase.value = 'waiting';
                timeout = setTimeout(() => {
                    phase.value = 'failed';
                    error.value =
                        'No completion arrived within 20 seconds. The job may still be queued. Check Horizon, the demos worker, Reverb, and channel authorization. Reset only clears this display.';
                    cleanup();
                }, 20000);
            },
            onError(errors) {
                if (activeRun !== runId || phase.value === 'complete') return;
                error.value = Object.values(errors).join(' ');
                phase.value = 'failed';
                cleanup();
            },
            onCancel() {
                if (activeRun !== runId || phase.value === 'complete') return;
                error.value =
                    'The request was canceled. Check Horizon before starting another job.';
                phase.value = 'failed';
                cleanup();
            },
            onFinish() {
                if (activeRun !== runId) return;
                if (phase.value === 'requesting') {
                    phase.value = 'failed';
                    error.value =
                        'The request did not complete. Check the connection and Horizon before trying again.';
                    cleanup();
                }
            },
        },
    );
}

onUnmounted(() => {
    activeRun = null;
    cleanup();
});
</script>

<template>
    <DemoFrame
        title="A queued session event"
        description="A real Horizon worker processes one Redis job and broadcasts its completion to the captured session independently of Inertia props. The event can arrive before or after the HTTP response. No polling or simulated delivery runs here."
        :sources="sources">
        <div
            class="rounded-lg bg-slate-50 p-4 text-sm leading-6 text-slate-600 dark:bg-slate-900 dark:text-slate-400">
            <p>
                This optional example needs a configured Reverb server, the private-session
                authorization endpoint, and a Horizon worker consuming the Redis
                <code>demos</code> queue. This page does not start those services.
            </p>
            <p v-if="!configuration.queueAllowed" class="mt-2">
                Staff access is required. Sign in with a verified staff account, then reopen this
                guide. The source remains available to everyone.
            </p>
            <p v-else-if="!configuration.queueConfigured" class="mt-2">
                Server configuration is missing. The operator must configure the Reverb broadcaster,
                its backend application settings, and the Redis queue connection. The Inertia
                examples above work without these services.
            </p>
            <p v-else-if="!hasDemoBroadcast()" class="mt-2">
                Browser configuration is missing. The operator must provide the public
                VITE_REVERB_APP_KEY and VITE_REVERB_HOST settings during the frontend build, rebuild
                the assets, and reload this page. Laravel's configuration cache does not update
                compiled browser settings.
            </p>
            <p v-else class="mt-2">
                Configuration is present. Starting checks the private subscription before submitting
                the job. Worker availability is confirmed only when a completion arrives.
            </p>
        </div>
        <div class="my-4 flex flex-wrap gap-3">
            <DemoAction
                :disabled="!available || phase === 'waiting'"
                :busy="['connecting', 'requesting'].includes(phase)"
                @click="start"
                >Queue one job</DemoAction
            >
            <DemoAction
                variant="neutral"
                :disabled="['idle', 'connecting', 'requesting'].includes(phase)"
                @click="reset"
                >Reset display</DemoAction
            >
        </div>
        <p role="status" aria-live="polite" class="mb-4 text-sm text-slate-600 dark:text-slate-400">
            <template v-if="phase === 'idle'">No job has started.</template>
            <template v-else-if="phase === 'connecting'"
                >Connecting and authorizing this session's private channel…</template
            >
            <template v-else-if="phase === 'requesting'">Submitting one job to Redis…</template>
            <template v-else-if="phase === 'waiting'"
                >The response has finished. Waiting for the actual queued completion…</template
            >
            <template v-else-if="phase === 'complete'"
                >The queued completion arrived through {{ received[0]?.source }}.</template
            >
            <template v-else>{{ error }}</template>
        </p>
        <DeliveryLog
            title="Queued Mosaicast listener"
            description="A worker calls Mosaicast::toSession($identifier)->dispatch(). This log only changes when the public listener receives the event."
            :events="received" />
    </DemoFrame>
</template>
