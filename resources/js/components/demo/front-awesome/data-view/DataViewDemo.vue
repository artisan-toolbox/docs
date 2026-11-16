<script setup>
import { DataAdapter } from '@artisan-toolbox/dapter';
import {
    Button,
    Card,
    Details,
    Option,
    Select,
    Spinner,
    Tag,
} from '@artisan-toolbox/front-awesome/components/WebAwesome';
import { ref } from 'vue';
import DemoFrame from '@/components/demo/DemoFrame.vue';
import DataViewPreview from './DataViewPreview.vue';
import demoSource from './DataViewDemo.vue?raw';
import previewSource from './DataViewPreview.vue?raw';

const sources = [
    { label: 'DataViewDemo.vue', language: 'vue', code: demoSource },
    { label: 'DataViewPreview.vue', language: 'vue', code: previewSource },
];
const columns = [
    { id: 'number', label: 'No.', field: 'id' },
    { id: 'notebook', label: 'Notebook', field: 'name' },
    { id: 'paper', label: 'Paper', field: 'category' },
];
const layouts = {
    all: { label: 'Table, cards, and list', views: ['table', 'cards', 'list'] },
    table: { label: 'Table only', views: ['table'] },
    cards: { label: 'Cards only', views: ['cards'] },
};
const preset = ref('all');
const source = ref(null);

function decodeNotebook(row) {
    if (
        !Number.isSafeInteger(row?.id) ||
        typeof row.name !== 'string' ||
        typeof row.category !== 'string'
    ) {
        throw new Error('Expected a notebook with an ID, name, and paper type.');
    }
    return { id: row.id, name: row.name, category: row.category };
}
</script>

