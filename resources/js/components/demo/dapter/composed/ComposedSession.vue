<script setup>
import { useDataAdapter } from '@artisan-toolbox/dapter';
import {
    Button,
    Input,
    Select,
    Option,
} from '@artisan-toolbox/front-awesome/components/WebAwesome';
import CodeExample from '@/components/docs/CodeExample.vue';
const catalog = useDataAdapter('Dapter.ComposedCatalog', {
    protocol: 2,
    id: 'composed-controls',
    searchDebounce: 150,
    url: true,
});
</script>
<template>
    <div class="flex min-w-0 flex-col gap-4" data-composed-session>
        <p role="status">
            {{
                catalog.paging.loading
                    ? 'Loading composed catalog.'
                    : `${catalog.paging.filtered} matching records.`
            }}
        </p>
        <p v-if="catalog.error" role="alert">{{ catalog.error.message }}</p>
        <Input
            v-if="catalog.global?.search"
            label="Global catalog search"
            :model-value="catalog.global.search.current?.value ?? ''"
            @update:model-value="catalog.global.search.call({ value: $event })" />
        <div class="flex flex-wrap gap-2">
            <Button v-if="catalog.global?.search" @click="catalog.global.search.clear()"
                >Clear global search</Button
            ><Button
                v-if="catalog.global?.filters?.status"
                @click="catalog.global.filters.status.call({ value: 'paused' })"
                >Paused only</Button
            ><Button
                v-if="catalog.global?.filters?.status"
                @click="catalog.global.filters.status.clear()"
                >Clear status</Button
            ><Button
                v-if="catalog.fields?.name?.order"
                @click="catalog.fields.name.order.call({ direction: 'asc', sortType: 'natural' })"
                >Order by name</Button
            ><Button
                v-if="catalog.fields?.quantity?.order"
                @click="
                    catalog.fields.quantity.order.call({
                        direction: 'desc',
                        sortType: 'numeric',
                        multiSort: true,
                    })
                "
                >Append quantity</Button
            ><Button v-if="catalog.fields?.name?.order" @click="catalog.fields.name.order.clear()"
                >Clear name order</Button
            ><Button
                v-if="catalog.global?.order"
                @click="catalog.global.order.call({ id: 'reverse' })"
                >Newest preset</Button
            ><Button v-if="catalog.global?.order" @click="catalog.global.order.clear()"
                >Clear preset</Button
            ><Button @click="catalog.resetState()">Restore composed defaults</Button>
        </div>
        <Select
            v-if="catalog.setSearchMatch"
            label="Search grouping"
            :model-value="catalog.requested?.searchMatch ?? 'all'"
            @update:model-value="catalog.setSearchMatch($event)"
            ><Option value="all">All</Option><Option value="any">Any</Option></Select
        >
        <ul aria-label="Composed rows">
            <li v-for="row in catalog.data" :key="row.id" :data-composed-row="row.id">
                {{ row.id }}. {{ row.name }}. {{ row.status }}
            </li>
        </ul>
        <p v-if="catalog.fields?.name?.order" data-order-priority>
            Name priority {{ catalog.fields.name.order.current?.priority ?? 'none' }}. Quantity
            priority {{ catalog.fields.quantity.order.current?.priority ?? 'none' }}.
        </p>
        <CodeExample
            label="Requested composed state"
            language="json"
            :code="JSON.stringify(catalog.requested, null, 2)" /><CodeExample
            label="Effective composed order"
            language="json"
            :code="JSON.stringify(catalog.accepted, null, 2)" />
    </div>
</template>
