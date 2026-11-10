<script setup>
import { Option, Select } from '@artisan-toolbox/front-awesome/components/WebAwesome';
import AccountLinks from '@/components/AccountLinks.vue';
import DocsLink from '@/components/docs/DocsLink.vue';
import DocumentationSearch from '@/components/docs/search/DocumentationSearch.vue';
import BrandLogo from '@/components/site/BrandLogo.vue';
import SiteIcon from '@/components/site/SiteIcon.vue';
import { useAppearance } from '@/composables/useAppearance';
import { onBeforeUnmount, onMounted, ref } from 'vue';

defineProps({
    links: { type: Object, required: true },
    brandDestination: { type: String, default: 'home' },
    wide: { type: Boolean, default: false },
});

const { appearance, updateAppearance, pending, error } = useAppearance();
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
        class="block w-full border-b border-slate-200 bg-white/95 p-0 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95">
        <div
            class="mx-auto flex min-h-20 flex-wrap items-center justify-between gap-4 px-5 py-4 sm:px-8"
            :class="wide ? 'max-w-[96rem]' : 'max-w-7xl'">
            <DocsLink
                :href="links[brandDestination]"
                :aria-label="
                    brandDestination === 'docs'
                        ? 'Artisan Toolbox documentation'
                        : 'Artisan Toolbox home'
                "
                class="inline-flex min-h-11 min-w-0 items-center rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-600">
                <BrandLogo class="h-auto w-40 max-w-full sm:w-48" />
            </DocsLink>
            <div class="flex flex-wrap items-center gap-3 sm:gap-6">
                <DocumentationSearch v-if="links.search" :endpoint="links.search" />
                <AccountLinks />
                <DocsLink
                    :href="links.docs"
                    class="hidden min-h-11 items-center rounded-sm text-sm font-medium text-slate-700 hover:text-brand-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-600 md:inline-flex dark:text-slate-200 dark:hover:text-brand-400"
                    ><SiteIcon name="book-open" class="mr-2 opacity-70" />Documentation</DocsLink
                >
                <DocsLink
                    :href="links.github"
                    class="hidden min-h-11 items-center rounded-sm text-sm text-slate-500 hover:text-brand-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-600 sm:inline-flex dark:text-slate-400 dark:hover:text-brand-400"
                    ><SiteIcon name="github" family="brands" class="mr-2" />GitHub</DocsLink
                >
                <Select
                    :value="appearance"
                    :disabled="pending"
                    size="s"
                    label="Color theme"
                    class="w-28 [--wa-form-control-height:2.75rem] [&::part(form-control-label)]:sr-only"
                    @change="updateAppearance($event.currentTarget.value)">
                    <Option value="light">Light</Option>
                    <Option value="dark">Dark</Option>
                    <Option value="system">System</Option>
                </Select>
                <p v-if="error" role="alert" class="text-sm text-red-700 dark:text-red-300">
                    {{ error }}
                </p>
                <slot name="actions" />
            </div>
        </div>
    </header>
</template>
