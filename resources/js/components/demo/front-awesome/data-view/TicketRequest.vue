<script setup>
import TicketStatus from './TicketStatus.vue';
defineProps({ ticket: { type: Object, required: true } });
</script>

<template>
    <div
        class="flex flex-wrap items-start justify-between gap-x-4 gap-y-2"
        :data-ticket="ticket.id">
        <div class="min-w-0 flex-1 basis-56">
            <strong class="font-semibold">{{ ticket.title }}</strong>
            <p class="my-1 text-sm leading-relaxed">{{ ticket.note }}</p>
            <p class="text-xs text-slate-600 dark:text-slate-300">
                PR-{{ ticket.id }} · {{ ticket.client }} · {{ ticket.owner }}
            </p>
        </div>
        <div class="flex flex-wrap items-center gap-2 text-sm tabular-nums">
            <TicketStatus :status="ticket.status" />
            <time :datetime="ticket.due">Due {{ ticket.due }}</time>
        </div>
    </div>
</template>
