<script setup>
import contract from '@artisan-toolbox/dapter/contracts/read-v1.json';
import { Button, Spinner, Tag } from '@artisan-toolbox/front-awesome/components/WebAwesome';
import DemoFrame from '@/components/demo/DemoFrame.vue';
import CodeExample from '@/components/docs/CodeExample.vue';
import { useProtocolRequest } from './useProtocolRequest';
import clientSource from './ReadDemo.vue?raw';
import transportSource from './useProtocolRequest.js?raw';
import declarationSource from '../../../../../../app/DataSources/Dapter/ProtocolRecords.php?raw';
import fixtureSource from '../../../../../../app/Demo/Dapter/Protocol/ProtocolFixture.php?raw';

const { state, run, reset } = useProtocolRequest();
const request = (id) => contract.requests.find((item) => item.id === id).request_json;
const sources = [
    { label: 'ReadDemo.vue', language: 'vue', code: clientSource },
    { label: 'useProtocolRequest.js', language: 'js', code: transportSource },
    { label: 'ProtocolRecords.php', language: 'php', code: declarationSource },
    { label: 'ProtocolFixture.php', language: 'php', code: fixtureSource },
    {
        label: 'Public protocol fixture input',
        language: 'json',
        code: JSON.stringify(contract.fixture, null, 2),
    },
];
</script>

<template>
    <DemoFrame
        data-search-exclude
        title="Read protocol v1"
        description="Send fixed raw JSON requests to the public three-record Collection fixture."
        :sources="sources">
        <div class="flex min-w-0 flex-col gap-5">
            <div class="flex flex-wrap gap-3">
                <Button
                    :disabled="state.status === 'loading'"
                    @click="run('Dapter.ProtocolRecords', request('defaults'))"
                    >Read source defaults</Button
                >
                <Button
                    :disabled="state.status === 'loading'"
                    @click="run('Dapter.ProtocolRecords', request('selected-size'))"
                    >Request allowed size 3</Button
                >
                <Button
                    :disabled="state.status === 'loading'"
                    @click="run('Dapter.ProtocolRecords', request('page-999'))"
                    >Request page 999</Button
                >
                <Button variant="neutral" @click="reset">Reset</Button>
            </div>
            <p role="status" class="text-sm text-slate-600 dark:text-slate-400">
                <template v-if="state.status === 'idle'"
                    >Ready. Choose a request to start.</template
                >
                <template v-else-if="state.status === 'loading'"
                    ><Spinner class="mr-2 inline-block" /> Waiting for the server.</template
                >
                <template v-else-if="state.status === 'received'"
                    >Received HTTP {{ state.httpStatus }}. Compare the original request with the
                    canonical acknowledgement below.</template
                >
            </p>
            <Tag
                v-if="state.status === 'received'"
                :variant="state.httpStatus === 200 ? 'success' : 'danger'"
                >HTTP {{ state.httpStatus }}</Tag
            >
            <p v-if="state.status === 'failed'" role="alert">
                The request could not complete. Check the connection and try again.
            </p>
            <CodeExample
                v-if="state.requestJson"
                label="Actual outgoing request bytes"
                language="json"
                :code="state.requestJson" />
            <CodeExample
                v-if="state.status === 'received'"
                label="Actual server response bytes"
                language="json"
                :code="state.responseJson" />
        </div>
    </DemoFrame>
</template>
