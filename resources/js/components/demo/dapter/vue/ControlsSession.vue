<script setup>
import { DataAdapter, useDataAdapter } from '@artisan-toolbox/dapter';
import { Button } from '@artisan-toolbox/front-awesome/components/WebAwesome';
import CodeExample from '@/components/docs/CodeExample.vue';
import FieldControls from './FieldControls.vue';
import RowsView from './RowsView.vue';
import { decodeControlsDefinition, decodeRow } from './catalog';
const catalog = useDataAdapter('Dapter.VueCatalog', {
    protocol: 2,
    id: 'vue-controls',
    decodeRow,
    decodeDefinition: decodeControlsDefinition,
    searchDebounce: 250,
    url: false,
});
const paperSnapshot = {
    version: 2,
    fields: { category: { filters: { category: { value: 'paper' } } } },
    global: {},
    searchMatch: 'all',
    order: { kind: 'default' },
    paging: { mode: 'offset', current: 1, per_page: 4 },
};
</script>

<template>
    <div class="flex min-w-0 flex-col gap-5" data-vue-session>
        <p role="status">
            {{
                catalog.paging.loading
                    ? 'Loading catalog.'
                    : `Page ${catalog.paging.current}. ${catalog.paging.filtered} matching records.`
            }}
        </p>
        <p v-if="catalog.error" role="alert">
            {{ catalog.error.kind }}. {{ catalog.error.message }}
        </p>
        <FieldControls :adapter="catalog" />
        <div class="flex flex-wrap gap-2">
            <Button :disabled="!catalog.paging.has_next" @click="catalog.paging.goToNext()"
                >Next catalog page</Button
            >
            <Button @click="catalog.paging.reload()">Reload catalog</Button>
            <Button @click="catalog.replaceState(paperSnapshot)"
                >Replace with paper snapshot</Button
            >
            <Button variant="neutral" @click="catalog.resetState()">Restore server defaults</Button>
        </div>
        <DataAdapter :adapter="catalog" v-slot="adapter"
            ><RowsView :adapter="adapter" layout="table"
        /></DataAdapter>
        <DataAdapter :adapter="catalog" v-slot="adapter"
            ><RowsView :adapter="adapter" layout="grid"
        /></DataAdapter>
        <CodeExample
            label="Requested catalog state"
            language="json"
            :code="JSON.stringify(catalog.requested, null, 2)" />
        <CodeExample
            label="Accepted catalog state"
            language="json"
            :code="JSON.stringify(catalog.accepted, null, 2)" />
    </div>
</template>
