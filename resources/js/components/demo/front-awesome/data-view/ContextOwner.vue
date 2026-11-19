<script setup>
import { useDataAdapter } from '@artisan-toolbox/dapter';
import { DataView } from '@artisan-toolbox/front-awesome/data-view';

const props = defineProps({
    source: { type: String, required: true },
    keys: { type: Array, required: true },
});
defineEmits(['update:keys']);
const catalog = useDataAdapter(() => props.source, {
    id: 'context-notebooks',
    protocol: 2,
    url: false,
});
const views = { table: { columns: [{ field: 'name', label: 'Notebook' }] } };
</script>
<template>
    <DataView
        :adapter="catalog"
        :views="views"
        row-key="id"
        selection="multiple"
        :selected-keys="keys"
        @update:selected-keys="$emit('update:keys', $event)"
        label="Active catalog">
        <template #footer="{ selection }">
            <p data-context-selection>
                Current selected rows
                {{ selection.rows.map((row) => row.name).join(', ') || 'none' }}.
            </p>
        </template>
    </DataView>
</template>
