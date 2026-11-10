<script setup>
import { Input } from '@artisan-toolbox/front-awesome/components/WebAwesome';
import { onUnmounted, ref } from 'vue';
import { router } from '@inertiajs/vue3';
import { mosaicast } from '@artisan-toolbox/mosaicast';
import DemoAction from '@/components/demo/DemoAction.vue';
import DemoFrame from '@/components/demo/DemoFrame.vue';
import DeliveryLog from './DeliveryLog.vue';

const props = defineProps({
    scenario: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    endpoint: { type: String, required: true },
    eventNames: { type: Array, required: true },
    sources: { type: Array, required: true },
});

const message = ref('Order 42 is ready.');
const phase = ref('idle');
const error = ref('');
const received = ref([]);
const manual = ref([]);
const nativeDispatched = ref(0);
let activeRun = null;
let unsubscribe = [];

function stopListening() {
    unsubscribe.forEach((stop) => stop());
    unsubscribe = [];
}

function reset() {
    if (phase.value === 'requesting') return;
    stopListening();
    activeRun = null;
    phase.value = 'idle';
    error.value = '';
    received.value = [];
    manual.value = [];
    nativeDispatched.value = 0;
}

function start() {
    if (phase.value === 'requesting') return;
    reset();
    activeRun = crypto.randomUUID();
    phase.value = 'requesting';

    unsubscribe = props.eventNames.map((name) =>
        mosaicast().on(name, (payload, source) => {
            if (payload.runId === activeRun) received.value.push({ name, payload, source });
        }),
    );

    router.post(
        props.endpoint,
        { scenario: props.scenario, message: message.value, runId: activeRun },
        {
            only: ['mosaicast', 'demoResult'],
            preserveState: true,
            preserveScroll: true,
            preserveUrl: true,
            replace: true,
            onSuccess(page) {
                const result = page.props.demoResult;
                if (result?.runId !== activeRun) return;
                nativeDispatched.value = result.nativeDispatched;
                manual.value = result.manualEvents;
                phase.value = 'complete';
            },
            onError(errors) {
                error.value = Object.values(errors).join(' ');
                phase.value = 'failed';
            },
            onCancel() {
                error.value = 'The visit was canceled. Start this example again.';
                phase.value = 'failed';
            },
            onFinish() {
                stopListening();
                if (phase.value === 'requesting') {
                    error.value =
                        'The request did not complete. Check the connection and try again.';
                    phase.value = 'failed';
                }
            },
        },
    );
}

onUnmounted(stopListening);
</script>

<template>
    <DemoFrame :title="title" :description="description" :sources="sources">
        <form class="flex flex-wrap items-end gap-3" @submit.prevent="start">
            <Input
                v-model="message"
                label="Message for both paths"
                hint="Both delivery paths receive this same message."
                :disabled="phase === 'requesting'"
                type="text"
                required
                maxlength="120"
                class="min-w-0 flex-1" />
            <DemoAction :busy="phase === 'requesting'" @click="start"
                >Run {{ scenario === 'multiple' ? 'three events' : 'one event' }}</DemoAction
            >
            <DemoAction
                variant="neutral"
                :disabled="phase === 'requesting' || phase === 'idle'"
                @click="reset"
                >Reset</DemoAction
            >
        </form>
        <div
            role="status"
            aria-live="polite"
            class="my-4 text-sm text-slate-600 dark:text-slate-400">
            <p v-if="phase === 'idle'">Ready. No request has started.</p>
            <p v-else-if="phase === 'requesting'">Sending one same-session Inertia request…</p>
            <p v-else-if="phase === 'complete'">
                Laravel dispatched {{ nativeDispatched }}. The manual Inertia prop contains
                {{ manual.length }}. Mosaicast listeners received {{ received.length }} of
                {{ eventNames.length }}.
            </p>
            <p v-else class="text-red-700 dark:text-red-300">{{ error }}</p>
        </div>
        <div class="grid min-w-0 gap-3 @xl:grid-cols-2">
            <DeliveryLog
                title="Native Laravel + manual Inertia prop"
                description="Laravel events run on the server. This controller explicitly returns the same envelopes in demoResult.manualEvents. That prop is the browser bridge."
                :events="manual"
                empty="No response prop received. A native event alone does not notify this browser." />
            <DeliveryLog
                title="Mosaicast listener"
                description="The installed Vue plugin consumes mosaicast.events from the same response. These entries come only from mosaicast().on()."
                :events="received" />
        </div>
    </DemoFrame>
</template>
