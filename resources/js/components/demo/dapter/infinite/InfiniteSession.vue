<script setup>
import { ref } from 'vue';
import { DataAdapter, useDataAdapter } from '@artisan-toolbox/dapter';
import { Button, Input } from '@artisan-toolbox/front-awesome/components/WebAwesome';
import { route } from 'ziggy-js';
import CodeExample from '@/components/docs/CodeExample.vue';
const props = defineProps({
    source: { type: String, required: true },
    axis: { type: String, default: 'y' },
    fill: Boolean,
    recovery: Boolean,
});
const root = ref(null);
const sentinel = ref(null);
const rootGeneration = ref(0);
const sentinelGeneration = ref(0);
const catalog = useDataAdapter(props.source, {
    protocol: 2,
    paging: 'source',
    id: `infinite-${props.source}-${props.fill ? 'fill' : props.axis}`,
    url: true,
    scrollContainer: root,
    searchDebounce: 0,
    infinite: props.axis === 'x' ? { root, sentinel, axis: 'x' } : { root, sentinel },
});
const acquired = useDataAdapter(catalog);
const fixtureStatus = ref('');
const localOutcome = ref('');
async function changeFixture(action) {
    try {
        const response = await fetch(route(`demo.dapter.infinite.${action}`), {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                Accept: 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                'X-XSRF-TOKEN': decodeURIComponent(
                    document.cookie
                        .split('; ')
                        .find((cookie) => cookie.startsWith('XSRF-TOKEN='))
                        ?.slice(11) ?? '',
                ),
            },
        });
        if (!response.ok) throw new Error('The fictional service could not update.');
        fixtureStatus.value =
            action === 'fail'
                ? 'The next read fails. Click Load more.'
                : 'The fictional service is available. Click Retry append.';
    } catch {
        fixtureStatus.value = 'The fictional service could not update. Reset and try again.';
    }
}
async function preserve() {
    const outcome = await catalog.fields.name.search.call(
        { value: 'Notebook', matchType: 'contains' },
        { page: 'preserve' },
    );
    localOutcome.value = outcome.status === 'failure' ? outcome.error.kind : outcome.status;
}
</script>
<template>
    <DataAdapter :adapter="catalog" v-slot="view">
        <div class="flex min-w-0 flex-col gap-4" data-infinite-session>
            <p role="status" data-infinite-status>
                {{ view.infinite.status }}. {{ view.data.length }} loaded.
                <span v-if="view.paging.mode !== 'cursor'"
                    >Accepted page {{ view.paging.current }}.</span
                >
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
                <Button
                    :disabled="view.infinite.status === 'loading' || !view.paging.has_next"
                    @click="view.paging.goToNext()"
                    >Navigate to next page</Button
                >
            </div>
            <div class="flex flex-wrap gap-2">
                <Button @click="rootGeneration++">Replace scroll root</Button>
                <Button @click="sentinelGeneration++">Replace sentinel</Button>
            </div>
            <Input
                label="Notebook name"
                :model-value="view.fields?.name?.search?.current?.value ?? ''"
                @update:model-value="
                    view.fields.name.search.call({ value: $event, matchType: 'contains' })
                " />
            <div class="flex flex-wrap gap-2">
                <Button
                    @click="view.fields.name.order.call({ direction: 'desc', sortType: 'native' })"
                    >Name descending</Button
                >
                <Button @click="view.paging.per_page.setValue(3)">Set page size 3</Button>
                <Button @click="preserve">Reject page preservation</Button>
            </div>
            <p v-if="localOutcome" data-infinite-local-outcome>{{ localOutcome }}</p>
            <div v-if="recovery" class="flex flex-wrap gap-2">
                <Button @click="changeFixture('fail')">Fail next read</Button>
                <Button @click="changeFixture('reset')">Allow retry</Button>
            </div>
            <p v-if="fixtureStatus" role="status" data-infinite-fixture-status>
                {{ fixtureStatus }}
            </p>
            <div
                :key="rootGeneration"
                ref="root"
                data-infinite-root
                tabindex="0"
                :aria-label="
                    axis === 'x' ? 'Horizontal notebook window' : 'Vertical notebook window'
                "
                class="min-w-0 rounded-lg border border-slate-300 dark:border-slate-700"
                :class="
                    axis === 'x'
                        ? 'w-full max-w-[400px] overflow-x-auto overflow-y-hidden'
                        : fill
                          ? 'h-[800px] overflow-y-auto'
                          : 'h-[200px] overflow-y-auto'
                ">
                <div :class="axis === 'x' ? 'flex w-max gap-3 p-3' : 'flex flex-col gap-3 p-3'">
                    <article
                        v-for="(row, occurrence) in acquired.data"
                        :key="`${occurrence}:${row.id}`"
                        :data-infinite-row="String(row.id)"
                        class="flex min-h-[112px] shrink-0 flex-col justify-center rounded-lg bg-slate-100 p-4 dark:bg-slate-800"
                        :class="axis === 'x' ? 'w-[240px]' : ''">
                        <p>{{ row.name }}</p>
                        <p class="text-sm">Record {{ row.id }}. Rank {{ row.rank }}.</p>
                    </article>
                    <div
                        :key="sentinelGeneration"
                        ref="sentinel"
                        data-infinite-sentinel
                        :class="axis === 'x' ? 'w-px shrink-0' : 'h-px'"
                        aria-hidden="true" />
                </div>
            </div>
            <p v-if="view.ready && view.data.length === 0">No matching notebooks.</p>
            <p v-if="fill">
                The sentinel stays visible. At most two automatic appends run in this visibility
                episode. Use Load more to finish.
            </p>
            <CodeExample
                label="Latest requested state"
                language="json"
                :code="JSON.stringify(view.requested, null, 2)" />
        </div>
    </DataAdapter>
</template>
