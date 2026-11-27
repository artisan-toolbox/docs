<script setup>
import { useDataAdapter } from '@artisan-toolbox/dapter';
import { Button, Input, Select } from '@artisan-toolbox/front-awesome/components/WebAwesome';
const props = defineProps({ adapter: { type: Object, required: true } });
const catalog = useDataAdapter(props.adapter);
</script>

<template>
    <div class="flex min-w-0 flex-col gap-3" data-vue-controls>
        <div v-if="catalog.fields?.name?.search" class="w-fit max-w-full">
            <Input
                label="Search name"
                :model-value="catalog.fields.name.search.current?.value ?? ''"
                @update:model-value="
                    catalog.fields.name.search.call({ value: $event, matchType: 'contains' })
                " />
            <p class="text-sm">
                Available matches {{ catalog.fields.name.search.available.matchTypes.join(', ') }}.
                Current search {{ catalog.fields.name.search.current?.value ?? 'none' }}.
            </p>
        </div>
        <div class="flex flex-wrap gap-2">
            <Button
                v-if="catalog.fields?.name?.search"
                variant="neutral"
                @click="catalog.fields.name.search.clear()"
                >Clear search</Button
            >
            <Button
                v-if="catalog.fields?.name?.order"
                @click="
                    catalog.fields.name.order.call({
                        direction: 'desc',
                        sortType: 'natural',
                        multiSort: false,
                    })
                "
                >Name descending</Button
            >
            <Button
                v-if="catalog.fields?.name?.order"
                @click="
                    catalog.fields.name.order.call(
                        { direction: 'desc', sortType: 'natural', multiSort: false },
                        { page: 'preserve' },
                    )
                "
                >Name descending, keep page</Button
            >
            <Button
                v-if="catalog.fields?.name?.order"
                variant="neutral"
                @click="catalog.fields.name.order.clear()"
                >Clear order</Button
            >
            <Button
                v-if="catalog.fields?.category?.filters?.category"
                @click="catalog.fields.category.filters.category.call({ value: 'tools' })"
                >Tools only</Button
            >
            <Button
                v-if="catalog.fields?.category?.filters?.category"
                variant="neutral"
                @click="catalog.fields.category.filters.category.clear()"
                >Clear category</Button
            >
            <Button
                v-if="catalog.fields?.active?.filters?.active"
                @click="catalog.fields.active.filters.active.call({ value: false })"
                >Inactive false</Button
            >
            <Button
                v-if="catalog.fields?.score?.filters?.score"
                @click="catalog.fields.score.filters.score.call({ value: 0 })"
                >Score zero</Button
            >
            <Button
                v-if="catalog.fields?.optional?.filters?.optional"
                @click="catalog.fields.optional.filters.optional.call({ value: null })"
                >Selected null</Button
            >
        </div>
        <p v-if="catalog.fields?.name?.order" class="text-sm">
            Available sorts {{ catalog.fields.name.order.available.sortTypes.join(', ') }}. Current
            order {{ JSON.stringify(catalog.fields.name.order.current) }}.
        </p>
        <p v-if="catalog.fields?.optional?.filters?.optional" class="text-sm" data-null-selection>
            Allowed optional values
            {{ JSON.stringify(catalog.fields.optional.filters.optional.available.values) }}. Current
            optional selection
            {{ JSON.stringify(catalog.fields.optional.filters.optional.current) }}.
        </p>
        <div v-if="catalog.ready" class="w-fit">
            <Select
                label="Catalog page size"
                :model-value="catalog.paging.per_page.value"
                @update:model-value="catalog.paging.per_page.setValue($event)"
                :options="catalog.paging.per_page.options" />
        </div>
    </div>
</template>
