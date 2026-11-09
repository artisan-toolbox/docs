<script setup>
defineProps({
    title: { type: String, required: true },
    description: { type: String, required: true },
    events: { type: Array, default: () => [] },
    empty: { type: String, default: 'No events received.' },
});
</script>

<template>
    <section
        class="min-w-0 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
        <h4 class="font-semibold text-slate-900 dark:text-slate-100">
            {{ title }}
        </h4>
        <p class="mt-1 text-xs leading-5 text-slate-600 dark:text-slate-400">
            {{ description }}
        </p>
        <ol v-if="events.length" class="mt-3 space-y-3 text-xs">
            <li
                v-for="(event, index) in events"
                :key="`${event.name}-${index}`"
                class="min-w-0 rounded-lg bg-white p-3 dark:bg-slate-950">
                <p class="font-mono font-medium break-all text-slate-800 dark:text-slate-200">
                    {{ event.name }}
                </p>
                <p v-if="event.source" class="mt-1 font-medium text-brand-700 dark:text-brand-300">
                    Source: {{ event.source }}
                </p>
                <pre class="mt-2 overflow-auto text-slate-600 dark:text-slate-400">{{
                    JSON.stringify(event.payload, null, 2)
                }}</pre>
            </li>
        </ol>
        <p v-else class="mt-4 text-sm text-slate-500 dark:text-slate-400">
            {{ empty }}
        </p>
    </section>
</template>
