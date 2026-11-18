<script setup>
import { DataAdapter } from '@artisan-toolbox/dapter';
import { Button } from '@artisan-toolbox/front-awesome/components/WebAwesome';
defineProps({ source: { type: String, required: true } });
</script>
<template>
    <DataAdapter :source="source" :protocol="2" paging="source" v-slot="view">
        <div class="flex min-w-0 flex-col gap-4" data-paging-session>
            <p role="status" data-paging-status>
                Mode {{ view.paging.mode ?? 'unready' }}. Exact counts omitted.
            </p>
            <p data-paging-null-actions>
                Numbered action {{ view.paging.goToPage === null ? 'null' : 'available' }}. Last
                action {{ view.paging.goToLast === null ? 'null' : 'available' }}.
            </p>
            <p v-if="view.error" role="alert">{{ view.error.message }}</p>
            <div class="flex flex-wrap gap-2">
                <Button :disabled="view.paging.loading" @click="view.paging.goToFirst()"
                    >First</Button
                >
                <Button
                    :disabled="view.paging.loading || !view.paging.has_previous"
                    @click="view.paging.goToPrevious()"
                    >Previous</Button
                >
                <Button
                    :disabled="view.paging.loading || !view.paging.has_next"
                    @click="view.paging.goToNext()"
                    >Next</Button
                >
                <Button :disabled="view.paging.loading" @click="view.paging.reload()"
                    >Reload</Button
                >
            </div>
            <ul aria-label="Accepted notebook rows">
                <li v-for="row in view.data" :key="row.id" :data-paging-row="row.id">
                    {{ row.name }}
                </li>
            </ul>
        </div>
    </DataAdapter>
</template>
