<script setup>
import { ref } from 'vue';
import { usePreferredReducedMotion } from '@vueuse/core';
import { useDataAdapter } from '@artisan-toolbox/dapter';
import { DataView } from '@artisan-toolbox/front-awesome/data-view';
import {
    Button,
    Checkbox,
    Select,
    Skeleton,
} from '@artisan-toolbox/front-awesome/components/WebAwesome';

const props = defineProps({ source: { type: String, required: true } });
const catalog = useDataAdapter(() => props.source, {
    id: 'notebook-table-feedback',
    protocol: 2,
    url: false,
    searchDebounce: 1500,
});
const views = {
    table: {
        columns: [
            { field: 'name', label: 'Notebook' },
            { field: 'shelf', label: 'Shelf' },
        ],
    },
};
const stateLayout = ref('row');
const useSkeleton = ref(false);
const motion = usePreferredReducedMotion();
</script>

<template>
    <div class="grid min-w-0 gap-4">
        <div class="flex flex-wrap items-end gap-4">
            <Select
                v-model="stateLayout"
                label="Table feedback"
                option-value="value"
                option-label="label"
                :options="[
                    { value: 'row', label: 'Keep column headings' },
                    { value: 'replace', label: 'Replace the table' },
                ]" />
            <Checkbox v-model="useSkeleton">Use skeleton rows</Checkbox>
        </div>
        <DataView
            :adapter="catalog"
            :views="views"
            row-key="id"
            selection="multiple"
            label="Notebook inventory"
            :state-layout="stateLayout"
            :skeleton-rows="2"
            preserve-skeleton-rows>
            <template #toolbar>
                <div v-if="catalog.global?.search" class="flex flex-wrap gap-2">
                    <Button
                        v-if="!catalog.requested?.global?.search"
                        :disabled="catalog.status === 'loading'"
                        @click="catalog.global.search.call({ value: 'envelope' })">
                        Search for envelopes
                    </Button>
                    <Button
                        v-else
                        :disabled="catalog.status === 'loading'"
                        @click="catalog.global.search.clear()"
                        >Clear search</Button
                    >
                </div>
            </template>
            <template v-if="useSkeleton" #skeleton="{ columns, index }">
                <td v-for="column in columns" :key="column.field">
                    <Skeleton
                        :effect="motion === 'reduce' ? 'none' : 'pulse'"
                        class="h-4 max-w-full"
                        :class="
                            column.field === 'shelf' ? 'w-8' : index % 2 === 0 ? 'w-24' : 'w-16'
                        " />
                </td>
            </template>
        </DataView>
    </div>
</template>
