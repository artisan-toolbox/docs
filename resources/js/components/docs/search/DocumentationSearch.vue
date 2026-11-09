<script setup>
import DocumentationSearchResults from '@/components/docs/search/DocumentationSearchResults.vue';
import SiteIcon from '@/components/site/SiteIcon.vue';
import {
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogOverlay,
    DialogPortal,
    DialogRoot,
    DialogTitle,
    DialogTrigger,
} from 'reka-ui';
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';

const props = defineProps({
    endpoint: { type: String, required: true },
});

const open = ref(false);
const query = ref('');
const inputElement = ref(null);
const search = ref({ status: 'idle', results: [] });
const shortcut = ref('Ctrl K');
const normalizedQuery = computed(() => query.value.trim());
const validQuery = computed(
    () => normalizedQuery.value.length >= 2 && normalizedQuery.value.length <= 120,
);
let debounceTimer;
let requestController;
let generation = 0;

const announcement = computed(() => {
    if (search.value.status === 'loading') {
        return 'Searching documentation…';
    }

    if (search.value.status === 'error') {
        return 'Search is unavailable. Please try again.';
    }

    if (search.value.status === 'success') {
        const count = search.value.results.length;

        return count === 0
            ? 'No results found. Try another word or phrase.'
            : `${count} ${count === 1 ? 'result' : 'results'} found.`;
    }

    return normalizedQuery.value.length > 120
        ? 'Use 120 characters or fewer.'
        : 'Type at least 2 characters to search all documentation.';
});

function cancelSearch() {
    generation += 1;
    clearTimeout(debounceTimer);
    requestController?.abort();
    requestController = undefined;
}

async function requestSearch() {
    cancelSearch();

    if (!open.value || !validQuery.value) {
        return;
    }

    const currentGeneration = generation;
    const controller = new AbortController();
    requestController = controller;
    search.value = { status: 'loading', results: [] };

    try {
        const url = new URL(props.endpoint, window.location.origin);
        url.searchParams.set('q', normalizedQuery.value);
        const response = await fetch(url, {
            headers: { Accept: 'application/json' },
            signal: controller.signal,
        });

        if (!response.ok) {
            throw new Error('Search request failed.');
        }

        const payload = await response.json();

        if (!Array.isArray(payload.results)) {
            throw new Error('Search response is invalid.');
        }

        if (currentGeneration === generation && open.value) {
            search.value = {
                status: 'success',
                results: payload.results.slice(0, 12),
            };
        }
    } catch {
        if (currentGeneration === generation && !controller.signal.aborted) {
            search.value = { status: 'error', results: [] };
        }
    } finally {
        if (currentGeneration === generation) {
            requestController = undefined;
        }
    }
}

watch(query, () => {
    cancelSearch();
    search.value = { status: 'idle', results: [] };

    if (open.value && validQuery.value) {
        search.value = { status: 'loading', results: [] };
        debounceTimer = setTimeout(requestSearch, 200);
    }
});

watch(open, (isOpen) => {
    if (!isOpen) {
        cancelSearch();
        query.value = '';
        search.value = { status: 'idle', results: [] };
    }
});

function openFromShortcut(event) {
    const target = event.target;

    if (
        event.defaultPrevented ||
        event.repeat ||
        (!event.metaKey && !event.ctrlKey) ||
        event.altKey ||
        event.shiftKey ||
        event.key.toLowerCase() !== 'k' ||
        target?.closest?.(
            'input, textarea, select, [contenteditable]:not([contenteditable="false"])',
        )
    ) {
        return;
    }

    event.preventDefault();
    open.value = true;
}

function focusInput(event) {
    event.preventDefault();
    inputElement.value?.focus();
}

onMounted(() => {
    shortcut.value = /Mac|iPhone|iPad/.test(navigator.platform) ? '⌘ K' : 'Ctrl K';
    window.addEventListener('keydown', openFromShortcut);
});

onBeforeUnmount(() => {
    cancelSearch();
    window.removeEventListener('keydown', openFromShortcut);
});
</script>

<template>
    <DialogRoot v-model:open="open">
        <DialogTrigger
            aria-label="Search documentation"
            aria-keyshortcuts="Control+K Meta+K"
            class="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-600 transition-colors hover:border-slate-300 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-slate-600 dark:hover:bg-slate-800">
            <SiteIcon name="magnifying-glass" />
            <span class="hidden lg:inline">Search docs</span>
            <kbd
                class="hidden rounded border border-slate-300 px-1.5 py-0.5 text-[10px] leading-none sm:inline dark:border-slate-600"
                >{{ shortcut }}</kbd
            >
        </DialogTrigger>
        <DialogPortal>
            <DialogOverlay class="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm" />
            <DialogContent
                class="fixed top-4 left-1/2 z-50 flex max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-2xl -translate-x-1/2 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white text-slate-900 shadow-2xl sm:top-[12vh] sm:max-h-[76dvh] dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                @open-auto-focus="focusInput">
                <div class="flex items-center justify-between gap-4 px-5 pt-5">
                    <DialogTitle class="text-base font-semibold">Search documentation</DialogTitle>
                    <DialogClose
                        aria-label="Close search"
                        class="-mt-2 -mr-2 inline-flex size-11 shrink-0 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 dark:text-slate-400 dark:hover:bg-slate-800"
                        ><SiteIcon size="lg" name="xmark"
                    /></DialogClose>
                </div>
                <DialogDescription class="px-5 text-sm text-slate-500 dark:text-slate-400">
                    Find guides, examples, and API details across Artisan Toolbox.
                </DialogDescription>
                <div class="relative m-5 mb-0">
                    <SiteIcon
                        size="lg"
                        name="magnifying-glass"
                        class="pointer-events-none absolute top-3.5 left-3.5 text-slate-400" />
                    <label for="documentation-search-input" class="sr-only">Search query</label>
                    <input
                        id="documentation-search-input"
                        ref="inputElement"
                        v-model="query"
                        type="search"
                        maxlength="120"
                        autocomplete="off"
                        spellcheck="false"
                        placeholder="Search documentation…"
                        class="min-h-12 w-full rounded-xl border border-slate-300 bg-slate-50 py-3 pr-4 pl-11 text-base text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:outline-2 focus:outline-brand-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                        aria-describedby="documentation-search-status"
                        :aria-busy="search.status === 'loading'" />
                </div>
                <p
                    id="documentation-search-status"
                    role="status"
                    aria-live="polite"
                    aria-atomic="true"
                    class="px-5 pt-4 pb-3 text-sm text-slate-500 dark:text-slate-400">
                    {{ announcement }}
                </p>
                <div v-if="search.status === 'error'" class="px-5 pb-5">
                    <button
                        type="button"
                        class="min-h-11 rounded-lg bg-brand-600 px-4 text-sm font-semibold text-white hover:bg-brand-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
                        @click="requestSearch">
                        Try again
                    </button>
                </div>
                <DocumentationSearchResults
                    v-if="search.status === 'success' && search.results.length"
                    :results="search.results"
                    @select="open = false" />
                <div
                    class="flex flex-wrap items-center justify-between gap-2 border-t border-slate-200 bg-slate-50 px-5 py-3 text-xs text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
                    <span>Tab to move · Enter to open</span>
                    <span>Esc to close</span>
                </div>
            </DialogContent>
        </DialogPortal>
    </DialogRoot>
</template>
