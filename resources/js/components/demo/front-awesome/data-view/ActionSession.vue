<script setup>
import { ref } from 'vue';
import { useDataAdapter } from '@artisan-toolbox/dapter';
import { DataView } from '@artisan-toolbox/front-awesome/data-view';
import { Button } from '@artisan-toolbox/front-awesome/components/WebAwesome';
import { actionDefinitions } from '../../dapter/actions/definitions';
const catalog = useDataAdapter('Dapter.ActionCatalog', {
    protocol: 2,
    id: 'data-view-actions',
    url: false,
    actionDefinitions,
});
const outcome = ref(null);
const views = {
    table: {
        columns: [
            { field: 'name', label: 'Notebook' },
            { field: 'writes', label: 'Writes' },
        ],
    },
};
async function save(adapter) {
    outcome.value = await adapter.actions.http('save', { name: 'DataView reader' });
}
</script>
<template>
    <DataView :adapter="catalog" :views="views" row-key="id" label="Authorized notebook actions">
        <template #actions="{ adapter }">
            <div class="flex flex-wrap gap-[0.5rem]">
                <Button
                    :disabled="!adapter.actions?.available.save || adapter.actions.pending > 0"
                    @click="save(adapter)"
                    >Save fictional notebook</Button
                >
                <Button @click="adapter.paging.reload()">Reload write counter</Button>
            </div>
        </template>
        <template #footer="{ adapter }">
            <p data-action-state>
                Shared handle {{ adapter === catalog ? 'yes' : 'no' }}. Pending
                {{ adapter.actions?.pending ?? 0 }}.
            </p>
            <p v-if="outcome" data-action-outcome>
                Outcome {{ outcome.status }}. Commit {{ outcome.commit }}.
            </p>
        </template>
    </DataView>
</template>
