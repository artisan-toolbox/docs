<script setup>
import { useDataAdapter } from '@artisan-toolbox/dapter';
import { DataView } from '@artisan-toolbox/front-awesome/data-view';
import { Tag } from '@artisan-toolbox/front-awesome/components/WebAwesome';

const catalog = useDataAdapter('FrontAwesome.Notebooks', {
    protocol: 2,
    url: false,
    searchDebounce: 0,
});
const views = {
    table: {
        columns: [
            { field: 'name', label: 'Notebook', orderBy: 'name' },
            { field: 'shelf', label: 'Shelf' },
            { field: 'mark', label: 'Stock mark' },
        ],
    },
};

function markLabel(value) {
    if (value === '') return 'Empty string';
    if (value === ' ') return 'One space';
    return value === null ? 'Null' : `${typeof value}: ${value}`;
}

function controlLabel(subject) {
    if (subject.kind === 'option' && ['mark', 'marks'].includes(subject.filter))
        return markLabel(subject.value);
    if (subject.kind === 'field' && subject.field === 'sheets') return 'Sheet count';
    if (subject.kind === 'filter' && subject.filter === 'marks') return 'Allowed stock marks';
}
</script>

<template>
    <DataView
        :adapter="catalog"
        :views="views"
        row-key="id"
        :control-label="controlLabel"
        label="Stationery stock">
        <template #cell-mark="{ value }"><Tag size="s">{{ markLabel(value) }}</Tag></template>
        <template #footer="{ adapter }">
            <details>
                <summary>Requested and accepted criteria</summary>
                <pre data-query-requested class="overflow-x-auto text-xs">{{
                    JSON.stringify(adapter.requested, null, 2)
                }}</pre>
                <pre data-query-accepted class="overflow-x-auto text-xs">{{
                    JSON.stringify(adapter.accepted, null, 2)
                }}</pre>
            </details>
        </template>
    </DataView>
</template>
