<script setup>
import { ref } from 'vue';
import * as dataView from '@artisan-toolbox/front-awesome/data-view';
import { Button } from '@artisan-toolbox/front-awesome/components/WebAwesome';
import DemoFrame from '@/components/demo/DemoFrame.vue';
import PressroomSession from './PressroomSession.vue';
import PressroomSidebar from './PressroomSidebar.vue';
import TicketRequest from './TicketRequest.vue';
import sessionCode from './PressroomSession.vue?raw';
import sidebarCode from './PressroomSidebar.vue?raw';
import ticketCode from './TicketRequest.vue?raw';
import statusCode from './TicketStatus.vue?raw';
import backend from '../../../../../../app/DataSources/FrontAwesome/Pressroom.php?raw';

const props = defineProps({
    preview: { type: Object, required: true },
    sidebar: { type: Boolean, default: false },
});
const running = ref(false);
const comparison = ref(false);
const hasControls = [
    'DataViewSearch',
    'DataViewFilter',
    'DataViewStatus',
    'DataViewPagination',
].every((name) => Object.hasOwn(dataView, name));
const sources = [
    {
        label: props.sidebar ? 'PressroomSidebar.vue' : 'PressroomSession.vue',
        language: 'vue',
        code: props.sidebar ? sidebarCode : sessionCode,
    },
    { label: 'TicketRequest.vue', language: 'vue', code: ticketCode },
    { label: 'TicketStatus.vue', language: 'vue', code: statusCode },
    { label: 'app/DataSources/FrontAwesome/Pressroom.php', language: 'php', code: backend },
];
</script>

<template>
    <DemoFrame
        :data-testid="sidebar ? 'pressroom-sidebar' : 'pressroom-queue'"
        data-search-exclude
        :title="sidebar ? 'Compose a ticket list' : 'Pressroom'"
        :sources="sources">
        <div class="flex min-w-0 flex-col gap-4">
            <header
                class="flex flex-col gap-3 border-b border-slate-300/60 pb-3 @md:flex-row @md:items-end @md:justify-between dark:border-slate-700">
                <div>
                    <h4 class="text-xl font-semibold tracking-tight">
                        {{ sidebar ? 'Ticket requests' : 'Support queue' }}
                    </h4>
                    <p v-if="!sidebar" class="text-sm text-slate-600 dark:text-slate-300">
                        Proof approvals, press issues, and deliveries for November 20.
                    </p>
                </div>
                <Button
                    v-if="!running && (!sidebar || hasControls)"
                    variant="brand"
                    @click="running = true"
                    >{{ sidebar ? 'Open the ticket list' : 'Open the support queue' }}</Button
                >
            </header>
            <template v-if="!running">
                <p class="text-sm">
                    {{
                        sidebar && !hasControls
                            ? 'The standalone controls require Front Awesome beta.9 or later. View source for the complete example.'
                            : 'Preview of the first ticket'
                    }}
                </p>
                <TicketRequest :ticket="preview" />
            </template>
            <PressroomSession v-else-if="!sidebar" />
            <template v-else>
                <PressroomSidebar id="pressroom-main" />
                <Button
                    v-if="!comparison"
                    class="@md:self-start"
                    appearance="outlined"
                    @click="comparison = true"
                    >Open an independent queue</Button
                >
                <section
                    v-else
                    aria-label="Independent queue"
                    class="grid gap-3 border-t border-slate-300/60 pt-3 dark:border-slate-700">
                    <h4 class="font-semibold">Independent queue</h4>
                    <PressroomSidebar id="pressroom-independent" />
                </section>
            </template>
        </div>
    </DemoFrame>
</template>
