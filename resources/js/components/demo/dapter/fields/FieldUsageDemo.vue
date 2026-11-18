<script setup>
import { ref } from 'vue';
import { DataAdapter } from '@artisan-toolbox/dapter';
import {
    Button,
    Input,
    Option,
    Select,
} from '@artisan-toolbox/front-awesome/components/WebAwesome';
import DemoFrame from '@/components/demo/DemoFrame.vue';
import RowsView from '../vue/RowsView.vue';
import catalogSource from '../../../../../../app/DataSources/Dapter/VueCatalog.php?raw';
import recordsSource from '../../../../../../app/Demo/Dapter/Fields/FieldRecords.php?raw';
import clientSource from './FieldUsageDemo.vue?raw';
import rowsSource from '../vue/RowsView.vue?raw';

defineProps({
    task: {
        type: String,
        required: true,
        validator: (task) => ['search', 'filter', 'sort'].includes(task),
    },
});
const titles = {
    search: 'Search the catalog by name',
    filter: 'Filter the catalog by category',
    sort: 'Sort the catalog by name',
};
const sources = [
    { label: 'app/DataSources/Dapter/VueCatalog.php', language: 'php', code: catalogSource },
    { label: 'app/Demo/Dapter/Fields/FieldRecords.php', language: 'php', code: recordsSource },
    { label: 'FieldUsageDemo.vue', language: 'vue', code: clientSource },
    { label: 'RowsView.vue', language: 'vue', code: rowsSource },
];
const started = ref(false);
</script>

<template>
    <DemoFrame
        :title="titles[task]"
        :sources="sources"
        :data-field-usage="task"
        data-search-exclude>
        <Button v-if="!started" @click="started = true">Start example</Button>
        <DataAdapter v-else source="Dapter.VueCatalog" :protocol="2" :url="false" v-slot="catalog">
            <div class="flex flex-col items-start gap-4">
                <template v-if="task === 'search' && catalog.fields?.name?.search">
                    <Input
                        label="Search name"
                        :model-value="catalog.fields.name.search.current?.value ?? ''"
                        @update:model-value="
                            catalog.fields.name.search.call({
                                value: $event,
                                matchType: 'contains',
                            })
                        " />
                    <p>
                        Current search: {{ catalog.fields.name.search.current?.value ?? 'none' }}.
                    </p>
                    <Button variant="neutral" @click="catalog.fields.name.search.clear()"
                        >Clear search</Button
                    >
                </template>
                <template v-if="task === 'filter' && catalog.fields?.category?.filters?.category">
                    <Select
                        label="Category"
                        :model-value="catalog.fields.category.filters.category.current?.value ?? ''"
                        @update:model-value="
                            catalog.fields.category.filters.category.call({ value: $event })
                        ">
                        <Option
                            v-for="category in catalog.fields.category.filters.category.available
                                .values"
                            :key="category"
                            :value="category"
                            >{{ category }}</Option
                        >
                    </Select>
                    <p>
                        Current category:
                        {{
                            catalog.fields.category.filters.category.current?.value ??
                            'all categories'
                        }}.
                    </p>
                    <Button
                        variant="neutral"
                        @click="catalog.fields.category.filters.category.clear()"
                        >Clear category</Button
                    >
                </template>
                <template v-if="task === 'sort' && catalog.fields?.name?.order">
                    <Select
                        label="Name order"
                        :model-value="catalog.fields.name.order.current?.direction ?? ''"
                        @update:model-value="
                            catalog.fields.name.order.call({
                                direction: $event,
                                sortType: 'natural',
                                multiSort: false,
                            })
                        ">
                        <Option
                            v-for="direction in catalog.fields.name.order.available.directions"
                            :key="direction"
                            :value="direction"
                            >{{ direction === 'asc' ? 'Ascending' : 'Descending' }}</Option
                        >
                    </Select>
                    <p>
                        Current order:
                        {{ catalog.fields.name.order.current?.direction ?? 'source order' }}.
                    </p>
                    <Button variant="neutral" @click="catalog.fields.name.order.clear()"
                        >Clear order</Button
                    >
                </template>
                <p role="status" v-if="catalog.paging.loading">Loading records…</p>
                <p v-if="catalog.error" role="alert">
                    {{ catalog.error.message }}
                    <Button @click="catalog.paging.reload()">Retry</Button>
                </p>
                <RowsView v-if="catalog.ready" :adapter="catalog" />
                <Button variant="neutral" @click="started = false">Reset example</Button>
            </div>
        </DataAdapter>
    </DemoFrame>
</template>
