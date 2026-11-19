<script setup>
import { ref } from 'vue';
import { useDataAdapter } from '@artisan-toolbox/dapter';
import { DataView } from '@artisan-toolbox/front-awesome/data-view';
import { Button, Tag } from '@artisan-toolbox/front-awesome/components/WebAwesome';

const props = defineProps({ mode: { type: String, required: true } });
const joined = props.mode === 'single';
const catalog = useDataAdapter(joined ? 'Dapter.ComposedJoin' : 'FrontAwesome.Notebooks', {
    protocol: 2,
    url: false,
});
const keys = ref([]);
const columns = joined
    ? [
          {
              id: 'product',
              label: 'Item',
              accessor: (row) => ({ name: row.label }),
              groupBy: (row) => row.record_id,
          },
          { field: 'line_id', label: 'Order line' },
          { field: 'amount', label: 'Amount' },
      ]
    : [
          { field: 'shelf', label: 'Shelf', groupBy: true },
          { field: 'name', label: 'Notebook' },
      ];
const views = { table: { columns }, list: {} };
function occurrence(row) {
    return joined ? JSON.stringify([row.record_id, row.line_id]) : row.id;
}
function controlLabel(subject) {
    if (subject.kind === 'row')
        return joined ? `${subject.row.label} line ${subject.row.line_id}` : subject.row.name;
}
</script>
<template>
    <DataView
        :adapter="catalog"
        :views="views"
        :row-key="occurrence"
        :selection="mode"
        v-model:selected-keys="keys"
        :control-label="controlLabel"
        label="Pick stationery">
        <template #cell-product="{ value }">{{ value.name }}</template>
        <template #list-item="{ row, rowKey, selected }"
            ><span>{{ row.name ?? row.label }} ({{ rowKey }})</span> <Tag v-if="selected" size="s"
                >Selected</Tag
            ></template
        >
        <template #footer="{ selection }">
            <p role="status" data-picked>
                Selected {{ JSON.stringify(selection.keys) }}. Current rows
                {{ selection.rows.map((row) => row.name ?? row.label).join(', ') || 'none' }}.
            </p>
            <Button v-if="selection.keys.length" @click="selection.clear()"
                >Clear picked rows</Button
            >
        </template>
    </DataView>
</template>
