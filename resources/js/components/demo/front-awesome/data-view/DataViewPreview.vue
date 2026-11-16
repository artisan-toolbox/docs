<script setup>
import { Button } from '@artisan-toolbox/front-awesome/components/WebAwesome';
import { computed, ref, useSlots } from 'vue';
import DocsTable from '@/components/docs/DocsTable.vue';

const props = defineProps({
    rows: { type: Array, required: true },
    views: { type: Array, required: true },
    columns: { type: Array, default: () => [] },
});
const slots = useSlots();
const labels = { table: 'Table', cards: 'Cards', list: 'List' };
const available = computed(() =>
    props.views.filter((view) =>
        view === 'table' ? props.columns.length > 0 : Object.hasOwn(labels, view) && slots[view],
    ),
);
const preferred = ref(null);
const active = computed(() =>
    available.value.includes(preferred.value) ? preferred.value : available.value[0],
);
</script>

<template>
    <div class="flex min-w-0 flex-col gap-3" data-testid="data-view-preview">
        <div
            v-if="available.length > 1"
            role="group"
            aria-label="Catalog layout"
            class="flex flex-wrap gap-1">
            <Button
                v-for="view in available"
                :key="view"
                size="s"
                :variant="active === view ? 'brand' : 'neutral'"
                :appearance="active === view ? 'filled' : 'outlined'"
                :aria-pressed="active === view"
                @click="preferred = view">
                {{ labels[view] }}
            </Button>
        </div>
        <DocsTable v-if="active === 'table'" caption="Notebook catalog">
            <thead>
                <tr>
                    <th v-for="column in columns" :key="column.id" scope="col">
                        {{ column.label }}
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="record in rows" :key="record.id">
                    <td v-for="column in columns" :key="column.id">
                        <slot
                            :name="`cell-${column.id}`"
                            :record="record"
                            :value="record[column.field]"
                            >{{ record[column.field] }}</slot
                        >
                    </td>
                </tr>
            </tbody>
        </DocsTable>
        <ul
            v-else-if="active"
            aria-label="Notebook catalog"
            :class="
                active === 'cards'
                    ? 'grid gap-3 @sm:grid-cols-2 @2xl:grid-cols-3'
                    : 'divide-y divide-slate-200 dark:divide-slate-700'
            ">
            <li v-for="record in rows" :key="record.id" class="min-w-0">
                <slot :name="active" :record="record" />
            </li>
        </ul>
        <p v-else role="status">
            Configure table columns or supply a slot for a configured layout.
        </p>
    </div>
</template>
