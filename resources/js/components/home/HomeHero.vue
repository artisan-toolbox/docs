<script setup>
import DocsLink from '@/components/docs/DocsLink.vue';
import SiteIcon from '@/components/site/SiteIcon.vue';

defineProps({ links: { type: Object, required: true } });
</script>

<template>
    <section
        class="grid gap-10 border-b border-slate-200 py-16 sm:py-24 lg:grid-cols-[minmax(0,1fr)_15rem] lg:items-end lg:gap-16 lg:py-28 dark:border-slate-800"
        aria-labelledby="home-title">
        <div>
            <p
                class="mb-6 flex items-center gap-3 text-xs font-semibold tracking-[0.14em] text-brand-700 uppercase dark:text-brand-400">
                <span class="h-px w-8 bg-brand-600" aria-hidden="true"></span>
                Open source. Built for Laravel.
            </p>
            <h1
                id="home-title"
                class="max-w-4xl text-5xl leading-[1.08] font-semibold tracking-tight text-slate-950 sm:text-6xl lg:text-7xl dark:text-white">
                Practical tools for your next
                <span class="text-brand-700 dark:text-brand-400">Laravel application.</span>
            </h1>
            <p class="mt-7 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-400">
                Print receipts and labels, deliver events, debug requests, and maintain your
                projects with focused Laravel packages.
            </p>
            <div class="mt-9 flex flex-wrap items-center gap-3 sm:gap-5">
                <DocsLink
                    :href="links.docs"
                    class="inline-flex min-h-12 items-center justify-center gap-4 rounded-xl bg-brand-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-800 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-600 dark:bg-brand-400 dark:text-slate-950 dark:hover:bg-brand-300">
                    Read the documentation <SiteIcon name="arrow-right" />
                </DocsLink>
                <DocsLink
                    :href="links.github"
                    class="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl px-3 py-3 text-sm font-medium text-slate-700 hover:text-brand-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-600 dark:text-slate-300 dark:hover:text-brand-400">
                    Explore on GitHub <SiteIcon name="arrow-up-right" />
                </DocsLink>
            </div>
        </div>
        <div class="border-l-2 border-brand-600/30 pl-5 lg:mb-1">
            <p class="text-sm font-medium text-slate-900 dark:text-slate-100">
                A tool for the task.
            </p>
            <p class="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                Choose the package you need. Check its requirements before installing.
            </p>
        </div>
    </section>
</template>
