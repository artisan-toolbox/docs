<script setup>
import { ref } from 'vue';
import { DataAdapter } from '@artisan-toolbox/dapter';
import { Button } from '@artisan-toolbox/front-awesome/components/WebAwesome';
import CodeExample from '@/components/docs/CodeExample.vue';
import FieldControls from './FieldControls.vue';
import RowsView from './RowsView.vue';
import { decodeDefinition, decodeRow } from './catalog';
const viewport = ref(null);
</script>

<template>
    <DataAdapter
        source="Dapter.VueCatalog"
        id="vue-definition"
        :protocol="2"
        :decode-row="decodeRow"
        :decode-definition="decodeDefinition"
        :search-debounce="100"
        :url="false"
        :scroll-container="viewport"
        v-slot="adapter">
        <div class="flex min-w-0 flex-col gap-4" data-vue-source-session>
            <p role="status">
                {{
                    adapter.paging.loading
                        ? 'Loading narrowed catalog.'
                        : `Narrowed catalog page ${adapter.paging.current}.`
                }}
            </p>
            <p v-if="adapter.error" role="alert">{{ adapter.error.message }}</p>
            <FieldControls :adapter="adapter" />
            <div class="flex flex-wrap gap-2">
                <Button :disabled="!adapter.paging.has_next" @click="adapter.paging.goToNext()"
                    >Next narrowed page</Button
                ><Button @click="adapter.paging.reload()">Reload narrowed page</Button>
            </div>
            <div
                ref="viewport"
                tabindex="0"
                aria-label="Narrowed catalog scroll region"
                class="max-h-40 overflow-auto rounded border border-slate-300 p-3 dark:border-slate-600"
                data-source-scroll>
                <div class="min-h-80"><RowsView :adapter="adapter" /></div>
            </div>
            <CodeExample
                label="Narrowed public definition"
                language="json"
                :code="JSON.stringify(adapter.definition, null, 2)" />
            <CodeExample
                label="Record metadata"
                language="json"
                :code="JSON.stringify(adapter.metadata, null, 2)" />
        </div>
    </DataAdapter>
</template>
