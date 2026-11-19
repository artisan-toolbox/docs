<script setup>
import { useDataAdapter } from '@artisan-toolbox/dapter';
import { DataView } from '@artisan-toolbox/front-awesome/data-view';

const props = defineProps({ source: { type: String, required: true } });
const catalog = useDataAdapter(props.source, { protocol: 2, url: false, searchDebounce: 0 });
const views = {
    table: {
        columns: [
            { field: 'id', label: 'ID' },
            { field: 'name', label: 'Name', orderBy: 'name' },
        ],
    },
};
</script>
<template>
    <DataView :adapter="catalog" :views="views" row-key="id" label="Comparison records">
        <template #cell-name="{ value }">{{ value ?? '(missing)' }}</template>
        <template #footer="{ adapter }"
            ><p data-comparison-ids>
                Accepted IDs {{ adapter.data.map((row) => row.id).join(', ') || 'none' }}.
            </p></template
        >
    </DataView>
</template>
