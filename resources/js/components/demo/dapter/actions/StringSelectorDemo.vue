<script setup>
import { ref } from 'vue';
import { DataAdapter } from '@artisan-toolbox/dapter';
import { Button } from '@artisan-toolbox/front-awesome/components/WebAwesome';

const started = ref(false);
const outcome = ref(null);

async function inspect(actions, recordId) {
    outcome.value = null;
    const payload =
        recordId.trim() === recordId
            ? { recordId }
            : {
                  recordId,
                  attachment: new File(['Read-only inspection.'], 'inspection.txt', {
                      type: 'text/plain',
                  }),
              };
    outcome.value = await actions.http('inspect', payload);
}
</script>

<template>
    <div v-if="!started">
        <Button @click="started = true">Load string records</Button>
    </div>
    <DataAdapter
        v-else
        source="Dapter.StringActionCatalog"
        :protocol="2"
        :url="false"
        v-slot="catalog">
        <p v-if="catalog.paging.loading" role="status">Loading string records.</p>
        <p v-else-if="catalog.error" role="alert">{{ catalog.error.message }}</p>
        <div v-else class="flex flex-col gap-3">
            <div class="flex flex-wrap gap-2">
                <Button
                    v-for="entry in catalog.actions?.available.inspect?.target.values"
                    :key="entry.value"
                    :disabled="catalog.actions.pending > 0"
                    @click="inspect(catalog.actions, entry.value)">
                    Inspect {{ JSON.stringify(entry.value) }}
                </Button>
            </div>
            <p v-if="catalog.actions?.pending" role="status">Inspecting the selected record.</p>
            <p v-else-if="outcome?.status === 'completed'" role="status">
                Confirmed record ID
                <code class="whitespace-pre-wrap" data-string-selector-result>{{
                    outcome.data.selected
                }}</code>
                <span>{{ outcome.data.selected.length }} characters.</span>
            </p>
            <p v-else-if="outcome" role="alert">The inspection returned {{ outcome.status }}.</p>
            <p v-else-if="!catalog.actions?.available.inspect" role="status">
                No records are available to inspect.
            </p>
        </div>
    </DataAdapter>
</template>
