<script setup>
import { computed } from 'vue';
import {
    Button,
    Details,
    Spinner,
    Tag,
} from '@artisan-toolbox/front-awesome/components/WebAwesome';
import DemoFrame from '@/components/demo/DemoFrame.vue';
import CodeExample from '@/components/docs/CodeExample.vue';
import { useProtocolRequest } from '../protocol/useProtocolRequest';
import cases from '../../../../../../app/Demo/Dapter/Composed/cases.json';
import clientSource from './ComposedDemo.vue?raw';
import transportSource from '../protocol/useProtocolRequest.js?raw';

import recordsSource from '../../../../../../app/Demo/Dapter/Composed/Records.php?raw';

const declarations = import.meta.glob('../../../../../../app/DataSources/Dapter/Composed*.php', {
    query: '?raw',
    import: 'default',
    eager: true,
});
const helpers = import.meta.glob('../../../../../../app/Demo/Dapter/Composed/*.php', {
    query: '?raw',
    import: 'default',
    eager: true,
});
const props = defineProps({ scenario: { type: String, required: true } });
const example = computed(() => cases.find((item) => item.id === props.scenario));
const { state, run, reset } = useProtocolRequest();
const receipt = computed(() => {
    if (state.value.status !== 'received') return null;
    try {
        return JSON.parse(state.value.responseJson);
    } catch {
        return null;
    }
});
const hasListing = computed(
    () =>
        state.value.httpStatus === 200 &&
        Array.isArray(receipt.value?.data) &&
        !!receipt.value.paging,
);
const sources = computed(() => [
    { label: 'ComposedDemo.vue', language: 'vue', code: clientSource },
    { label: 'useProtocolRequest.js', language: 'js', code: transportSource },
    { label: 'Records.php', language: 'php', code: recordsSource },
    ...Object.entries(helpers)
        .filter(([path]) => !path.endsWith('/Records.php'))
        .map(([path, code]) => ({ label: path.split('/').at(-1), language: 'php', code })),
    ...Object.entries(declarations)
        .filter(
            ([path]) =>
                path.endsWith(
                    `/${(example.value.source_class ?? example.value.source).split('.').at(-1)}.php`,
                ) ||
                path.endsWith('/ComposedAttributes.php') ||
                (example.value.guide === 'dapter/composed-declarations' &&
                    path.endsWith('/ComposedCatalog.php')),
        )
        .map(([path, code]) => ({ label: path.split('/').at(-1), language: 'php', code })),
]);
</script>

<template>
    <DemoFrame
        :title="example.title"
        :description="example.description"
        :sources="sources"
        :data-composed-scenario="scenario"
        data-search-exclude>
        <div class="flex min-w-0 flex-col gap-5">
            <div class="flex flex-wrap gap-3">
                <Button
                    :disabled="state.status === 'loading'"
                    @click="run(example.source, JSON.stringify(example.request))"
                    >Send request</Button
                >
                <Button
                    v-if="example.empty_request"
                    :disabled="state.status === 'loading'"
                    @click="run(example.source, JSON.stringify(example.empty_request))"
                    >Reject empty selection</Button
                >
                <Button variant="neutral" @click="reset">Reset</Button>
            </div>
            <p role="status" class="text-sm text-slate-600 dark:text-slate-400">
                <template v-if="state.status === 'idle'"
                    >Ready. Send the fixed version 2 request to start.</template
                >
                <template v-else-if="state.status === 'loading'"
                    ><Spinner class="mr-2 inline-block" /> Waiting for the server.</template
                >
                <template v-else-if="state.status === 'received'"
                    >Received HTTP {{ state.httpStatus }}.
                    <template v-if="hasListing">
                        {{ receipt.data.length }} rows on this page.
                        {{ receipt.paging?.filtered }} of {{ receipt.paging?.total }} match.
                        <span v-if="receipt.data.length"
                            >Row IDs: {{ receipt.data.map((row) => row.id).join(', ') }}.</span
                        >
                    </template>
                    <template v-else>{{ receipt?.error?.kind ?? 'Unexpected response' }}.</template>
                </template>
            </p>
            <p v-if="state.status === 'failed'" role="alert">
                The request could not complete. Check the connection and try again.
            </p>
            <Tag v-if="state.status === 'received'" :variant="hasListing ? 'success' : 'danger'"
                >HTTP {{ state.httpStatus }}</Tag
            >
            <Details summary="Request and response">
                <CodeExample
                    label="Fixed version 2 request"
                    language="json"
                    :code="
                        state.requestJson
                            ? JSON.stringify(JSON.parse(state.requestJson), null, 2)
                            : JSON.stringify(example.request, null, 2)
                    " />
                <CodeExample
                    v-if="state.status === 'received'"
                    label="Actual version 2 response"
                    language="json"
                    :code="state.responseJson" />
            </Details>
        </div>
    </DemoFrame>
</template>
