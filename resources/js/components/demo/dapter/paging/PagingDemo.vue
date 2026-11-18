<script setup>
import { computed, ref } from 'vue';
import { useRemember } from '@inertiajs/vue3';
import { Button } from '@artisan-toolbox/front-awesome/components/WebAwesome';
import DemoFrame from '@/components/demo/DemoFrame.vue';
import PagingSession from './PagingSession.vue';
import PagingPropSession from './PagingPropSession.vue';
import propClient from './PagingPropSession.vue?raw';
import cases from '../../../../../../app/Demo/Dapter/Paging/cases.json';
import client from './PagingSession.vue?raw';
const declarations = import.meta.glob('../../../../../../app/DataSources/Dapter/Paging*.php', {
    query: '?raw',
    import: 'default',
    eager: true,
});
const helpers = import.meta.glob('../../../../../../app/Demo/Dapter/Paging/*.php', {
    query: '?raw',
    import: 'default',
    eager: true,
});
const props = defineProps({ scenario: { type: String, required: true } });
const example = computed(() => cases.find((item) => item.id === props.scenario));
const session = useRemember({ running: false }, `dapter-paging-consent-${props.scenario}`);
const fixtureBusy = ref(false);
const fixtureError = ref('');
const sources = computed(() => [
    { label: 'PagingSession.vue', language: 'vue', code: client },
    { label: 'PagingPropSession.vue', language: 'vue', code: propClient },
    ...Object.entries(declarations)
        .filter(
            ([path]) =>
                path.endsWith(`/${example.value.source.split('.').at(-1)}.php`) ||
                path.endsWith('/PagingSimple.php') ||
                path.endsWith('/PagingCursor.php'),
        )
        .map(([path, code]) => ({ label: path.split('/').at(-1), language: 'php', code })),
    ...Object.entries(helpers).map(([path, code]) => ({
        label: path.split('/').at(-1),
        language: 'php',
        code,
    })),
]);
async function reset() {
    session.value.running = false;
    fixtureError.value = '';
    if (props.scenario !== 'PagingRecovery') return;
    fixtureBusy.value = true;
    try {
        const response = await fetch('/demo/dapter/paging/reset', {
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
        fixtureError.value = 'Could not reset the fictional session. Try Reset again.';
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
        :data-paging-demo="scenario"
        data-search-exclude>
        <div class="flex min-w-0 flex-col gap-4">
            <div class="flex flex-wrap gap-2">
                <Button
                    :disabled="session.running || fixtureBusy || !!fixtureError"
                    @click="session.running = true"
                    >Start example</Button
                >
                <Button variant="neutral" :disabled="fixtureBusy" @click="reset"
                    >Reset example</Button
                >
            </div>
            <p v-if="fixtureError" role="alert">{{ fixtureError }}</p>
            <PagingPropSession
                v-if="session.running && scenario === 'PagingSimpleAttributes'"
                :source="example.source" />
            <PagingSession
                v-else-if="session.running"
                :source="example.source"
                :recovery="scenario === 'PagingRecovery'" />
            <p v-else role="status">Ready. Start example to read seven fictional notebooks.</p>
        </div>
    </DemoFrame>
</template>
