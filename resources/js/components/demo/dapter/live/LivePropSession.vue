<script setup>
import { ref } from 'vue';
import { DataAdapter } from '@artisan-toolbox/dapter';
import { Button } from '@artisan-toolbox/front-awesome/components/WebAwesome';
import { demoEcho } from '@/components/demo/mosaicast/inertia-delivery/broadcast';
import { fixtureRequest } from './request';
const props = defineProps({ source: { type: String, required: true }, polling: Boolean });
const status = ref('Component props own this listing.');
async function change() {
    try {
        await fixtureRequest('change', {
            source: props.source,
            operation: props.polling ? 'mutate' : 'update',
        });
        status.value = 'Fictional update accepted.';
    } catch (error) {
        status.value = error.message;
    }
}
</script>
<template>
    <DataAdapter
        :source="source"
        :id="`live-${source}`"
        :protocol="2"
        :url="false"
        :echo="polling ? undefined : demoEcho"
        :polling="polling ? { interval: 1500 } : false"
        v-slot="view">
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
                    {{ row.name }}. Reader {{ row.details.selected }}. Nested
                    {{ row.related[0].selected }}.
                </li>
            </ul>
            <div class="flex flex-wrap gap-2">
                <Button :disabled="!view.ready" @click="change">{{
                    polling ? 'Change fixture only' : 'Publish one replacement'
                }}</Button>
                <Button @click="view.paging.reload()">Reload explicitly</Button>
                <Button v-if="polling" @click="view.restartPolling()">Restart polling</Button>
                <Button @click="view.resetContext()">Reset adapter context</Button>
            </div>
        </div>
    </DataAdapter>
</template>
