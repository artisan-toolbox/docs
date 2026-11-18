<script setup>
import { ref } from 'vue';
import { DataAdapter } from '@artisan-toolbox/dapter';
import { Button } from '@artisan-toolbox/front-awesome/components/WebAwesome';
import DemoFrame from '@/components/demo/DemoFrame.vue';
import source from '../../../../../../app/DataSources/Dapter/Quickstart.php?raw';
import client from './QuickstartUsageDemo.vue?raw';

const started = ref(false);
const sources = [
    { label: 'app/DataSources/Dapter/Quickstart.php', language: 'php', code: source },
    { label: 'QuickstartUsageDemo.vue', language: 'vue', code: client },
];
</script>

<template>
    <DemoFrame
        title="Page through 23 notebooks"
        :sources="sources"
        data-quickstart-usage
        data-search-exclude>
        <Button v-if="!started" @click="started = true">Start example</Button>
        <DataAdapter v-else source="Dapter.Quickstart" v-slot="catalog">
            <div class="flex flex-col items-start gap-3">
                <p role="status" v-if="catalog.paging.loading">Loading notebooks…</p>
                <p v-if="catalog.error" role="alert">
                    {{ catalog.error.message }}
                    <Button @click="catalog.paging.reload()">Retry</Button>
                </p>
                <template v-if="catalog.ready">
                    <p role="status">
                        Page {{ catalog.paging.current }} of {{ catalog.paging.pages }}.
                    </p>
                    <ul aria-label="Notebooks" class="list-disc pl-6">
                        <li v-for="row in catalog.data" :key="row.id">{{ row.name }}</li>
                    </ul>
                    <div class="flex gap-2">
                        <Button
                            :disabled="!catalog.paging.has_previous || catalog.paging.loading"
                            @click="catalog.paging.goToPrevious()"
                            >Previous</Button
                        >
                        <Button
                            :disabled="!catalog.paging.has_next || catalog.paging.loading"
                            @click="catalog.paging.goToNext()"
                            >Next</Button
                        >
                    </div>
                </template>
                <Button variant="neutral" @click="started = false">Reset example</Button>
            </div>
        </DataAdapter>
    </DemoFrame>
</template>
