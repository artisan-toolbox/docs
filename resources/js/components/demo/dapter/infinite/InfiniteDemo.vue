<script setup>
import { computed, ref } from 'vue';
import { useRemember } from '@inertiajs/vue3';
import { Button } from '@artisan-toolbox/front-awesome/components/WebAwesome';
import { route } from 'ziggy-js';
import DemoFrame from '@/components/demo/DemoFrame.vue';
import InfiniteSession from './InfiniteSession.vue';
import JoinedSession from './JoinedSession.vue';
import client from './InfiniteSession.vue?raw';
import joinedClient from './JoinedSession.vue?raw';
import cases from '../../../../../../app/Demo/Dapter/Infinite/cases.json';
const declarations = import.meta.glob(
    '../../../../../../app/DataSources/Dapter/{Infinite*,PagingSimple,PagingCursor,ComposedJoin}.php',
    { query: '?raw', import: 'default', eager: true },
);
const helpers = import.meta.glob(
    '../../../../../../app/Demo/Dapter/{Infinite/*.php,Paging/Records.php,Composed/SqliteRecords.php}',
    { query: '?raw', import: 'default', eager: true },
);
const props = defineProps({ scenario: { type: String, required: true } });
const example = computed(() => cases.find((item) => item.id === props.scenario));
const consent = useRemember({ running: false }, `dapter-infinite-consent-${props.scenario}`);
const fixtureBusy = ref(false);
const fixtureError = ref('');
const sources = computed(() => [
    {
        label: props.scenario === 'InfiniteJoined' ? 'JoinedSession.vue' : 'InfiniteSession.vue',
        language: 'vue',
        code: props.scenario === 'InfiniteJoined' ? joinedClient : client,
    },
    ...Object.entries(declarations)
        .filter(
            ([path]) =>
                path.endsWith(`/${example.value.source.split('.').at(-1)}.php`) ||
                (props.scenario === 'InfiniteJoined'
                    ? path.endsWith('/ComposedJoin.php')
                    : path.endsWith('/PagingSimple.php') ||
                      (props.scenario === 'InfiniteCursor' && path.endsWith('/PagingCursor.php'))),
        )
        .map(([path, code]) => ({ label: path.split('/').at(-1), language: 'php', code })),
    ...Object.entries(helpers)
        .filter(([path]) =>
            props.scenario === 'InfiniteJoined'
                ? path.endsWith('/SqliteRecords.php')
                : path.endsWith('/Records.php') ||
                  (props.scenario === 'InfiniteRecovery' && path.endsWith('/State.php')),
        )
        .map(([path, code]) => ({ label: path.split('/').at(-1), language: 'php', code })),
]);
async function reset() {
    consent.value.running = false;
    fixtureError.value = '';
    if (props.scenario !== 'InfiniteRecovery') return;
    fixtureBusy.value = true;
    try {
        const response = await fetch(route('demo.dapter.infinite.reset'), {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                Accept: 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                'X-XSRF-TOKEN': decodeURIComponent(
                    document.cookie
                        .split('; ')
                        .find((cookie) => cookie.startsWith('XSRF-TOKEN='))
                        ?.slice(11) ?? '',
                ),
            },
        });
        if (!response.ok) throw new Error('Reset failed.');
    } catch {
        fixtureError.value = 'Could not reset the fictional service. Try Reset again.';
    } finally {
        fixtureBusy.value = false;
    }
}
</script>
<template>
    <DemoFrame
        :title="example.title"
        :description="example.description"
        :sources="sources"
        :data-infinite-demo="scenario"
        data-search-exclude>
        <div class="flex min-w-0 flex-col gap-4">
            <div class="flex flex-wrap gap-2">
                <Button
                    :disabled="consent.running || fixtureBusy || !!fixtureError"
                    @click="consent.running = true"
                    >Start example</Button
                >
                <Button variant="neutral" :disabled="fixtureBusy" @click="reset"
                    >Reset example</Button
                >
            </div>
            <p v-if="fixtureError" role="alert">{{ fixtureError }}</p>
            <JoinedSession
                v-if="consent.running && scenario === 'InfiniteJoined'"
                :source="example.source" />
            <InfiniteSession
                v-else-if="consent.running"
                :source="example.source"
                :axis="scenario === 'InfiniteCursor' ? 'x' : 'y'"
                :fill="scenario === 'InfiniteFill'"
                :recovery="scenario === 'InfiniteRecovery'" />
            <p v-else role="status">Ready. Start example to read isolated fictional records.</p>
        </div>
    </DemoFrame>
</template>
