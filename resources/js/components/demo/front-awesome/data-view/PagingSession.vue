<script setup>
import { useDataAdapter } from '@artisan-toolbox/dapter';
import { DataView } from '@artisan-toolbox/front-awesome/data-view';
const props = defineProps({ source: { type: String, required: true }, infinite: Boolean });
const catalog = useDataAdapter(props.source, {
    protocol: 2,
    paging: 'source',
    id: `data-view-${props.source}`,
    url: false,
    ...(props.infinite ? { infinite: true } : {}),
});
const views = {
    table: {
        columns: [
            { field: 'id', label: 'ID' },
            { field: 'name', label: 'Notebook', orderBy: 'name' },
        ],
    },
};
</script>
<template>
    <DataView :adapter="catalog" :views="views" row-key="id" label="Notebook traversal">
        <template #footer="{ adapter }"
            ><p data-paging-summary>
                Mode {{ adapter.paging.mode }}. {{ adapter.data.length }} loaded. Exact total
                {{ adapter.paging.total === null ? 'unknown' : adapter.paging.total }}.
            </p></template
        >
    </DataView>
</template>
