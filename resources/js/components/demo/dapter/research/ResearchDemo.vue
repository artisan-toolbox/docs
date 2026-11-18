<script setup>
import { computed } from 'vue';
import { Button, Spinner, Tag } from '@artisan-toolbox/front-awesome/components/WebAwesome';
import DemoFrame from '@/components/demo/DemoFrame.vue';
import CodeExample from '@/components/docs/CodeExample.vue';
import { useProtocolRequest } from '../protocol/useProtocolRequest';
import cases from '../../../../../../app/Demo/Dapter/Research/cases.json';
import clientSource from './ResearchDemo.vue?raw';
import transportSource from '../protocol/useProtocolRequest.js?raw';
import recordsSource from '../../../../../../app/Demo/Dapter/Literal/Records.php?raw';
import declarationSource from '../../../../../../app/Demo/Dapter/Literal/Declaration.php?raw';
import recordsJson from '../../../../../../app/Demo/Dapter/Literal/records.json?raw';

const declarations = import.meta.glob('../../../../../../app/DataSources/Dapter/Literal*.php', {
    query: '?raw',
    import: 'default',
    eager: true,
});
const props = defineProps({
    scenario: { type: String, required: true },
});
const example = computed(() => cases.find((item) => item.id === props.scenario));
const { state, run, reset } = useProtocolRequest();
const sources = computed(() => [
    { label: 'ResearchDemo.vue', language: 'vue', code: clientSource },
    { label: 'useProtocolRequest.js', language: 'js', code: transportSource },
    { label: 'Records.php', language: 'php', code: recordsSource },
    { label: 'records.json', language: 'json', code: recordsJson },
    { label: 'Declaration.php', language: 'php', code: declarationSource },
    ...Object.entries(declarations)
        .filter(([path]) => path.endsWith(`/${example.value.source.split('.').at(-1)}.php`))
        .map(([path, code]) => ({ label: path.split('/').at(-1), language: 'php', code })),
]);
</script>

<template>
    <DemoFrame
        :title="example.title"
        :description="example.description"
        :sources="sources"
        :data-research-scenario="scenario"
        data-search-exclude>
        <div class="flex min-w-0 flex-col gap-5">
            <div class="flex flex-wrap gap-3">
                <Button
                    :disabled="state.status === 'loading'"
                    @click="run(example.source, JSON.stringify(example.request))"
                    >Start</Button
                >
                <Button variant="neutral" @click="reset">Reset</Button>
            </div>
            <p role="status" class="text-sm text-slate-600 dark:text-slate-400">
                <template v-if="state.status === 'idle'"
                    >Ready. Start sends the fixed request. Opening this page reads no
                    records.</template
                >
                <template v-else-if="state.status === 'loading'"
                    ><Spinner class="mr-2 inline-block" /> Waiting for the server.</template
                >
                <template v-else-if="state.status === 'received'"
                    >Received HTTP {{ state.httpStatus }}. Compare actual rows, counts, and admitted
                    metadata with the expected result above.</template
                >
            </p>
            <p v-if="state.status === 'failed'" role="alert">
                The request could not complete. Check the connection and try Start again.
            </p>
            <Tag
                v-if="state.status === 'received'"
                :variant="state.httpStatus === 200 ? 'success' : 'danger'"
                >HTTP {{ state.httpStatus }}</Tag
            >
            <CodeExample
                label="Fixed version 2 request"
                language="json"
                :code="JSON.stringify(example.request, null, 2)" />
            <CodeExample
                v-if="state.status === 'received'"
                label="Actual version 2 response"
                language="json"
                :code="state.responseJson" />
        </div>
    </DemoFrame>
</template>
