<script setup>
import { ref } from 'vue';
import { DataAdapter } from '@artisan-toolbox/dapter';
import { Button } from '@artisan-toolbox/front-awesome/components/WebAwesome';
import DemoFrame from '@/components/demo/DemoFrame.vue';
import source from '../../../../../../app/DataSources/Dapter/Quickstart.php?raw';
import client from './ManualAppendDemo.vue?raw';

const started = ref(false);
const sources = [
    { label: 'app/DataSources/Dapter/Quickstart.php', language: 'php', code: source },
    { label: 'ManualAppendDemo.vue', language: 'vue', code: client },
];
</script>

<template>
    <DemoFrame
        title="Load more notebooks"
        :sources="sources"
        data-manual-append
        data-search-exclude>
        <Button v-if="!started" @click="started = true">Start example</Button>
        <DataAdapter
            v-else
            source="Dapter.Quickstart"
            :protocol="2"
            :infinite="true"
            :url="false"
            v-slot="catalog">
            <div class="flex flex-col items-start gap-3">
                <p role="status" v-if="catalog.paging.loading">Loading notebooks…</p>
                <p v-if="catalog.error" role="alert">{{ catalog.error.message }}</p>
                <template v-if="catalog.ready">
                    <p role="status">{{ catalog.data.length }} notebooks loaded.</p>
                    <ul aria-label="Loaded notebooks" class="list-disc pl-6">
                        <li v-for="row in catalog.data" :key="row.id">{{ row.name }}</li>
                    </ul>
                </template>
                <Button
                    v-if="catalog.infinite?.status === 'paused'"
                    @click="catalog.infinite.retry()"
                    >Retry append</Button
                >
                <Button v-else-if="catalog.error" @click="catalog.paging.reload()"
                    >Retry listing</Button
                >
                <Button
                    v-else-if="catalog.ready && catalog.infinite"
                    :disabled="catalog.infinite.status !== 'idle'"
                    @click="catalog.infinite.append()"
                    >Load more</Button
                >
                <Button variant="neutral" @click="started = false">Reset example</Button>
            </div>
        </DataAdapter>
    </DemoFrame>
</template>