<template>
    <DemoFrame
        data-testid="data-view-demo"
        data-search-exclude
        title="Notebook catalog"
        description="Start the catalog to request the first five notebooks. Change the layout to compare the same records."
        :sources="sources">
        <div class="flex min-w-0 flex-col gap-4">
            <div class="flex flex-wrap gap-2">
                <template v-if="!source">
                    <Button variant="brand" @click="source = 'Dapter.CollectionFluent'"
                        >Start catalog</Button
                    >
                    <Button
                        variant="neutral"
                        appearance="outlined"
                        @click="source = 'Dapter.CollectionGateDeny'"
                        >Try denied source</Button
                    >
                </template>
                <Button v-else variant="neutral" size="s" @click="source = null">Reset</Button>
            </div>
            <p v-if="!source" role="status" class="text-sm">No source is running.</p>
            <DataAdapter v-else :source="source" :decode-row="decodeNotebook" v-slot="adapter">
                <div class="flex min-w-0 flex-col gap-4">
                    <p role="status" class="flex flex-wrap items-center gap-2 text-sm">
                        <Spinner v-if="adapter.paging.loading" aria-label="Loading catalog" />
                        <template v-if="adapter.paging.loading">
                            {{
                                adapter.ready
                                    ? 'Updating the catalog. Showing the last accepted page.'
                                    : 'Loading the first page…'
                            }}
                        </template>
                        <template v-else-if="adapter.error"
                            >The request failed.
                            <span v-if="adapter.ready"
                                >Showing the last accepted page.</span
                            ></template
                        >
                        <template v-else-if="adapter.ready && adapter.paging.empty"
                            >No notebooks match.</template
                        >
                        <template v-if="adapter.ready"
                            >Page {{ adapter.paging.current }} of {{ adapter.paging.pages }} ·
                            {{ adapter.paging.filtered }} matching of
                            {{ adapter.paging.total }} notebooks</template
                        >
                    </p>
                    <p
                        v-if="adapter.error"
                        role="alert"
                        class="flex flex-wrap items-center gap-2 text-sm">
                        <Tag variant="danger">{{ adapter.error.kind }}</Tag>
                        {{ adapter.error.message }}
                    </p>
                    <DataViewPreview
                        v-if="adapter.ready && !adapter.paging.empty"
                        :rows="adapter.data"
                        :views="layouts[preset].views"
                        :columns="layouts[preset].views.includes('table') ? columns : []">
                        <template #cell-notebook="{ value }"
                            ><strong class="font-semibold">{{ value }}</strong></template
                        >
                        <template #cell-paper="{ value }"><Tag size="s">{{ value }}</Tag></template>
                        <template #cards="{ record }">
                            <Card class="h-full w-full">
                                <div class="flex flex-col items-start gap-[0.5rem]">
                                    <span class="text-xs text-slate-500 dark:text-slate-400"
                                        >Catalog no. {{ record.id }}</span
                                    >
                                    <strong>{{ record.name }}</strong>
                                    <Tag size="s" variant="brand">{{ record.category }}</Tag>
                                </div>
                            </Card>
                        </template>
                        <template #list="{ record }">
                            <div
                                class="flex flex-wrap items-baseline justify-between gap-2 py-3 text-sm">
                                <strong>{{ record.name }}</strong
                                ><span>{{ record.category }} paper</span>
                            </div>
                        </template>
                    </DataViewPreview>
                    <div class="flex flex-wrap gap-2" role="group" aria-label="Catalog paging">
                        <template v-if="adapter.ready">
                            <Button
                                size="s"
                                :disabled="adapter.paging.loading || !adapter.paging.has_previous"
                                @click="adapter.paging.goToFirst()"
                                >First</Button
                            >
                            <Button
                                size="s"
                                :disabled="adapter.paging.loading || !adapter.paging.has_previous"
                                @click="adapter.paging.goToPrevious()"
                                >Previous</Button
                            >
                            <Button
                                size="s"
                                :disabled="adapter.paging.loading || !adapter.paging.has_next"
                                @click="adapter.paging.goToNext()"
                                >Next</Button
                            >
                            <Button
                                size="s"
                                :disabled="adapter.paging.loading || !adapter.paging.has_next"
                                @click="adapter.paging.goToLast()"
                                >Last</Button
                            >
                        </template>
                        <Button
                            size="s"
                            :disabled="adapter.paging.loading"
                            @click="adapter.paging.reload()"
                            >Reload</Button
                        >
                    </div>
                    <Details summary="Layout settings and adapter state" class="min-w-0 text-sm">
                        <div class="mt-[0.75rem] flex min-w-0 flex-col gap-[0.75rem]">
                            <Select v-model="preset" label="Configured layouts">
                                <Option v-for="(layout, id) in layouts" :key="id" :value="id">{{
                                    layout.label
                                }}</Option>
                            </Select>
                            <div v-if="adapter.ready" class="grid gap-[0.75rem] @sm:grid-cols-2">
                                <Select
                                    label="Go to page"
                                    :model-value="String(adapter.paging.current)"
                                    :disabled="adapter.paging.loading"
                                    @update:model-value="adapter.paging.goToPage(Number($event))">
                                    <Option
                                        v-for="page in adapter.paging.pages"
                                        :key="page"
                                        :value="String(page)"
                                        >{{ page }}</Option
                                    >
                                </Select>
                                <Select
                                    label="Rows per page"
                                    :model-value="String(adapter.paging.per_page.value)"
                                    :disabled="adapter.paging.loading"
                                    @update:model-value="
                                        adapter.paging.per_page.setValue(Number($event))
                                    ">
                                    <Option
                                        v-for="size in adapter.paging.per_page.options"
                                        :key="size"
                                        :value="String(size)"
                                        >{{ size }}</Option
                                    >
                                </Select>
                            </div>
                            <dl class="grid min-w-0 gap-[0.5rem]">
                                <dt class="font-semibold">Status</dt>
                                <dd>{{ adapter.status }}</dd>
                                <dt class="font-semibold">Requested state</dt>
                                <dd>
                                    <pre class="overflow-x-auto">{{
                                        JSON.stringify(adapter.requested, null, 2)
                                    }}</pre>
                                </dd>
                                <dt class="font-semibold">Accepted state</dt>
                                <dd>
                                    <pre class="overflow-x-auto">{{
                                        JSON.stringify(adapter.accepted, null, 2)
                                    }}</pre>
                                </dd>
                            </dl>
                        </div>
                    </Details>
                </div>
            </DataAdapter>
        </div>
    </DemoFrame>
</template>
