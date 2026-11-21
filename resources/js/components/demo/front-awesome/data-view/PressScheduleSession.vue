<script setup>
import { computed } from 'vue';
import { useDataAdapter } from '@artisan-toolbox/dapter';
import { Button } from '@artisan-toolbox/front-awesome/components/WebAwesome';
import { DataView } from '@artisan-toolbox/front-awesome/data-view';

const schedule = useDataAdapter('FrontAwesome.PressSchedule', {
    id: 'press-schedule',
    protocol: 2,
    url: false,
});
const columns = [
    { field: 'job', label: 'Print job' },
    { field: 'due', label: 'Due', orderBy: 'due', align: 'end' },
    { field: 'sheets', label: 'Sheets', orderBy: 'sheets', align: 'end' },
];
const views = { table: { columns } };
const accepted = computed(() => schedule.accepted?.order?.terms ?? []);
const chosen = computed(() => accepted.value.filter((term) => !term.role));
const secondary = computed(() => chosen.value[1]);
const deadlineFirst = computed(
    () => chosen.value[0]?.field === 'due' && chosen.value[0].direction === 'asc',
);
const busy = computed(() => schedule.status === 'loading');

function orderLabel(term) {
    if (term.field === 'due')
        return term.direction === 'asc' ? 'Earliest deadline' : 'Latest deadline';
    return term.direction === 'asc' ? 'Fewest sheets' : 'Most sheets';
}

const orderDescription = computed(() => {
    const [first, second] = chosen.value;
    if (!first) return 'Source order';
    const primary = orderLabel(first);
    const order = second ? `${primary}, then ${orderLabel(second).toLowerCase()}` : primary;
    return accepted.value.some((term) => term.role === 'tie')
        ? `${order}. Job ID breaks ties.`
        : order;
});

function sortBySheets(direction) {
    return schedule.fields.sheets.order.call({ direction, sortType: 'numeric', multiSort: true });
}
</script>

<template>
    <DataView :adapter="schedule" :views="views" row-key="id" label="Press schedule">
        <template #toolbar>
            <div class="@container grid w-full min-w-0 gap-3">
                <div
                    role="group"
                    aria-label="Schedule order"
                    class="grid gap-2 @md:flex @md:items-center">
                    <Button
                        v-if="schedule.fields?.due?.order && !deadlineFirst"
                        :disabled="busy"
                        @click="
                            schedule.fields.due.order.call({ direction: 'asc', sortType: 'native' })
                        ">
                        Earliest deadline first
                    </Button>
                    <template v-if="deadlineFirst && schedule.fields?.sheets?.order">
                        <Button
                            :disabled="busy"
                            @click="sortBySheets(secondary?.direction === 'desc' ? 'asc' : 'desc')">
                            {{
                                !secondary
                                    ? 'Add largest run first'
                                    : secondary.direction === 'desc'
                                      ? 'Smallest run first'
                                      : 'Largest run first'
                            }}
                        </Button>
                        <Button
                            v-if="secondary"
                            :disabled="busy"
                            appearance="outlined"
                            @click="schedule.fields.sheets.order.clear()">
                            Remove run size
                        </Button>
                    </template>
                </div>
                <p aria-live="polite" data-schedule-order class="text-sm">
                    <strong>Applied order</strong> · {{ orderDescription }}
                </p>
            </div>
        </template>
        <template #cell-job="{ row }">
            <strong class="block font-semibold" :data-job="row.id">{{ row.job }}</strong>
            <small>Job {{ row.id }}</small>
        </template>
        <template #cell-due="{ value }"
            ><time :datetime="value" class="tabular-nums">{{ value }}</time></template
        >
        <template #cell-sheets="{ value }"
            ><span class="tabular-nums">{{ value.toLocaleString('en-US') }}</span></template
        >
    </DataView>
</template>
