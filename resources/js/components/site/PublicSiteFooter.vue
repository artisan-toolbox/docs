<script setup>
import DocsLink from '@/components/docs/DocsLink.vue';
import SiteIcon from '@/components/site/SiteIcon.vue';

defineProps({
    links: { type: Object, required: true },
    source: { type: Object, default: null },
});
</script>

<template>
    <footer
        class="border-t border-slate-200 py-8 text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400"
    >
        <div
            class="flex flex-wrap items-center justify-between gap-x-8 gap-y-4"
        >
            <p>
                Artisan Toolbox <span aria-hidden="true">·</span> Built for
                Laravel.
            </p>
            <DocsLink
                v-if="source"
                :href="source.sourceUrl"
                class="inline-flex min-h-11 items-center gap-1 rounded-sm hover:text-brand-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-600 dark:hover:text-brand-400"
                >{{ source.sourceLabel }} <SiteIcon name="arrow-up-right"
            /></DocsLink>
            <nav aria-label="Site" class="flex flex-wrap gap-x-6 gap-y-2">
                <DocsLink
                    :href="links.home"
                    class="inline-flex min-h-11 items-center gap-2 rounded-sm hover:text-brand-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-600 dark:hover:text-brand-400"
                    ><SiteIcon name="house" />Home</DocsLink
                >
                <DocsLink
                    :href="links.docs"
                    class="inline-flex min-h-11 items-center gap-2 rounded-sm hover:text-brand-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-600 dark:hover:text-brand-400"
                    ><SiteIcon name="book-open" />Documentation</DocsLink
                >
                <DocsLink
                    :href="links.github"
                    class="inline-flex min-h-11 items-center gap-2 rounded-sm hover:text-brand-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-600 dark:hover:text-brand-400"
                    ><SiteIcon name="github" family="brands" />GitHub</DocsLink
                >
                <DocsLink
                    :href="links.contact"
                    class="inline-flex min-h-11 items-center gap-2 rounded-sm hover:text-brand-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-600 dark:hover:text-brand-400"
                    ><SiteIcon name="envelope" />Contact</DocsLink
                >
            </nav>
        </div>
    </footer>
</template>
