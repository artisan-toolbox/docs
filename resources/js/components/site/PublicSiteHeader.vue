<script setup>
import AccountLinks from '@/components/AccountLinks.vue';
import DocsLink from '@/components/docs/DocsLink.vue';
import DocumentationSearch from '@/components/docs/search/DocumentationSearch.vue';
import SiteIcon from '@/components/site/SiteIcon.vue';
import { useAppearance } from '@/composables/useAppearance';
import { onBeforeUnmount, onMounted, ref } from 'vue';

defineProps({
    links: { type: Object, required: true },
    brandDestination: { type: String, default: 'home' },
    wide: { type: Boolean, default: false },
});

const { appearance, updateAppearance } = useAppearance();
const emit = defineEmits(['resize']);
/** @type {import('vue').Ref<HTMLElement | null>} */
const headerElement = ref(null);
let resizeObserver;

function reportHeight() {
    if (headerElement.value) {
        emit('resize', headerElement.value.getBoundingClientRect().height);
    }
}

onMounted(() => {
    reportHeight();
    resizeObserver = new ResizeObserver(reportHeight);
    resizeObserver.observe(headerElement.value);
});

onBeforeUnmount(() => resizeObserver?.disconnect());
</script>

<template>
    <header
        ref="headerElement"
        class="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95"
    >
        <div
            class="mx-auto flex min-h-20 flex-wrap items-center justify-between gap-4 px-5 py-4 sm:px-8"
            :class="wide ? 'max-w-[96rem]' : 'max-w-7xl'"
        >
            <DocsLink
                :href="links[brandDestination]"
                :aria-label="
                    brandDestination === 'docs'
                        ? 'Artisan Toolbox documentation'
                        : 'Artisan Toolbox home'
                "
                class="inline-flex min-h-11 min-w-0 items-center rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-600"
            >
                <img
                    src="/images/brand/artisan-toolbox-logo-light.png"
                    alt="Artisan Toolbox"
                    class="h-auto w-40 max-w-full sm:w-48 dark:hidden"
                />
                <img
                    src="/images/brand/artisan-toolbox-logo-dark.png"
                    alt="Artisan Toolbox"
                    class="hidden h-auto w-40 max-w-full sm:w-48 dark:block"
                />
            </DocsLink>
            <div class="flex flex-wrap items-center gap-3 sm:gap-6">
                <DocumentationSearch
                    v-if="links.search"
                    :endpoint="links.search"
                />
                <AccountLinks />
                <DocsLink
                    :href="links.docs"
                    class="hidden min-h-11 items-center rounded-sm text-sm font-medium text-slate-700 hover:text-brand-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-600 md:inline-flex dark:text-slate-200 dark:hover:text-brand-400"
                    ><SiteIcon
                        name="book-open"
                        class="mr-2 opacity-70"
                    />Documentation</DocsLink
                >
                <DocsLink
                    :href="links.github"
                    class="hidden min-h-11 items-center rounded-sm text-sm text-slate-500 hover:text-brand-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-600 sm:inline-flex dark:text-slate-400 dark:hover:text-brand-400"
                    ><SiteIcon
                        name="github"
                        family="brands"
                        class="mr-2"
                    />GitHub</DocsLink
                >
                <label
                    class="flex items-center text-xs text-slate-500 dark:text-slate-400"
                >
                    <span class="sr-only">Color theme</span>
                    <select
                        :value="appearance"
                        class="min-h-11 rounded-lg border border-slate-200 bg-white px-2 py-2 text-xs text-slate-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                        @change="updateAppearance($event.target.value)"
                    >
                        <option value="light">Light</option>
                        <option value="dark">Dark</option>
                        <option value="system">System</option>
                    </select>
                </label>
                <slot name="actions" />
            </div>
        </div>
    </header>
</template>
