<script setup>
import { ref } from 'vue';
import CodeExample from '@/components/docs/CodeExample.vue';

defineProps({
    title: { type: String, required: true },
    description: { type: String, required: true },
    sources: { type: Array, default: () => [] },
});

const sourceActivated = ref(false);

function activateSource(event) {
    if (event.currentTarget.open) sourceActivated.value = true;
}
</script>

<template>
    <section
        data-docs-outline-exclude
        class="min-w-0 rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950"
    >
        <header class="border-b border-slate-200 p-5 dark:border-slate-800">
            <h3 class="text-lg font-semibold text-slate-950 dark:text-white">
                {{ title }}
            </h3>
            <p
                class="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400"
            >
                {{ description }}
            </p>
        </header>
        <div
            class="@container w-full max-w-full min-w-64 resize-x overflow-auto p-5"
        >
            <slot />
            <p class="mt-5 text-xs text-slate-500 dark:text-slate-400">
                Drag the lower-right corner to try a narrower layout.
            </p>
        </div>
        <details
            v-if="sources.length"
            @toggle="activateSource"
            class="border-t border-slate-200 dark:border-slate-800"
        >
            <summary
                class="cursor-pointer px-5 py-4 text-sm font-medium text-slate-700 focus-visible:outline-2 focus-visible:outline-brand-500 dark:text-slate-300"
            >
                View the running source
            </summary>
            <div class="flex min-w-0 flex-col gap-4 p-5 pt-0">
                <CodeExample
                    v-for="source in sources"
                    :key="source.label"
                    :label="source.label"
                    :language="source.language"
                    :code="source.code"
                    :highlight-enabled="sourceActivated"
                />
            </div>
        </details>
    </section>
</template>
