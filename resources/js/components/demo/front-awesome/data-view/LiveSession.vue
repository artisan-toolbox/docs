<script setup>
import { ref, onScopeDispose, watch } from 'vue';
import { useDataAdapter } from '@artisan-toolbox/dapter';
import { DataView } from '@artisan-toolbox/front-awesome/data-view';
import { Button } from '@artisan-toolbox/front-awesome/components/WebAwesome';
import { fixtureRequest } from '../../dapter/live/request';
const props = defineProps({
    mode: { type: String, required: true },
    echo: { type: Object, default: undefined },
});
const polling = props.mode === 'polling';
const catalog = useDataAdapter(polling ? 'FrontAwesome.PollingNotebooks' : 'Dapter.LiveIdentity', {
    protocol: 2,
    url: false,
    ...(polling ? { polling: { interval: 1500 } } : { echo: props.echo }),
});
const views = { table: { columns: [{ field: 'name', label: 'Notebook' }] } };
const keys = ref([]);
const subscription = ref('waiting');
watch(
    () => (!polling && catalog.ready ? catalog.metadata?.channel?.name : null),
    (name, previous, cleanup) => {
        subscription.value = 'waiting';
        if (!name || !props.echo) return;
        const channel = props.echo.private(name).subscription;
        const connection = props.echo.connector.pusher.connection;
        let current = true;
        function acknowledged() {
            if (current && connection.state === 'connected') subscription.value = 'subscribed';
        }
        function failed() {
            if (current) subscription.value = 'failed';
        }
        function stateChanged({ current: state }) {
            if (current && state !== 'connected') subscription.value = 'waiting';
        }
        channel.bind('pusher:subscription_succeeded', acknowledged);
        channel.bind('pusher:subscription_error', failed);
        connection.bind('state_change', stateChanged);
        if (channel.subscribed) acknowledged();
        cleanup(() => {
            current = false;
            channel.unbind('pusher:subscription_succeeded', acknowledged);
            channel.unbind('pusher:subscription_error', failed);
            connection.unbind('state_change', stateChanged);
        });
    },
    { immediate: true, flush: 'sync' },
);
const message = ref('');
const busy = ref(false);
let disposed = false;
onScopeDispose(() => {
    disposed = true;
});
function recordKey(row, index) {
    if (polling) return row.id;
    const records = catalog.metadata?.records;
    const key = records && records.mode !== 'unidentified' ? records.rows[index]?.id : undefined;
    if (typeof key !== 'string' && typeof key !== 'number')
        throw new Error('Expected an authorized identifier for each projected notebook.');
    return key;
}
async function change(operation) {
    if (
        busy.value ||
        !catalog.ready ||
        (operation === 'update' && subscription.value !== 'subscribed')
    )
        return;
    busy.value = true;
    message.value = '';
    try {
        await fixtureRequest('change', {
            source: polling ? 'Dapter.LivePolling' : 'Dapter.LiveIdentity',
            operation,
        });
        if (disposed) return;
        if (operation === 'revoke' || operation === 'scope') {
            keys.value = [];
            await catalog.resetContext();
        } else
            message.value =
                'The fictional fixture changed. Compare the accepted row to see whether it arrived.';
    } catch (error) {
        if (!disposed) message.value = error.message;
    } finally {
        if (!disposed) busy.value = false;
    }
}
</script>
<template>
    <DataView
        :adapter="catalog"
        :views="views"
        :row-key="recordKey"
        selection="single"
        v-model:selected-keys="keys"
        label="Live notebooks">
        <template #actions>
            <div class="flex flex-wrap gap-2">
                <Button
                    :disabled="
                        busy || !catalog.ready || (!polling && subscription !== 'subscribed')
                    "
                    @click="change(polling ? 'mutate' : 'update')"
                    >{{ polling ? 'Change fixture' : 'Publish replacement' }}</Button
                >
                <Button v-if="polling" @click="catalog.restartPolling()">Restart polling</Button>
                <Button :disabled="busy || !catalog.ready" @click="change('scope')"
                    >Switch fictional tenant</Button
                >
                <Button :disabled="busy || !catalog.ready" @click="change('revoke')"
                    >Revoke access</Button
                >
                <Button @click="catalog.paging.reload()">Reload explicitly</Button>
            </div>
        </template>
        <template #footer="{ selection }"
            ><p role="status">{{ message }}</p>
            <p v-if="!polling && catalog.ready" role="status" data-subscription>
                {{
                    subscription === 'subscribed'
                        ? 'Private subscription acknowledged.'
                        : subscription === 'failed'
                          ? 'Private subscription failed. Check the broadcaster and private channel authorization.'
                          : 'Waiting for the private subscription.'
                }}
            </p>
            <p data-live-selection>
                Selected {{ JSON.stringify(keys) }}.
                {{ selection.rows.map((row) => row.name).join(', ') }}
            </p></template
        >
    </DataView>
</template>
