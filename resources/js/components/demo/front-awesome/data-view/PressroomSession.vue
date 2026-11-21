<script setup>
import { onMounted, ref, useTemplateRef } from 'vue';
import { useDataAdapter } from '@artisan-toolbox/dapter';
import { DataView } from '@artisan-toolbox/front-awesome/data-view';
import TicketRequest from './TicketRequest.vue';
import TicketStatus from './TicketStatus.vue';

const queue = useDataAdapter('FrontAwesome.Pressroom', {
    id: 'pressroom',
    protocol: 2,
    url: false,
});
const container = useTemplateRef('container');
const view = ref('table');
onMounted(() => {
    if (container.value.clientWidth > 0 && container.value.clientWidth < 540) view.value = 'list';
});
const views = {
    table: {
        columns: [
            { field: 'title', label: 'Ticket' },
            { field: 'client', label: 'Client', orderBy: 'client' },
            { field: 'status', label: 'Status' },
            { field: 'owner', label: 'Assignee' },
            { field: 'due', label: 'Reply due', orderBy: 'due', align: 'end' },
        ],
    },
    list: {},
    grid: {},
};
function controlLabel(subject) {
    if (subject.kind === 'option' && subject.filter === 'status') return subject.value;
    if (subject.kind === 'filter' && subject.filter === 'status') return 'Status';
    if (subject.kind === 'field')
        return { client: 'Client', due: 'Reply due', status: 'Status', title: 'Ticket title' }[
            subject.field
        ];
}
</script>

<template>
    <div ref="container" class="min-w-0">
        <DataView
            v-model:view="view"
            :adapter="queue"
            :views="views"
            row-key="id"
            label="Support tickets"
            :control-label="controlLabel">
            <template #cell-title="{ row }">
                <strong class="block font-semibold" :data-ticket="row.id">{{ row.title }}</strong>
                <small class="text-slate-600 dark:text-slate-300">PR-{{ row.id }}</small>
            </template>
            <template #cell-status="{ value }"><TicketStatus :status="value" /></template>
            <template #cell-due="{ value }"
                ><time class="tabular-nums" :datetime="value">{{ value }}</time></template
            >
            <template #list-item="{ row }"><TicketRequest :ticket="row" /></template>
            <template #grid-item="{ row }">
                <div :data-ticket="row.id" class="flex h-full flex-col items-start gap-3">
                    <div class="flex w-full flex-wrap items-center justify-between gap-2">
                        <span class="text-xs text-slate-600 dark:text-slate-300"
                            >PR-{{ row.id }}</span
                        >
                        <TicketStatus :status="row.status" />
                    </div>
                    <div class="grow">
                        <strong class="block font-semibold">{{ row.title }}</strong>
                        <span class="text-sm">{{ row.client }}</span>
                    </div>
                    <div
                        class="flex w-full flex-wrap items-baseline justify-between gap-2 border-t border-slate-300/60 pt-2 text-sm dark:border-slate-700">
                        <span>{{ row.owner }}</span
                        ><time :datetime="row.due" class="tabular-nums">Due {{ row.due }}</time>
                    </div>
                </div>
            </template>
        </DataView>
    </div>
</template>
