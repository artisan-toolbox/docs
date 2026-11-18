<script setup>
import { ref } from 'vue';
import { DataAdapter, useDataAdapter } from '@artisan-toolbox/dapter';
import { Button } from '@artisan-toolbox/front-awesome/components/WebAwesome';
import { demoEcho } from '@/components/demo/mosaicast/inertia-delivery/broadcast';
import { fixtureRequest } from './request';
const props = defineProps({ source: { type: String, required: true }, polling: Boolean });
const catalog = useDataAdapter(props.source, {
    id: `live-${props.source}`,
    protocol: 2,
    url: false,
    decodeRow: (row) => {
        if (typeof row.name !== 'string' || Object.hasOwn(row, 'id'))
            throw new Error('Expected projected notebook data only.');
        return { ...row, label: row.name.toUpperCase() };
    },
    ...(props.polling ? { polling: { interval: 1500 } } : { echo: demoEcho }),
});
const status = ref('Ready for an explicit fictional update.');
const busy = ref(false);
async function change(operation) {
    busy.value = true;
    try {
        const response = await fixtureRequest('change', { source: props.source, operation });
        status.value = `Fictional ${operation} accepted. Revision ${response.revision ?? 'unchanged'}.`;
        if (operation === 'scope' || operation === 'revoke') await catalog.resetContext();
    } catch (error) {
        status.value = error.message;
    } finally {
        busy.value = false;
    }
}
</script>
<template>
    <DataAdapter :adapter="catalog" v-slot="view">
        <div class="flex min-w-0 flex-col gap-4" data-live-session>
            <p role="status" data-live-status>
                {{ view.paging.loading ? 'Reading fictional notebooks.' : status }}
            </p>
            <p v-if="view.error" role="alert" data-live-http-error>
                {{ view.error.kind }}. {{ view.error.message }}
            </p>
            <p v-if="view.integrationError" role="alert" data-live-integration-error>
                {{ view.integrationError.code }}. {{ view.integrationError.message }}
            </p>
            <p data-live-metadata>
                Page {{ view.paging.current }}. Total {{ view.paging.total }}. Matching
                {{ view.paging.filtered }}.
            </p>
            <ul aria-label="Accepted projected notebooks">
                <li v-for="(row, index) in view.data" :key="index" :data-live-row="index">
                    {{ row.name
                    }}<span v-if="row.label" class="sr-only" data-decoded-label>{{
                        row.label
                    }}</span
                    ><template v-if="row.details"
                        >. Reader {{ row.details.selected }}. Nested
                        {{ row.related[0].selected }}.</template
                    >
                </li>
            </ul>
            <div class="flex flex-wrap gap-2">
                <Button
                    :disabled="busy || !view.ready"
                    @click="change(polling ? 'mutate' : 'update')"
                    >{{ polling ? 'Change fixture only' : 'Publish one replacement' }}</Button
                >
                <template v-if="!polling">
                    <Button :disabled="busy || !view.ready" @click="change('batch')"
                        >Publish batch</Button
                    >
                    <Button :disabled="busy || !view.ready" @click="change('unknown')"
                        >Publish unknown ID</Button
                    >
                    <Button :disabled="busy || !view.ready" @click="change('rollback')"
                        >Roll back update</Button
                    >
                    <Button :disabled="busy || !view.ready" @click="change('older')"
                        >Publish older revision</Button
                    >
                </template>
                <Button @click="view.paging.reload()">Reload explicitly</Button>
                <Button v-if="polling" @click="catalog.restartPolling()">Restart polling</Button>
                <Button @click="catalog.resetContext()">Reset adapter context</Button>
                <Button :disabled="busy" @click="change('scope')">Change fictional tenant</Button>
                <Button :disabled="busy" @click="change('revoke')">Revoke fictional access</Button>
            </div>
            <p v-if="!polling">
                Updates use Redis queue demos. A worker and the application broadcaster must be
                available. The producer does not persist application rows.
            </p>
        </div>
    </DataAdapter>
</template>
