<script setup>
import { useHttp } from '@inertiajs/vue3';
import { onBeforeUnmount, ref } from 'vue';
import { route } from 'ziggy-js';
import DemoAction from '@/components/demo/DemoAction.vue';
import DemoFrame from '@/components/demo/DemoFrame.vue';
import CodeExample from '@/components/docs/CodeExample.vue';
import controllerSource from '../../../../../../app/Demo/Core/ConditionalArrays/ConditionalArraysController.php?raw';
import requestSource from '../../../../../../app/Demo/Core/ConditionalArrays/ConditionalArraysRequest.php?raw';
import clientSource from './ConditionalArraysDemo.vue?raw';

const initialOptions = Object.freeze({
    includeContact: false,
    includeExtraItem: false,
});
const form = useHttp({ ...initialOptions });
const state = ref({ status: 'idle', result: null, error: '' });
let generation = 0;
const sources = [
    {
        label: 'ConditionalArraysController.php',
        language: 'php',
        code: controllerSource,
    },
    {
        label: 'ConditionalArraysRequest.php',
        language: 'php',
        code: requestSource,
    },
    { label: 'ConditionalArraysDemo.vue', language: 'vue', code: clientSource },
];

async function run() {
    if (state.value.status === 'running') return;
    const current = ++generation;
    state.value = { status: 'running', result: null, error: '' };

    try {
        const result = await form.post(route('demo.core.conditional-arrays'));
        if (current !== generation) return;

        state.value = result
            ? { status: 'success', result, error: '' }
            : {
                  status: 'error',
                  result: null,
                  error:
                      Object.values(form.errors).join(' ') ||
                      'The options were rejected. Reset and try again.',
              };
    } catch {
        if (current !== generation) return;
        state.value = {
            status: 'error',
            result: null,
            error: 'The example could not run. Check your connection and try again. If requests are limited, wait a minute before retrying.',
        };
    }
}

function reset() {
    generation++;
    form.cancel();
    form.defaults({ ...initialOptions }).resetAndClearErrors();
    state.value = { status: 'idle', result: null, error: '' };
}

onBeforeUnmount(() => {
    generation++;
    form.cancel();
});
</script>

<template>
    <DemoFrame
        data-search-exclude
        title="Run a conditional array"
        description="Choose which values to include, then run the installed Core helper on the server. No account or application data is used."
        :sources="sources">
        <div class="flex min-w-0 flex-col gap-5">
            <fieldset
                :disabled="state.status === 'running'"
                class="flex flex-col gap-3 text-sm text-slate-700 dark:text-slate-300">
                <legend class="mb-3 font-medium">Inputs for the next run</legend>
                <label class="flex min-h-11 items-center gap-3">
                    <input
                        v-model="form.includeContact"
                        type="checkbox"
                        class="size-4 accent-brand-600 focus-visible:outline-2 focus-visible:outline-brand-500" />
                    Include the nested contact
                </label>
                <label class="flex min-h-11 items-center gap-3">
                    <input
                        v-model="form.includeExtraItem"
                        type="checkbox"
                        class="size-4 accent-brand-600 focus-visible:outline-2 focus-visible:outline-brand-500" />
                    Include the middle item (QZ Tray)
                </label>
            </fieldset>
            <div class="flex flex-wrap gap-3">
                <DemoAction :busy="state.status === 'running'" @click="run">Run example</DemoAction>
                <DemoAction variant="neutral" @click="reset">Reset</DemoAction>
            </div>
            <p role="status" class="text-sm text-slate-600 dark:text-slate-400">
                <template v-if="state.status === 'idle'"
                    >Ready. Choose options and run the example.</template
                >
                <template v-else-if="state.status === 'running'">Running the Core helper…</template>
                <template v-else-if="state.status === 'success'">Server result ready.</template>
            </p>
            <p
                v-if="state.status === 'error'"
                role="alert"
                class="text-sm text-red-700 dark:text-red-300">
                {{ state.error }}
            </p>
            <div v-if="state.result" class="flex min-w-0 flex-col gap-4">
                <p class="text-sm text-slate-700 dark:text-slate-300">
                    Last run inputs. Contact
                    {{ state.result.options.includeContact ? 'included' : 'omitted' }}; middle item
                    {{ state.result.options.includeExtraItem ? 'included' : 'omitted' }}. Contact
                    closure {{ state.result.contactEvaluated ? 'evaluated' : 'not evaluated' }}.
                </p>
                <CodeExample
                    label="Actual server response"
                    language="json"
                    :code="JSON.stringify(state.result, null, 2)" />
            </div>
        </div>
    </DemoFrame>
</template>
