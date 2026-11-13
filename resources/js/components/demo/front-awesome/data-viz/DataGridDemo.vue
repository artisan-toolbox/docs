<script setup>
import { ref } from 'vue';
import { DataGrid } from '@artisan-toolbox/front-awesome/components/WebAwesome/Pro';
import { Button } from '@artisan-toolbox/front-awesome/components/WebAwesome';

const loaded = ref(false);
const columns = [
    { field: 'name', label: 'Package', sortable: true },
    { field: 'status', label: 'Status', sortable: true },
];
const data = [
    { id: 1, name: 'Core', status: 'Preview' },
    { id: 2, name: 'Front Awesome', status: 'Beta' },
    { id: 3, name: 'Mosaicast', status: 'Preview' },
];
</script>

<template>
    <div class="flex min-w-0 flex-col gap-4" data-docs-outline-exclude>
        <div class="min-w-0">
            <Button @click="loaded = !loaded">{{
                loaded ? 'Reset grid' : 'Render local grid'
            }}</Button>
        </div>
        <div class="min-w-0">
            <DataGrid
                v-if="loaded"
                label="Package status"
                row-key="id"
                :data="data"
                :columns="columns"
                :with-search="true"
                :paginate="true"
                :page-size="2"
                :page-size-options="[2, 5]" />
        </div>
    </div>
</template>
