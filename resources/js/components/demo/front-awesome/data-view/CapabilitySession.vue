<script setup>
import { useDataAdapter } from '@artisan-toolbox/dapter';
import { DataView } from '@artisan-toolbox/front-awesome/data-view';
import { Button, Details } from '@artisan-toolbox/front-awesome/components/WebAwesome';
const catalog = useDataAdapter('Dapter.ComposedCatalog', {
    protocol: 2,
    id: 'data-view-capabilities',
    url: false,
    searchDebounce: 0,
});
const views = {
    table: {
        columns: [
            { field: 'name', label: 'Notebook', orderBy: 'name' },
            { field: 'status', label: 'Status' },
            { field: 'quantity', label: 'Quantity', orderBy: 'quantity', align: 'end' },
        ],
    },
};
</script>
<template>
    <div class="flex min-w-0 flex-col gap-4" data-capability-session>
        <DataView :adapter="catalog" :views="views" row-key="id" label="Searchable catalog">
            <template #head-name="{ name, sortDirection }">
                <span>{{ name }}</span>
                <span aria-hidden="true">{{
                    sortDirection === 1 ? '↑' : sortDirection === -1 ? '↓' : '↕'
                }}</span>
            </template>
            <template #filters="{ adapter }">
                <div class="flex flex-wrap gap-[0.5rem]">
                    <Button
                        v-if="adapter.global?.filters?.status"
                        @click="adapter.global.filters.status.call({ value: 'paused' })"
                        >Paused notebooks</Button
                    >
                </div>
            </template>
        </DataView>
        <Details summary="Inspect the requested order">
            <pre class="overflow-x-auto text-xs">{{
                JSON.stringify(catalog.requested?.order, null, 2)
            }}</pre>
        </Details>
    </div>
</template>
