<script setup>
import { Button, Spinner, Tag } from '@artisan-toolbox/front-awesome/components/WebAwesome';
import { useHttp } from '@inertiajs/vue3';
import { onBeforeUnmount, ref } from 'vue';
import { route } from 'ziggy-js';
import DemoFrame from '@/components/demo/DemoFrame.vue';
import CodeExample from '@/components/docs/CodeExample.vue';
import clientSource from './AuthorityDemo.vue?raw';
import sourceDeclaration from '../../../../../../app/DataSources/Dapter/CollectionFluent.php?raw';
import collectionSource from '../../../../../../app/Demo/Dapter/Listing/CollectionFixture.php?raw';
import productsSource from '../../../../../../app/Demo/Dapter/Listing/FixtureProducts.php?raw';

const form = useHttp({ version: 1 });
const state = ref({ status: 'idle', request: null, result: null, errors: null });
let generation = 0;
const sources = [
    { label: 'AuthorityDemo.vue', language: 'vue', code: clientSource },
    { label: 'CollectionFluent.php', language: 'php', code: sourceDeclaration },
    { label: 'CollectionFixture.php', language: 'php', code: collectionSource },
    { label: 'FixtureProducts.php', language: 'php', code: productsSource },
];

async function run(current, per_page, fields = {}) {
    if (state.value.status === 'loading') return;
    const active = ++generation;
    const payload = {
        version: 1,
        state: {
            version: 1,
            fields,
            global: {},
            searchMatch: 'all',
            order: { kind: 'default' },
            paging: { mode: 'offset', current, per_page },
        },
    };
    state.value = { status: 'loading', request: payload, result: null, errors: null };
    form.clearErrors();
    form.transform(() => payload);
    try {
        const result = await form.post(route('dapter.data', { source: 'Dapter.CollectionFluent' }));
        if (active !== generation) return;
        state.value = {
            status: result ? 'success' : 'rejected',
            request: payload,
            result: result ?? null,
            errors: result ? null : { ...form.errors },
        };
    } catch {
        if (active !== generation) return;
        state.value = { status: 'failed', request: payload, result: null, errors: null };
    }
}

function reset() {
    generation++;
    form.cancel();
    form.clearErrors();
    state.value = { status: 'idle', request: null, result: null, errors: null };
}

onBeforeUnmount(reset);
</script>

<template>
    <DemoFrame
        data-search-exclude
        title="Server authority over a request"
        description="Send fixed requests to the same public Collection source. The server allows sizes 5 and 10 and declares no field operations."
        :sources="sources">
        <div class="flex min-w-0 flex-col gap-5">
            <div class="flex flex-wrap gap-3">
                <Button :disabled="state.status === 'loading'" @click="run(1, 10)">
                    Request allowed size 10
                </Button>
                <Button :disabled="state.status === 'loading'" @click="run(1, 7)">
                    Request disallowed size 7
                </Button>
                <Button
                    :disabled="state.status === 'loading'"
                    @click="run(1, 5, { name: { search: 'Notebook' } })">
                    Request undeclared field
                </Button>
                <Button :disabled="state.status === 'loading'" @click="run(999, 10)">
                    Request page 999
                </Button>
                <Button variant="neutral" @click="reset">Reset</Button>
            </div>
            <p role="status" class="text-sm text-slate-600 dark:text-slate-400">
                <template v-if="state.status === 'idle'"
                    >Ready. Choose a request to start.</template
                >
                <template v-else-if="state.status === 'loading'">
                    <Spinner class="mr-2 inline-block" /> Waiting for the server.
                </template>
                <template v-else-if="state.status === 'success'">
                    Accepted page {{ state.result.paging.current }} with
                    {{ state.result.data.length }} rows. Default size remains
                    {{ state.result.capabilities.paging.per_page }}.
                </template>
            </p>
            <div v-if="state.status === 'rejected'" role="alert">
                <Tag variant="danger">HTTP 422</Tag>
                <p>The server rejected this request. Request allowed size 10 to recover.</p>
            </div>
            <p v-if="state.status === 'failed'" role="alert">
                The request could not complete. Check the connection and try again.
            </p>
            <CodeExample
                v-if="state.request"
                label="Actual outgoing request"
                language="json"
                :code="JSON.stringify(state.request, null, 2)" />
            <CodeExample
                v-if="state.result"
                label="Actual server response"
                language="json"
                :code="JSON.stringify(state.result, null, 2)" />
            <CodeExample
                v-if="state.errors"
                label="Actual Inertia validation feedback"
                language="json"
                :code="JSON.stringify(state.errors, null, 2)" />
        </div>
    </DemoFrame>
</template>
