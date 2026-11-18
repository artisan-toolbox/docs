<script setup>
import { ref } from 'vue';
import { DataAdapter, useDataAdapter } from '@artisan-toolbox/dapter';
import { http } from '@inertiajs/core';
import { route } from 'ziggy-js';
import { Button, Input } from '@artisan-toolbox/front-awesome/components/WebAwesome';
import CodeExample from '@/components/docs/CodeExample.vue';
import { actionDefinitions } from './definitions';
const props = defineProps({
    protocol: { type: Number, required: true },
    external: { type: Boolean, default: false },
    source: { type: String, default: null },
});
const catalog = useDataAdapter(
    props.source ?? (props.external ? 'Dapter.ActionExternal' : 'Dapter.ActionCatalog'),
    {
        protocol: props.protocol,
        id: 'native-actions',
        url: false,
        ...(props.external ? {} : { actionDefinitions }),
    },
);
const borrowed = useDataAdapter(catalog);
const outcome = ref(null),
    name = ref('Ada'),
    independent = ref(false),
    nativeResult = ref('');
async function write(id = 'save', input = { name: name.value }) {
    const target =
        props.source === 'Dapter.ActionConfigured' ? catalog.actions?.available[id]?.target : null;
    if (target && !Object.hasOwn(input, target.input))
        input = { ...input, [target.input]: target.values[0]?.value };
    outcome.value = await borrowed.actions?.http(id, input);
}
async function cancelBefore() {
    outcome.value = await catalog.actions?.http(
        'save',
        { name: name.value },
        { onBefore: () => false },
    );
}
function upload() {
    return write('save', {
        name: name.value,
        attachment: new Blob(['fictional attachment'], { type: 'text/plain' }),
    });
}
function visit() {
    borrowed.actions?.visit(
        props.external ? 'defaultVisit' : 'save',
        { name: name.value },
        {
            preserveScroll: true,
            errorBag: 'dapterDemo',
            onError: () => {
                nativeResult.value = 'Native error bag received.';
            },
        },
    );
}
async function revoke() {
    await http.getClient().request({
        method: 'post',
        url: route('demo.dapter.actions.revoke'),
        data: {},
        headers: { Accept: 'application/json' },
    });
    nativeResult.value =
        'Demo permission revoked. A stale control is still reauthorized by the server.';
}
</script>
<template>
    <div class="flex min-w-0 flex-col gap-4" data-action-session>
        <p role="status">
            {{
                catalog.paging.loading
                    ? 'Loading fictional rows.'
                    : `Visible write counter ${catalog.data[0]?.writes ?? 0}. Pending writes ${catalog.actions?.pending ?? 0}.`
            }}
        </p>
        <p v-if="catalog.error" role="alert">{{ catalog.error.message }}</p>
        <Input label="Fictional name" v-model="name" />
        <div class="flex flex-wrap gap-2">
            <template v-if="!external"
                ><Button :disabled="!catalog.actions?.available.save" @click="write()"
                    >Save JSON</Button
                ><Button :disabled="!catalog.actions?.available.save" @click="cancelBefore"
                    >Cancel before dispatch</Button
                ><Button :disabled="!catalog.actions?.available.save" @click="upload"
                    >Upload fictional Blob</Button
                ><Button
                    :disabled="!catalog.actions?.available.save"
                    @click="write('save', { name: '' })"
                    >Reject validation</Button
                ><Button
                    :disabled="!catalog.actions?.available.record"
                    @click="write('record', { recordId: 1, name })"
                    >Save record 1</Button
                ><Button
                    :disabled="!catalog.actions?.available.record"
                    @click="write('record', { recordId: '1', name })"
                    >Reject string record ID</Button
                ><Button
                    :disabled="!catalog.actions?.available.uncertain"
                    @click="write('uncertain')"
                    >Write then return 422</Button
                ></template
            ><template v-else
                ><Button
                    v-for="id in ['replace', 'amend', 'remove']"
                    :key="id"
                    :disabled="!catalog.actions?.available[id]"
                    @click="write(id)"
                    >{{ id }} JSON</Button
                ></template
            ><Button :disabled="!catalog.actions" @click="visit">Save with native visit</Button
            ><Button @click="catalog.paging.reload()">Explicitly reload rows</Button
            ><Button @click="revoke">Revoke fictional permission</Button
            ><Button @click="independent = !independent">Toggle independent owner</Button>
        </div>
        <p>{{ nativeResult }}</p>
        <p v-if="outcome" data-action-outcome>
            Outcome {{ outcome.status }}. Commit {{ outcome.commit }}.
            {{
                outcome.status === 'completed'
                    ? `Confirmed counter ${outcome.data.count}.`
                    : 'Inspect the result before deciding what to do next.'
            }}
        </p>
        <p v-if="outcome?.commit === 'unknown'">
            The server may have committed. Reload to inspect the counter. This demo never retries a
            write automatically.
        </p>
        <CodeExample
            v-if="outcome"
            label="Actual write outcome"
            language="json"
            :code="JSON.stringify(outcome, null, 2)" /><CodeExample
            label="Available action metadata"
            language="json"
            :code="JSON.stringify(catalog.actions?.available ?? null, null, 2)" /><DataAdapter
            :adapter="borrowed"
            v-slot="view"
            ><p data-borrowed-counter>
                Borrowed view counter {{ view.data[0]?.writes ?? 0 }}.
            </p></DataAdapter
        ><DataAdapter
            v-if="independent"
            :source="props.source ?? (external ? 'Dapter.ActionExternal' : 'Dapter.ActionCatalog')"
            id="independent-actions"
            :protocol="protocol"
            :url="false"
            :action-definitions="external ? undefined : actionDefinitions"
            v-slot="view"
            ><p data-independent-counter>
                Independent view counter {{ view.data[0]?.writes ?? 0 }}.
            </p></DataAdapter
        >
    </div>
</template>
