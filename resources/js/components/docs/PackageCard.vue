<script setup>
import DocsLink from './DocsLink.vue';
import PackageVersion from './PackageVersion.vue';
import SiteIcon from '@/components/site/SiteIcon.vue';

defineProps({
    package: { type: Object, required: true },
});
</script>

<template>
    <DocsLink
        :href="package.href"
        class="group flex min-w-0 flex-col gap-5 rounded-2xl border border-slate-200 bg-white p-6 transition hover:border-brand-400 hover:shadow-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-600 dark:border-slate-800 dark:bg-slate-900/40 dark:hover:border-brand-600">
        <div class="flex items-start justify-between gap-4">
            <img :src="package.artwork.icon" alt="" class="size-11 shrink-0" />
            <PackageVersion
                :package="package"
                class="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-400" />
        </div>
        <div class="flex flex-col gap-2">
            <h3 class="text-lg font-semibold text-slate-950 dark:text-white">
                {{ package.title }}
            </h3>
            <p class="text-sm leading-6 text-slate-600 dark:text-slate-400">
                {{ package.summary }}
            </p>
            <p
                v-if="package.stability"
                class="text-xs font-medium text-slate-500 dark:text-slate-400">
                {{ package.stability }}
            </p>
        </div>
        <p
            class="mt-auto flex items-center gap-2 text-sm font-medium text-brand-700 dark:text-brand-400">
            Read documentation
            <SiteIcon :name="package.migrated ? 'arrow-right' : 'arrow-up-right'" />
        </p>
    </DocsLink>
</template>
