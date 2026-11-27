<script setup>
import { ref } from 'vue';
import { DataAdapter, useDataAdapter } from '@artisan-toolbox/dapter';
import { Button, Input, Select } from '@artisan-toolbox/front-awesome/components/WebAwesome';
import CodeExample from '@/components/docs/CodeExample.vue';
const props = defineProps({ source: { type: String, required: true }, recovery: Boolean });
const catalog = useDataAdapter(props.source, {
    protocol: 2,
    paging: 'source',
    id: `paging-${props.source}`,
    url: true,
    searchDebounce: 0,
});
const acquired = useDataAdapter(catalog);
const outcome = ref('');
const fixtureStatus = ref('');
async function rejectPreset() {
    const result = await catalog.global.order.call({ id: 'reverse' });
    outcome.value = result.status === 'failure' ? result.error.kind : result.status;
}
async function preserve() {
    const result = await catalog.fields.name.search.call(
        { value: 'Notebook', matchType: 'contains' },
        { page: 'preserve' },
    );
    outcome.value = result.status === 'failure' ? result.error.kind : result.status;
}
async function changeFixture(action) {
    fixtureStatus.value = 'Updating fictional session.';
    try {
        const response = await fetch(`/demo/dapter/paging/${action}`, {
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
        if (!response.ok) throw new Error('The fictional fixture could not update.');
        fixtureStatus.value =
            action === 'expire'
                ? 'Demonstration time advanced by 901 seconds. Click Next or Reload.'
                : 'Fictional tenant changed to 2. Click Next or Reload.';
    } catch {
        fixtureStatus.value = 'The fictional fixture could not update. Reset and try again.';
    }
}
</script>
<template>
    <DataAdapter :adapter="catalog" v-slot="view">
        <div class="flex min-w-0 flex-col gap-4" data-paging-session>
            <p role="status" data-paging-status>
                {{
                    view.paging.loading
                        ? 'Loading notebooks.'
                        : `Mode ${view.paging.mode ?? 'unready'}.`
                }}
                <template v-if="view.paging.mode === 'simple'"
                    >Ordinal {{ view.paging.current }}.</template
                >
                <template v-if="view.paging.counts === 'exact'"
                    >{{ view.paging.total }} authorized.
                    {{ view.paging.filtered }} matching.</template
                >
                <template v-else>Exact counts omitted.</template>
            </p>
            <p data-paging-null-actions>
                Numbered action {{ view.paging.goToPage === null ? 'null' : 'available' }}. Last
                action {{ view.paging.goToLast === null ? 'null' : 'available' }}.
            </p>
            <p v-if="view.error" role="alert" data-paging-error>
                {{ view.error.kind }}. {{ view.error.message }}
            </p>
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
                <Button v-if="view.error" @click="view.paging.goToFirst()"
                    >Restart pagination</Button
                >
            </div>
            <Select
                label="Notebooks per page"
                :model-value="view.paging.per_page.value ?? 2"
                @update:model-value="view.paging.per_page.setValue($event)"
                :options="view.paging.per_page.options" />
            <Input
                v-if="view.fields?.name?.search"
                label="Notebook name"
                :model-value="view.fields.name.search.current?.value ?? ''"
                @update:model-value="
                    view.fields.name.search.call({ value: $event, matchType: 'contains' })
                " />
            <div v-if="view.fields?.name?.order" class="flex flex-wrap gap-2">
                <Button
                    @click="view.fields.name.order.call({ direction: 'desc', sortType: 'native' })"
                    >Name descending</Button
                >
                <Button
                    v-if="view.fields.rank?.order"
                    @click="
                        view.fields.rank.order.call({
                            direction: 'asc',
                            sortType: 'native',
                            multiSort: true,
                        })
                    "
                    >Append rank ascending</Button
                >
                <Button @click="view.fields.name.order.clear()">Clear name order</Button>
                <Button @click="preserve">Reject page preservation</Button>
            </div>
            <Button v-if="view.global?.order" @click="rejectPreset">Reject order preset</Button>
            <p v-if="outcome" data-local-outcome>{{ outcome }}</p>
            <div v-if="recovery" class="flex flex-wrap gap-2">
                <Button @click="changeFixture('expire')">Advance demonstration time</Button>
                <Button @click="changeFixture('scope')">Change fictional scope</Button>
            </div>
            <p v-if="fixtureStatus" role="status">{{ fixtureStatus }}</p>
            <ul aria-label="Accepted notebook rows">
                <li v-for="row in acquired.data" :key="row.id" :data-paging-row="row.id">
                    {{ row.name }}
                </li>
            </ul>
            <p v-if="view.ready && view.data.length === 0">No matching notebooks.</p>
            <CodeExample
                label="Complete requested paging state"
                language="json"
                :code="JSON.stringify(view.requested, null, 2)" />
        </div>
    </DataAdapter>
</template>
