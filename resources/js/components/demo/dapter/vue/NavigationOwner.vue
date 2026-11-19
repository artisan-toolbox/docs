<script setup>
import { ref } from 'vue';
import { DataAdapter, useDataAdapter } from '@artisan-toolbox/dapter';
import { Button } from '@artisan-toolbox/front-awesome/components/WebAwesome';
import FieldControls from './FieldControls.vue';
import RowsView from './RowsView.vue';
import { decodeRow } from './catalog';
const props = defineProps({ identity: { type: String, required: true } });
const viewport = ref(null);
const sharedUrl = ref(null);
const catalog = useDataAdapter('Dapter.VueCatalog', {
    protocol: 2,
    id: props.identity,
    decodeRow,
    searchDebounce: 150,
    scrollContainer: viewport,
});
</script>

<template>
    <section
        class="flex min-w-0 flex-col gap-4 rounded border border-slate-300 p-3 dark:border-slate-600"
        :data-navigation-owner="identity"
        :aria-label="identity + ' catalog'">
        <h3 class="font-medium">{{ identity }} catalog</h3>
        <p role="status">
            {{
                catalog.paging.loading
                    ? 'Loading saved catalog.'
                    : `Saved catalog page ${catalog.paging.current}. ${catalog.paging.filtered} matching records.`
            }}
        </p>
        <p v-if="catalog.error" role="alert">
            {{ catalog.error.kind }}. {{ catalog.error.message }}
        </p>
        <FieldControls :adapter="catalog" />
        <div class="flex flex-wrap gap-2">
            <Button :disabled="!catalog.paging.has_next" @click="catalog.paging.goToNext()"
                >Next saved page</Button
            ><Button @click="catalog.paging.reload()">Reload saved catalog</Button
            ><Button @click="catalog.resetState()">Reset saved state</Button>
            <Button @click="sharedUrl = catalog.share()">Create share URL</Button>
        </div>
        <p v-if="sharedUrl" class="break-all" data-share-url>{{ sharedUrl }}</p>
        <div
            ref="viewport"
            tabindex="0"
            :aria-label="identity + ' scroll region'"
            class="max-h-40 overflow-auto rounded border border-slate-300 p-3 dark:border-slate-600"
            data-navigation-scroll>
            <div class="min-h-80">
                <DataAdapter :adapter="catalog" v-slot="adapter"
                    ><RowsView :adapter="adapter"
                /></DataAdapter>
            </div>
        </div>
    </section>
</template>
