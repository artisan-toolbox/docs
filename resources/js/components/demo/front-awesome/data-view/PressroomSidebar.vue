<script setup>
import { ref } from 'vue';
import { Button, Dialog } from '@artisan-toolbox/front-awesome/components/WebAwesome';
import { useDataAdapter } from '@artisan-toolbox/dapter';
import * as dataView from '@artisan-toolbox/front-awesome/data-view';
import TicketRequest from './TicketRequest.vue';

// Keep the source readable on sites that still install Front Awesome beta.8.
const { DataView, DataViewFilter, DataViewPagination, DataViewSearch, DataViewStatus } = {
    ...dataView,
};
const props = defineProps({ id: { type: String, required: true } });
const queue = useDataAdapter('FrontAwesome.Pressroom', { id: props.id, protocol: 2, url: false });
const views = { list: {} };
const comparing = ref(false);
const deadlines = {
    table: {
        columns: [
            { field: 'title', label: 'Ticket' },
            { field: 'due', label: 'Reply due', align: 'end' },
        ],
    },
};
</script>

<template>
    <div class="@container min-w-0" :data-queue="id">
        <div class="grid min-w-0 items-start gap-4 @2xl:grid-cols-[12rem_minmax(0,1fr)]">
            <form aria-label="Ticket criteria" class="grid min-w-0 gap-3" @submit.prevent>
                <DataViewSearch :adapter="queue" label="Search tickets" />
                <DataViewFilter
                    :adapter="queue"
                    field="status"
                    filter="status"
                    label="Status"
                    :control-label="
                        (subject) => (subject.kind === 'option' ? subject.value : undefined)
                    " />
            </form>
            <div class="grid min-w-0 gap-3">
                <DataView
                    :adapter="queue"
                    :views="views"
                    row-key="id"
                    hide-header
                    hide-footer
                    label="Ticket requests">
                    <template #list-item="{ row }"><TicketRequest :ticket="row" /></template>
                </DataView>
                <footer
                    class="grid min-w-0 gap-3 rounded-lg border border-slate-200 bg-white p-3 @xl:flex @xl:flex-wrap @xl:items-center @xl:justify-between dark:border-slate-700 dark:bg-slate-950">
                    <DataViewStatus :adapter="queue" />
                    <DataViewPagination :adapter="queue" />
                </footer>
                <Button
                    v-if="queue.data.length"
                    class="@md:justify-self-start"
                    appearance="outlined"
                    @click="comparing = true">
                    Compare deadlines
                </Button>
                <Dialog v-model:open="comparing" label="Reply deadlines" class="[--width:24rem]">
                    <DataView
                        v-if="comparing"
                        :adapter="queue"
                        :views="deadlines"
                        row-key="id"
                        hide-header
                        hide-footer
                        label="Ticket deadlines">
                        <template #cell-due="{ value }"
                            ><time class="tabular-nums" :datetime="value">{{
                                value
                            }}</time></template
                        >
                    </DataView>
                </Dialog>
            </div>
        </div>
    </div>
</template>
