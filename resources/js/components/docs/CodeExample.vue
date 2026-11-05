<script setup>
import { computed, ref } from 'vue';

const props = defineProps({
    code: { type: String, required: true },
    label: { type: String, required: true },
    language: { type: String, default: 'bash' },
});

const copyState = ref('idle');
const status = computed(
    () =>
        ({
            idle: '',
            copying: 'Copying code…',
            success: 'Code copied to clipboard.',
            error: 'Unable to copy. Select the code and copy it manually.',
        })[copyState.value],
);

async function copyCode() {
    copyState.value = 'copying';

    try {
        await navigator.clipboard.writeText(props.code);
        copyState.value = 'success';
    } catch {
        copyState.value = 'error';
    }
}
</script>

<template>
    <figure
        class="min-w-0 overflow-hidden rounded-xl border border-slate-800 bg-slate-950 text-slate-100"
    >
        <figcaption
            class="flex items-center justify-between gap-4 border-b border-slate-800 px-4 py-2.5 text-xs"
        >
            <span class="font-mono text-slate-400">{{ label }}</span>
            <button
                type="button"
                :aria-label="`Copy ${label}`"
                :disabled="copyState === 'copying'"
                class="min-h-11 rounded-md px-2.5 py-1.5 font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-400 disabled:opacity-60"
                @click="copyCode"
            >
                {{ copyState === 'success' ? 'Copied' : 'Copy' }}
            </button>
        </figcaption>
        <pre
            :aria-label="label"
            tabindex="0"
            class="max-w-full overflow-x-auto p-5 text-sm leading-7 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-teal-400"
        ><code :class="`language-${language}`" class="bg-transparent! p-0! text-inherit!">{{ code }}</code></pre>
        <p
            role="status"
            aria-live="polite"
            class="px-4 text-xs text-slate-300"
            :class="status ? 'pb-3' : 'sr-only'"
        >
            {{ status }}
        </p>
        <div
            v-if="$slots.default"
            class="border-t border-slate-800 px-5 py-3 text-sm text-slate-300"
        >
            <slot />
        </div>
    </figure>
</template>
