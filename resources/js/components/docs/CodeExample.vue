<script setup>
import { Button, CopyButton } from '@artisan-toolbox/front-awesome/components/WebAwesome';
import { useIntersectionObserver } from '@vueuse/core';
import { computed, nextTick, ref, shallowRef, watch } from 'vue';
import SiteIcon from '@/components/site/SiteIcon.vue';
import { codeLanguage } from '@/lib/codeLanguages';
import { focusControl } from '@/lib/focusControl';

const props = defineProps({
    code: { type: String, required: true },
    label: { type: String, required: true },
    language: { type: String, default: 'bash' },
    highlightEnabled: { type: Boolean, default: true },
});

const languageInfo = computed(() => codeLanguage(props.language));
const figure = ref(null);
const highlightRequested = ref(false);
const { isSupported, stop } = useIntersectionObserver(
    () => (props.highlightEnabled ? figure.value : null),
    (entries) => {
        if (!props.highlightEnabled || highlightRequested.value) return;
        if (entries.some((entry) => entry.isIntersecting)) {
            highlightRequested.value = true;
            stop();
        }
    },
    { rootMargin: '200px 0px' },
);
const canHighlight = computed(
    () => props.highlightEnabled && (highlightRequested.value || !isSupported.value),
);
const tokens = shallowRef(null);
const highlightState = ref('plain');
const presentations = {
    terminal: 'bg-emerald-400/10 text-emerald-300 ring-emerald-400/20',
    source: 'bg-sky-400/10 text-sky-300 ring-sky-400/20',
    plain: 'bg-slate-400/10 text-slate-300 ring-slate-400/20',
};

watch(
    [() => props.code, languageInfo, canHighlight],
    async ([code, language, allowed], _previous, onCleanup) => {
        let active = true;
        onCleanup(() => {
            active = false;
        });
        tokens.value = null;
        highlightState.value = !allowed || language.kind === 'plain' ? 'plain' : 'loading';
        if (!allowed || language.kind === 'plain') return;

        try {
            const { highlightCode } = await import('@/lib/codeHighlighter');
            if (!active) return;
            const highlighted = await highlightCode(code, language.id);
            if (active) {
                tokens.value = highlighted;
                highlightState.value = 'ready';
            }
        } catch {
            if (active) highlightState.value = 'error';
        }
    },
    { immediate: true },
);

const copyState = ref('idle');
watch(
    () => props.code,
    async (_code, _previous, onCleanup) => {
        const copyButton = figure.value?.querySelector('wa-copy-button');
        copyState.value = 'idle';
        if (!copyButton?.contains(document.activeElement)) return;
        const controller = new AbortController();
        onCleanup(() => controller.abort());
        await nextTick();
        await focusControl(figure.value?.querySelector('wa-button'), controller);
    },
);
function updateCopyState(event, state) {
    if (event.currentTarget === figure.value?.querySelector('wa-copy-button'))
        copyState.value = state;
}
const status = computed(
    () =>
        ({
            idle: '',
            success: 'Code copied to clipboard.',
            error: 'Unable to copy. Select the code and copy it manually.',
        })[copyState.value],
);
</script>

<template>
    <figure
        ref="figure"
        :data-code-language="languageInfo.id"
        class="wa-dark min-w-0 overflow-hidden rounded-xl border border-slate-800 bg-slate-950 text-slate-100 shadow-lg shadow-slate-950/10">
        <figcaption
            class="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b border-slate-800 bg-slate-900/80 px-4 py-2.5 text-xs">
            <span class="flex min-w-0 flex-1 items-center gap-3">
                <span
                    class="inline-flex size-8 shrink-0 items-center justify-center rounded-lg ring-1 ring-inset"
                    :class="presentations[languageInfo.kind]">
                    <SiteIcon :name="languageInfo.icon" />
                </span>
                <span class="flex min-w-0 flex-col gap-1">
                    <span class="font-mono break-words text-slate-200">{{ label }}</span>
                    <span
                        class="text-[0.65rem] font-medium tracking-widest text-slate-400 uppercase"
                        >{{ languageInfo.label }}</span
                    >
                </span>
            </span>
            <CopyButton
                :key="code"
                :value="code"
                :copy-label="`Copy ${label}`"
                success-label="Code copied to clipboard."
                error-label="Unable to copy. Select the code and copy it manually."
                tooltip="none"
                @wa-copy="updateCopyState($event, 'success')"
                @wa-error="updateCopyState($event, 'error')">
                <Button
                    type="button"
                    appearance="plain"
                    variant="neutral"
                    size="s"
                    :aria-label="`Copy ${label}`">
                    <span class="sr-only">{{ `Copy ${label}` }}</span>
                    <SiteIcon
                        slot="start"
                        size="sm"
                        :name="copyState === 'success' ? 'check' : 'copy'" />
                    <span aria-hidden="true">{{
                        copyState === 'success' ? 'Copied' : 'Copy'
                    }}</span>
                </Button>
            </CopyButton>
        </figcaption>
        <pre
            :aria-label="label"
            :aria-busy="highlightState === 'loading'"
            tabindex="0"
            class="max-w-full [scrollbar-width:thin] [scrollbar-color:var(--color-slate-600)_var(--color-slate-950)] overflow-x-auto p-5 text-[0.8125rem] leading-7 [color-scheme:dark] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand-400 sm:p-6"><code :class="`language-${language}`" class="font-mono"><template v-if="tokens"><span v-for="(token, index) in tokens" :key="index" :class="token.className">{{ token.content }}</span></template><template v-else>{{ code }}</template></code></pre>
        <p
            v-if="highlightState === 'error'"
            role="status"
            class="border-t border-slate-800 px-4 py-3 text-xs text-slate-400">
            Syntax highlighting is unavailable. You can still read and copy the code.
        </p>
        <p
            role="status"
            aria-live="polite"
            class="px-4 text-xs text-slate-300"
            :class="status ? 'pb-3' : 'sr-only'">
            {{ status }}
        </p>
        <div
            v-if="$slots.default"
            class="border-t border-slate-800 px-5 py-3 text-sm text-slate-300">
            <slot />
        </div>
    </figure>
</template>
