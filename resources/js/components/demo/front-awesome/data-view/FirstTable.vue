<script setup>
import { useDataAdapter } from '@artisan-toolbox/dapter';
import { DataView } from '@artisan-toolbox/front-awesome/data-view';

const catalog = useDataAdapter('Dapter.Quickstart', { id: 'first-table', url: false });
const views = {
    table: {
        columns: [
            { field: 'name', label: 'Notebook' },
            { field: 'category', label: 'Paper' },
        ],
    },
};
</script>

<template>
    <DataView :adapter="catalog" :views="views" row-key="id" label="Notebooks" />
</template>
