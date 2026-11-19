<script setup>
import { onScopeDispose, ref, watch } from 'vue';
import { useDataAdapter, defineActions } from '@artisan-toolbox/dapter';
import { DataView } from '@artisan-toolbox/front-awesome/data-view';
import { Button, Input } from '@artisan-toolbox/front-awesome/components/WebAwesome';
import { http } from '@inertiajs/core';
import { route } from 'ziggy-js';
import { actionDefinitions } from '../../dapter/actions/definitions';
const props = defineProps({ protocol: { type: Number, default: 2 } });
const catalog = useDataAdapter('FrontAwesome.NotebookActions', {
    protocol: props.protocol,
    id: 'data-view-actions',
    url: false,
    actionDefinitions: defineActions({
        ...actionDefinitions,
        interrupted: { transports: ['http'] },
    }),
    decodeRow(row) {
        if (
            !Number.isSafeInteger(row?.id) ||
            typeof row.name !== 'string' ||
            !Number.isSafeInteger(row.writes)
        )
            throw new Error('Expected a numbered notebook and write count.');
        return { notebookNumber: row.id, name: row.name, writes: row.writes };
    },
});
const name = ref('DataView reader');
const outcome = ref(null);
const visitMessage = ref('');
const revoking = ref(false);
const views = {
    table: {
        columns: [
            { field: 'name', label: 'Notebook' },
            { field: 'writes', label: 'Writes' },
            { kind: 'display', id: 'save', label: 'Record action' },
        ],
    },
};
let generation = 0;
function withdraw() {
    generation++;
    outcome.value = null;
    visitMessage.value = '';
}
onScopeDispose(withdraw);
watch(
    () => [
        catalog.ready,
        JSON.stringify(catalog.actions?.available ?? null),
        JSON.stringify(catalog.data.map((row) => row.notebookNumber)),
    ],
    (now, before) => {
        if (now.some((value, i) => value !== before[i])) withdraw();
    },
    { flush: 'sync' },
);
function available(id, transport, key = undefined) {
    if (revoking.value || !catalog.ready) return false;
    const action = catalog.actions?.available[id];
    if (!action?.transports.includes(transport)) return false;
    if (key === undefined) return action.target === null;
    return (
        action.target?.input === 'recordId' &&
        action.target.valueType === 'integer' &&
        Number.isSafeInteger(key) &&
        catalog.data.some((row) => row.notebookNumber === key) &&
        action.target.values.some((item) => item.value === key)
    );
}
async function submit(id, options, key) {
    if (catalog.actions?.pending || !available(id, 'http', key)) return;
    withdraw();
    const started = generation;
    const input = key === undefined ? { name: name.value } : { name: name.value, recordId: key };
    const result = await catalog.actions.http(id, input, options);
    if (started === generation && available(id, 'http', key)) outcome.value = result;
}
function visit() {
    if (catalog.actions?.pending || !available('save', 'visit')) return;
    withdraw();
    const started = generation;
    const report = (message) => {
        if (started === generation && available('save', 'visit')) visitMessage.value = message;
    };
    catalog.actions.visit(
        'save',
        { name: name.value },
        {
            preserveScroll: true,
            errorBag: 'dapterDemo',
            onSuccess: () => report('Inertia received a successful page response.'),
            onError: () => report('Inertia returned validation errors.'),
            onCancel: () => report('Inertia cancelled the visit.'),
            onFinish: () => {
                if (!visitMessage.value)
                    report('Visit finished. Inspect the counter to confirm the write.');
            },
        },
    );
}
async function revoke() {
    if (revoking.value) return;
    withdraw();
    const started = generation;
    revoking.value = true;
    try {
        await http.getClient().request({
            method: 'post',
            url: route('demo.dapter.actions.revoke'),
            data: {},
            headers: { Accept: 'application/json' },
        });
        if (started === generation) await catalog.resetContext();
    } catch {
        if (started === generation)
            visitMessage.value = 'Could not revoke the fictional permission.';
    } finally {
        revoking.value = false;
    }
}
</script>
<template>
    <DataView
        :adapter="catalog"
        :views="views"
        row-key="notebookNumber"
        label="Authorized notebook actions">
        <template #actions="{ adapter }"
            ><div class="flex min-w-0 flex-col gap-3">
                <Input v-model="name" label="Fictional name" />
                <div class="flex flex-wrap gap-2">
                    <Button
                        :disabled="!available('save', 'http') || adapter.actions.pending > 0"
                        @click="submit('save')"
                        >Save fictional notebook</Button
                    >
                    <Button
                        :disabled="!available('save', 'http') || adapter.actions.pending > 0"
                        @click="submit('save', { onBefore: () => false })"
                        >Reject before dispatch</Button
                    >
                    <Button
                        :disabled="!available('uncertain', 'http') || adapter.actions.pending > 0"
                        @click="submit('uncertain')"
                        >Return validation after writing</Button
                    >
                    <Button
                        :disabled="!available('interrupted', 'http') || adapter.actions.pending > 0"
                        @click="submit('interrupted')"
                        >Fail after writing</Button
                    >
                    <Button
                        :disabled="!available('save', 'http') || adapter.actions.pending > 0"
                        @click="submit('save', { onCancelToken: (token) => token.cancel() })"
                        >Cancel the HTTP request</Button
                    >
                    <Button
                        :disabled="!available('save', 'visit') || adapter.actions.pending > 0"
                        @click="visit"
                        >Save with native visit</Button
                    >
                    <Button :disabled="!adapter.ready" @click="adapter.paging.reload()"
                        >Reload write counter</Button
                    >
                    <Button :disabled="revoking || !available('save', 'http')" @click="revoke"
                        >Revoke permission</Button
                    >
                </div>
            </div></template
        >
        <template #cell-save="{ row }"
            ><Button
                v-if="available('record', 'http', row.notebookNumber)"
                :disabled="catalog.actions.pending > 0"
                @click="submit('record', undefined, row.notebookNumber)"
                >Save record {{ row.notebookNumber }}</Button
            ><span v-else>Read only</span></template
        >
        <template #footer="{ adapter }">
            <p data-action-state>
                Shared handle {{ adapter === catalog ? 'yes' : 'no' }}. Pending
                {{ adapter.actions?.pending ?? 0 }}.
            </p>
            <p v-if="outcome" role="status" data-action-outcome>
                Outcome {{ outcome.status }}. Commit {{ outcome.commit }}.
                <span v-if="outcome.commit === 'unknown'"
                    >Reload to inspect the current counter before deciding whether to submit
                    again.</span
                >
            </p>
            <p v-if="visitMessage" role="status">{{ visitMessage }}</p>
        </template>
    </DataView>
</template>
