<script setup>
import { ref } from 'vue';
import { useDataAdapter } from '@artisan-toolbox/dapter';
import { DataView } from '@artisan-toolbox/front-awesome/data-view';
import { Button } from '@artisan-toolbox/front-awesome/components/WebAwesome';
const viewport = ref(null);
const sharedUrl = ref(null);
const catalog = useDataAdapter('Dapter.VueCatalog', {
    protocol: 2,
    id: 'saved-notebooks',
    url: true,
    scrollContainer: viewport,
});
const table = {
    table: {
        columns: [
            { field: 'name', label: 'Notebook' },
            { field: 'category', label: 'Category' },
        ],
    },
};
const list = { list: {} };
const paper = {
    version: 2,
    fields: { category: { filters: { category: { value: 'paper' } } } },
    global: {},
    searchMatch: 'all',
    order: { kind: 'default' },
    paging: { mode: 'offset', current: 1, per_page: 4 },
};
</script>
<template>
    <div class="flex min-w-0 flex-col gap-4">
        <div class="flex flex-wrap gap-2">
            <Button :disabled="!catalog.paging.has_next" @click="catalog.paging.goToNext()"
                >Next saved page</Button
            >
            <Button @click="catalog.replaceState(paper)">Use saved paper snapshot</Button
            ><Button @click="catalog.resetState()">Restore server defaults</Button>
            <Button @click="sharedUrl = catalog.share()">Create share URL</Button>
        </div>
        <p v-if="sharedUrl" class="break-all" data-share-url>{{ sharedUrl }}</p>
        <div
            ref="viewport"
            tabindex="0"
            data-owner-scroll
            role="region"
            aria-label="Notebook scroll region"
            class="h-40 overflow-auto">
            <DataView :adapter="catalog" :views="table" row-key="id" label="Saved notebook table" />
        </div>
        <DataView :adapter="catalog" :views="list" row-key="id" label="Same notebooks as a list">
            <template #toolbar><h3>List preview</h3></template
            ><template #pagination="{ adapter }"
                ><p>Page {{ adapter.paging.current }}.</p></template
            >
            <template #list-item="{ row }">{{ row.name }}</template>
        </DataView>
        <details>
            <summary>Requested and accepted state</summary>
            <pre class="overflow-x-auto">{{
                JSON.stringify(
                    { requested: catalog.requested, accepted: catalog.accepted },
                    null,
                    2,
                )
            }}</pre>
        </details>
    </div>
</template>
