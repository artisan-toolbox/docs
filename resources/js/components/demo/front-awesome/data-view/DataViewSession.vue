<script setup>
import { ref } from 'vue';
import { useDataAdapter } from '@artisan-toolbox/dapter';
import { DataView } from '@artisan-toolbox/front-awesome/data-view';
import { Details, Option, Select, Tag } from '@artisan-toolbox/front-awesome/components/WebAwesome';
import { columns, decodeNotebook } from './catalog';

const props = defineProps({ source: { type: String, required: true } });
const catalog = useDataAdapter(() => props.source, {
    id: 'data-view-catalog',
    decodeRow: decodeNotebook,
});
const preset = ref('all');
const layouts = {
    all: { table: { columns, striped: true, hover: true }, grid: {}, list: {} },
    table: { table: { columns, striped: true, hover: true } },
    grid: { grid: {} },
};
</script>

<template>
    <div class="flex min-w-0 flex-col gap-4" data-data-view-session>
        <DataView
            :adapter="catalog"
            :views="layouts[preset]"
            row-key="id"
            label="Notebook catalog"
            caption="Fictional notebooks">
            <template #cell-notebook="{ value }"
                ><strong class="font-semibold">{{ value }}</strong></template
            >
            <template #header-paper="{ column }">{{ column.label }} type</template>
            <template #cell-paper="{ value }"><Tag size="s">{{ value }}</Tag></template>
            <template #grid-item="{ row }">
                <div class="flex flex-col items-start gap-[0.5rem]">
                    <span class="text-xs">Catalog no. {{ row.id }}</span>
                    <strong>{{ row.name }}</strong>
                    <Tag size="s" variant="brand">{{ row.category }}</Tag>
                </div>
            </template>
            <template #list-item="{ row }">
                <div
                    class="flex flex-wrap items-baseline justify-between gap-[0.5rem] py-[0.75rem] text-sm">
                    <strong>{{ row.name }}</strong><span>{{ row.category }} paper</span>
                </div>
            </template>
        </DataView>
        <Details summary="Layout settings and adapter state" class="min-w-0 text-sm">
            <div class="mt-[0.75rem] flex min-w-0 flex-col gap-[0.75rem]">
                <Select v-model="preset" label="Configured layouts">
                    <Option value="all">Table, grid, and list</Option>
                    <Option value="table">Table only</Option>
                    <Option value="grid">Grid only</Option>
                </Select>
                <dl class="grid min-w-0 gap-[0.5rem]">
                    <dt class="font-semibold">Requested state</dt>
                    <dd>
                        <pre class="overflow-x-auto">{{
                            JSON.stringify(catalog.requested, null, 2)
                        }}</pre>
                    </dd>
                    <dt class="font-semibold">Accepted state</dt>
                    <dd>
                        <pre class="overflow-x-auto">{{
                            JSON.stringify(catalog.accepted, null, 2)
                        }}</pre>
                    </dd>
                </dl>
            </div>
        </Details>
    </div>
</template>
