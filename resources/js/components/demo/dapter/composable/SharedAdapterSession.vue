<script setup>
import { DataAdapter, useDataAdapter } from '@artisan-toolbox/dapter';
import { Button } from '@artisan-toolbox/front-awesome/components/WebAwesome';
import { computed, ref } from 'vue';
import CatalogView from '../listing/CatalogView.vue';
import { decodeProduct } from '../listing/products';
import SharedControls from './SharedControls.vue';

const source = ref('Dapter.CollectionFluent');
const catalog = useDataAdapter(source, { id: 'shared-catalog', decodeRow: decodeProduct });
const independent = useDataAdapter('Dapter.CollectionFluent', {
    id: 'independent-catalog',
    decodeRow: decodeProduct,
});
const currentPage = computed(() => catalog.paging.current);
</script>

<template>
    <div class="flex min-w-0 flex-col gap-6">
        <section
            class="flex min-w-0 flex-col gap-4"
            data-shared-store="catalog"
            aria-label="Shared catalog">
            <p role="status" class="text-sm">Host controls read page {{ currentPage }}.</p>
            <div class="flex flex-wrap gap-3">
                <Button
                    :disabled="catalog.paging.loading || !catalog.paging.has_next"
                    @click="catalog.paging.goToNext()"
                    >Next from host</Button
                >
                <Button
                    variant="neutral"
                    :disabled="source === 'Dapter.CollectionDefaults'"
                    @click="source = 'Dapter.CollectionDefaults'"
                    >Use ten-row source</Button
                >
                <Button
                    variant="neutral"
                    :disabled="source === 'Dapter.CollectionFluent'"
                    @click="source = 'Dapter.CollectionFluent'"
                    >Use five-row source</Button
                >
            </div>
            <SharedControls :adapter="catalog" />
            <DataAdapter :adapter="catalog" v-slot="adapter">
                <CatalogView :adapter="adapter" />
            </DataAdapter>
        </section>
        <section
            class="flex flex-col gap-3 rounded-lg border border-slate-200 p-4 dark:border-slate-700"
            data-shared-store="independent"
            aria-label="Independent catalog">
            <p role="status" class="text-sm">
                <template v-if="independent.paging.loading"
                    >Loading independent catalog...</template
                >
                <template v-else
                    >Independent store reads page {{ independent.paging.current }} with
                    {{ independent.data.length }} rows.</template
                >
            </p>
            <p v-if="independent.error" role="alert">{{ independent.error.message }}</p>
            <div>
                <Button
                    variant="neutral"
                    :disabled="independent.paging.loading || !independent.paging.has_next"
                    @click="independent.paging.goToNext()"
                    >Next independent page</Button
                >
            </div>
        </section>
    </div>
</template>
