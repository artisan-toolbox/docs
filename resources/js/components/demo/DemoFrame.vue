<script setup>
import { computed, ref, useTemplateRef } from 'vue';
import { useElementSize } from '@vueuse/core';
import CodeExample from '@/components/docs/CodeExample.vue';

const props = defineProps({
    title: { type: String, required: true },
    description: { type: String, default: '' },
    sources: { type: Array, default: () => [] },
});

const stage = useTemplateRef('stage');
const { width: availableWidth } = useElementSize(stage);
const requestedWidth = ref(null);
const minimumWidth = computed(() => Math.min(280, availableWidth.value));
const previewWidth = computed(() =>
    availableWidth.value
        ? Math.min(
              Math.max(requestedWidth.value ?? availableWidth.value, minimumWidth.value),
              availableWidth.value,
          )
        : null,
);
const sourceActivated = ref(false);
let drag = null;

function activateSource(event) {
    if (event.target === event.currentTarget && event.currentTarget.open)
        sourceActivated.value = true;
}

function resize(width) {
    requestedWidth.value = Math.round(
        Math.min(availableWidth.value, Math.max(minimumWidth.value, width)),
    );
}

function startResize(event) {
    if (event.button !== 0 || !previewWidth.value) return;
    drag = { pointerId: event.pointerId, x: event.clientX, width: previewWidth.value };
    event.currentTarget.setPointerCapture(event.pointerId);
    event.preventDefault();
}

function moveResize(event) {
    if (drag?.pointerId === event.pointerId) resize(drag.width + (event.clientX - drag.x) * 2);
}

function stopResize(event) {
    if (drag?.pointerId !== event.pointerId) return;
    drag = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId))
        event.currentTarget.releasePointerCapture(event.pointerId);
}

function resizeWithKeyboard(event) {
    const width = previewWidth.value;
    if (!width) return;
    if (event.key === 'Home') resize(minimumWidth.value);
    else if (event.key === 'End') requestedWidth.value = null;
    else if (event.key === 'ArrowLeft') resize(width - (event.shiftKey ? 40 : 10));
    else if (event.key === 'ArrowRight') resize(width + (event.shiftKey ? 40 : 10));
    else return;
    event.preventDefault();
}
</script>

<template>
    <section
        data-demo-frame
        data-docs-outline-exclude
        class="min-w-0 rounded-xl border border-slate-200/80 dark:border-slate-800">
        <header class="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
            <div class="min-w-0">
                <h3 class="text-sm font-medium text-slate-700 dark:text-slate-300">{{ title }}</h3>
                <p
                    v-if="description"
                    class="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                    {{ description }}
                </p>
            </div>
            <div class="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                <output
                    class="min-w-12 text-right font-mono text-[11px] tabular-nums"
                    :aria-label="`${props.title} preview width`"
                    >{{ previewWidth ? `${Math.round(previewWidth)} px` : 'Full' }}</output
                >
                <div
                    class="flex items-center gap-0.5"
                    role="group"
                    :aria-label="`${title} preview sizes`">
                    <button
                        type="button"
                        class="rounded px-2 py-1.5 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-brand-500 dark:hover:bg-slate-800"
                        @click="requestedWidth = 320"
                        :aria-pressed="requestedWidth === 320">
                        Compact
                    </button>
                    <button
                        type="button"
                        class="rounded px-2 py-1.5 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-brand-500 dark:hover:bg-slate-800"
                        @click="requestedWidth = 640"
                        :aria-pressed="requestedWidth === 640">
                        Wide
                    </button>
                    <button
                        type="button"
                        class="rounded px-2 py-1.5 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-brand-500 dark:hover:bg-slate-800"
                        @click="requestedWidth = null"
                        :aria-pressed="requestedWidth === null">
                        Full
                    </button>
                </div>
            </div>
        </header>
        <div class="px-4 pb-4">
            <div ref="stage" class="min-w-0">
                <div
                    class="relative mx-auto max-w-full"
                    :style="{ width: previewWidth ? `${previewWidth}px` : '100%' }"
                    data-demo-viewport>
                    <div
                        class="@container min-w-0 rounded-lg bg-slate-50/60 p-4 dark:bg-slate-900/35">
                        <slot />
                    </div>
                    <button
                        v-if="availableWidth > 280"
                        type="button"
                        role="separator"
                        aria-orientation="vertical"
                        :aria-label="`Resize ${title} preview`"
                        :aria-valuemin="minimumWidth"
                        :aria-valuemax="Math.round(availableWidth)"
                        :aria-valuenow="Math.round(previewWidth)"
                        :aria-valuetext="`${Math.round(previewWidth)} pixels`"
                        @pointerdown="startResize"
                        @pointermove="moveResize"
                        @pointerup="stopResize"
                        @pointercancel="stopResize"
                        @lostpointercapture="drag = null"
                        @keydown="resizeWithKeyboard"
                        class="absolute top-1/2 -right-4 flex h-14 w-8 -translate-y-1/2 cursor-ew-resize touch-none items-center justify-center rounded-lg focus-visible:outline-2 focus-visible:outline-brand-500"
                        title="Drag to resize. Arrow keys adjust width.">
                        <span
                            aria-hidden="true"
                            class="h-8 w-1 rounded-full bg-slate-300/80 transition-colors hover:bg-brand-500 dark:bg-slate-600" />
                    </button>
                </div>
            </div>
        </div>
        <details
            v-if="sources.length"
            @toggle="activateSource"
            class="border-t border-slate-200/80 dark:border-slate-800">
            <summary
                class="cursor-pointer px-4 py-3 text-xs text-slate-500 focus-visible:outline-2 focus-visible:outline-brand-500 dark:text-slate-400">
                View source
            </summary>
            <div class="flex min-w-0 flex-col gap-4 p-4 pt-0">
                <CodeExample
                    v-for="source in sources"
                    :key="source.label"
                    :label="source.label"
                    :language="source.language"
                    :code="source.code"
                    :highlight-enabled="sourceActivated" />
            </div>
        </details>
    </section>
</template>
