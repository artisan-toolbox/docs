<script setup>
import { Button, Select, Spinner, Tag } from '@artisan-toolbox/front-awesome/components/WebAwesome';
import { DataGrid } from '@artisan-toolbox/front-awesome/components/WebAwesome/Pro';
import CodeExample from '@/components/docs/CodeExample.vue';
import { columns } from './products';
defineProps({ adapter: { type: Object, required: true } });
</script>

<template>
    <div class="flex min-w-0 flex-col gap-4" :aria-busy="adapter.paging.loading">
        <p role="status" class="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
            <Spinner v-if="adapter.paging.loading" aria-label="Loading catalog" />
            <template v-if="adapter.paging.loading">Loading the requested page…</template>
            <template v-else-if="adapter.ready">
                Page {{ adapter.paging.current }} of {{ adapter.paging.pages }}.
                {{ adapter.paging.total }} total, {{ adapter.paging.filtered }} matching.
            </template>
            <template v-else-if="adapter.error"
                >The request failed. Reset or reload to try again.</template
            >
        </p>
        <p v-if="adapter.error" role="alert" class="text-sm text-red-700 dark:text-red-300">
            <Tag variant="danger">{{ adapter.error.kind }}</Tag>
            {{ adapter.error.message }}
        </p>
        <template v-if="adapter.ready">
            <div class="w-fit max-w-full">
                <Select
                    label="Rows per page"
                    :disabled="adapter.paging.loading"
                    :model-value="adapter.paging.per_page.value"
                    @update:model-value="adapter.paging.per_page.setValue($event)"
                    :options="adapter.paging.per_page.options" />
            </div>
            <DataGrid
                label="Catalog page returned by Dapter"
                row-key="id"
                :data="adapter.data"
                :columns="columns"
                :server="true"
                :paginate="false"
                :total="adapter.paging.total"
                :loading="adapter.paging.loading" />
            <p v-if="adapter.paging.empty" class="text-sm">The catalog has no rows.</p>
        </template>
        <div class="flex flex-wrap gap-2" role="group" aria-label="Catalog paging">
            <Button
                variant="neutral"
                :disabled="adapter.paging.loading || !adapter.paging.has_previous"
                @click="adapter.paging.goToFirst()"
                >First</Button
            >
            <Button
                variant="neutral"
                :disabled="adapter.paging.loading || !adapter.paging.has_previous"
                @click="adapter.paging.goToPrevious()"
                >Previous</Button
            >
            <Button
                variant="neutral"
                :disabled="adapter.paging.loading || !adapter.paging.has_next"
                @click="adapter.paging.goToNext()"
                >Next</Button
            >
            <Button
                variant="neutral"
                :disabled="adapter.paging.loading || !adapter.paging.has_next"
                @click="adapter.paging.goToLast()"
                >Last</Button
            >
            <Button :disabled="adapter.paging.loading" @click="adapter.paging.reload()"
                >Reload</Button
            >
        </div>
        <CodeExample
            v-if="adapter.accepted"
            label="Accepted server state"
            language="json"
            :code="JSON.stringify(adapter.accepted, null, 2)" />
    </div>
</template>
