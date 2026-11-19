<script setup>
import { useDataAdapter } from '@artisan-toolbox/dapter';
import { DataView } from '@artisan-toolbox/front-awesome/data-view';
import { Button, Tag } from '@artisan-toolbox/front-awesome/components/WebAwesome';
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
                <Tag aria-hidden="true" size="small" :data-head-direction="sortDirection">{{
                    sortDirection
                }}</Tag>
            </template>
            <template #head-status="{ name, sortDirection }">
                <span>{{ name }}</span>
                <Tag aria-hidden="true" size="small" data-head-unavailable>{{
                    sortDirection === null ? 'Unavailable' : sortDirection
                }}</Tag>
            </template>
            <template #filters="{ adapter }">
                <div class="flex flex-wrap gap-[0.5rem]">
                    <Button
                        v-if="adapter.global?.filters?.status"
                        @click="adapter.global.filters.status.call({ value: 'paused' })"
                        >Paused notebooks</Button
                    >
                    <Button
                        v-if="adapter.global?.filters?.status"
                        @click="adapter.global.filters.status.clear()"
                        >Clear notebook status</Button
                    >
                    <Button @click="adapter.resetState()">Restore catalog defaults</Button>
                </div>
            </template>
            <template #footer="{ adapter }"
                ><p data-capability-state class="text-sm">
                    Shared handle {{ adapter === catalog ? 'yes' : 'no' }}.
                    {{ adapter.paging.filtered }} matching.
                </p></template
            >
        </DataView>
        <p data-sibling-state class="text-sm">
            Sibling control sees {{ catalog.data.length }} rows and {{ catalog.status }} status.
        </p>
        <pre data-capability-requested class="overflow-x-auto text-xs">{{
            JSON.stringify(catalog.requested, null, 2)
        }}</pre>
    </div>
</template>
