<script setup>
import { computed, onScopeDispose, ref } from 'vue';
import { Button } from '@artisan-toolbox/front-awesome/components/WebAwesome';
import DemoFrame from '@/components/demo/DemoFrame.vue';
import LiveSession from './LiveSession.vue';
import LivePropSession from './LivePropSession.vue';
import propClient from './LivePropSession.vue?raw';
import client from './LiveSession.vue?raw';
import requestSource from './request.js?raw';
import { fixtureRequest } from './request';
import { activeDemo, fixtureBusy as busy } from './session';
import sessionSource from './session.js?raw';
const props = defineProps({ scenario: { type: String, required: true } });
const running = computed(() => activeDemo.value === props.scenario);
const error = ref('');
onScopeDispose(() => {
    if (running.value) activeDemo.value = null;
});
const declarations = import.meta.glob('../../../../../../app/DataSources/Dapter/Live*.php', {
    query: '?raw',
    import: 'default',
    eager: true,
});
const helpers = import.meta.glob('../../../../../../app/Demo/Dapter/Live/*.php', {
    query: '?raw',
    import: 'default',
    eager: true,
});
const sources = computed(() => [
    { label: 'LiveSession.vue', language: 'vue', code: client },
    { label: 'LivePropSession.vue', language: 'vue', code: propClient },
    { label: 'session.js', language: 'js', code: sessionSource },
    { label: 'request.js', language: 'js', code: requestSource },
    ...Object.entries(declarations)
        .filter(
            ([path]) =>
                path.endsWith(`/${props.scenario}.php`) || path.endsWith('/LivePrivate.php'),
        )
        .map(([path, code]) => ({ label: path.split('/').at(-1), language: 'php', code })),
    ...Object.entries(helpers).map(([path, code]) => ({
        label: path.split('/').at(-1),
        language: 'php',
        code,
    })),
]);
async function start() {
    activeDemo.value = null;
    busy.value = true;
    error.value = '';
    try {
        await fixtureRequest('start');
        activeDemo.value = props.scenario;
    } catch (failure) {
        error.value = failure.message;
    } finally {
        busy.value = false;
    }
}
async function reset() {
    activeDemo.value = null;
    busy.value = true;
    error.value = '';
    try {
        await fixtureRequest('reset');
    } catch (failure) {
        error.value = failure.message;
    } finally {
        busy.value = false;
    }
}
</script>
<template>
    <DemoFrame
        :title="scenario"
        description="Fictional notebooks use a separate, expiring demo identity. LivePublic uses one globally fixed public row. Start creates no real account or application record. Starting another fixture stops the previous owner before changing the fictional identity."
        :sources="sources"
        :data-live-demo="scenario"
        data-search-exclude>
        <div class="flex min-w-0 flex-col gap-4">
            <div class="flex flex-wrap gap-2">
                <Button :disabled="running || busy" @click="start">Start example</Button
                ><Button variant="neutral" :disabled="busy" @click="reset">Reset example</Button>
            </div>
            <p v-if="error" role="alert">{{ error }}</p>
            <LivePropSession
                v-if="running && ['LiveAttributes', 'LivePollingProps'].includes(scenario)"
                :source="`Dapter.${scenario}`"
                :polling="scenario === 'LivePollingProps'" />
            <LiveSession
                v-else-if="running"
                :source="`Dapter.${scenario}`"
                :polling="scenario === 'LivePolling'" />
            <p v-else role="status">Ready. Start example to create an isolated fictional reader.</p>
        </div>
    </DemoFrame>
</template>
