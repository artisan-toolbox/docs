<script setup>
import { DataAdapter } from '@artisan-toolbox/dapter';
import { Button } from '@artisan-toolbox/front-awesome/components/WebAwesome';
defineProps({ source: { type: String, required: true } });
</script>
<template>
    <DataAdapter :source="source" :protocol="2" :infinite="true" v-slot="view">
        <div class="flex min-w-0 flex-col gap-4" data-infinite-session>
            <p role="status" data-infinite-status>
                {{ view.infinite.status }}. {{ view.data.length }} loaded.
            </p>
            <p v-if="view.error" role="alert" data-infinite-error>
                {{ view.error.kind }}. {{ view.error.message }}
            </p>
            <div class="flex flex-wrap gap-2">
                <Button
                    :disabled="
                        view.infinite.status === 'loading' ||
                        view.infinite.status === 'exhausted' ||
                        view.infinite.status === 'paused'
                    "
                    @click="view.infinite.append()"
                    >Load more</Button
                >
                <Button :disabled="view.infinite.status !== 'paused'" @click="view.infinite.retry()"
                    >Retry append</Button
                >
                <Button :disabled="view.infinite.status === 'loading'" @click="view.paging.reload()"
                    >Refresh first page</Button
                >
            </div>
            <ul aria-label="Accumulated joined result rows" class="flex flex-col gap-2">
                <li
                    v-for="(row, occurrence) in view.data"
                    :key="`${occurrence}:${row.record_id}:${row.line_id}`"
                    :data-infinite-row="`${row.record_id}:${row.line_id}`"
                    class="rounded-lg bg-slate-100 p-4 dark:bg-slate-800">
                    {{ row.label }}. Record {{ row.record_id }}. Line {{ row.line_id }}. Amount
                    {{ row.amount }}.
                </li>
            </ul>
        </div>
    </DataAdapter>
</template>
