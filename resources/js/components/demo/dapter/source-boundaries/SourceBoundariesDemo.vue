<script setup>
import { DataAdapter } from '@artisan-toolbox/dapter';
import { Button, Spinner, Tag } from '@artisan-toolbox/front-awesome/components/WebAwesome';
import { ref } from 'vue';
import DemoFrame from '@/components/demo/DemoFrame.vue';
import CodeExample from '@/components/docs/CodeExample.vue';
import { decodeRecord } from './records';
import clientSource from './SourceBoundariesDemo.vue?raw';
import decoderSource from './records.js?raw';
import declarationSource from '../../../../../../app/DataSources/Dapter/ScopedRecords.php?raw';
import fixtureSource from '../../../../../../app/Demo/Dapter/SourceBoundaries/FixtureRecords.php?raw';
import projectionSource from '../../../../../../app/Demo/Dapter/SourceBoundaries/PublicRecord.php?raw';

const running = ref(false);
const sources = [
    { label: 'SourceBoundariesDemo.vue', language: 'vue', code: clientSource },
    { label: 'records.js', language: 'js', code: decoderSource },
    { label: 'ScopedRecords.php', language: 'php', code: declarationSource },
    { label: 'FixtureRecords.php', language: 'php', code: fixtureSource },
    { label: 'PublicRecord.php', language: 'php', code: projectionSource },
];
</script>

<template>
    <DemoFrame
        data-search-exclude
        title="Scoped public records"
        description="Read the fixed studio-north projection from a fictional two-studio fixture."
        :sources="sources">
        <div class="flex min-w-0 flex-col gap-5">
            <div class="flex flex-wrap gap-3">
                <Button :disabled="running" @click="running = true">Start example</Button>
                <Button variant="neutral" @click="running = false">Reset</Button>
            </div>
            <p v-if="!running" role="status">Ready. Start the example to read studio-north.</p>
            <DataAdapter
                v-if="running"
                source="Dapter.ScopedRecords"
                :decode-row="decodeRecord"
                v-slot="adapter">
                <div class="flex min-w-0 flex-col gap-4">
                    <Button :disabled="adapter.paging.loading" @click="adapter.paging.reload()"
                        >Reload records</Button
                    >
                    <p role="status">
                        <template v-if="adapter.paging.loading">
                            <Spinner class="mr-2 inline-block" /> Reading the scoped source.
                        </template>
                        <template v-else-if="adapter.ready">
                            Loaded {{ adapter.data.length }} scoped records. Each source ran once.
                        </template>
                    </p>
                    <p v-if="adapter.error" role="alert">
                        {{ adapter.error.message }} Use Reload records to try again.
                    </p>
                    <template v-if="adapter.ready">
                        <Tag variant="success">studio-north</Tag>
                        <ul data-scoped-records class="space-y-2">
                            <li v-for="record in adapter.data" :key="record.id">
                                {{ record.name }}. Source calls {{ record.source_calls }}.
                            </li>
                        </ul>
                        <CodeExample
                            label="Accepted public rows"
                            language="json"
                            :code="JSON.stringify(adapter.data, null, 2)" />
                    </template>
                </div>
            </DataAdapter>
        </div>
    </DemoFrame>
</template>
