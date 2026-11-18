<script setup>
import { ref } from 'vue';
import { Button } from '@artisan-toolbox/front-awesome/components/WebAwesome';
import DemoFrame from '@/components/demo/DemoFrame.vue';
import DataViewSession from './DataViewSession.vue';
import client from './DataViewSession.vue?raw';
import catalog from './catalog.js?raw';
const source = ref(null);
const sources = [
    { label: 'DataViewSession.vue', language: 'vue', code: client },
    { label: 'catalog.js', language: 'javascript', code: catalog },
];
</script>

<template>
    <DemoFrame
        data-testid="data-view-demo"
        data-search-exclude
        title="Notebook catalog"
        description="Start the catalog, then compare the same accepted page in table, grid, and list layouts."
        :sources="sources">
        <div class="flex min-w-0 flex-col gap-4">
            <div class="flex flex-wrap gap-2">
                <template v-if="!source">
                    <Button variant="brand" @click="source = 'Dapter.CollectionFluent'"
                        >Start catalog</Button
                    >
                    <Button
                        variant="neutral"
                        appearance="outlined"
                        @click="source = 'Dapter.CollectionGateDeny'"
                        >Try denied source</Button
                    >
                </template>
                <Button v-else variant="neutral" size="s" @click="source = null">Reset</Button>
            </div>
            <DataViewSession v-if="source" :source="source" />
            <p v-else role="status" class="text-sm">No source is running.</p>
        </div>
    </DemoFrame>
</template>
