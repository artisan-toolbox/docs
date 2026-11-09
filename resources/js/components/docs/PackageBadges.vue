<script setup>
import SiteIcon from '@/components/site/SiteIcon.vue';
import DocsLink from './DocsLink.vue';
import PackageVersion from './PackageVersion.vue';
import { computed } from 'vue';
import { packageIcon } from '@/lib/packageIcons';

const props = defineProps({
    package: { type: Object, required: true },
});
const icon = computed(() => packageIcon(props.package.id));
</script>

<template>
    <div
        role="group"
        aria-label="Package details"
        class="flex min-w-0 flex-wrap items-center gap-2 text-xs leading-5">
        <span
            class="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1 font-medium text-brand-800 dark:bg-brand-950 dark:text-brand-300">
            <SiteIcon v-if="icon" v-bind="icon" size="sm" />
            {{ package.title }}
        </span>
        <PackageVersion
            :package="package"
            class="max-w-full rounded-full bg-slate-100 px-3 py-1 break-words text-slate-700 dark:bg-slate-800 dark:text-slate-300" />
        <span
            v-if="package.stability"
            class="rounded-full border border-slate-200 px-3 py-1 text-slate-600 dark:border-slate-700 dark:text-slate-400">
            {{ package.stability }}
        </span>
        <DocsLink
            v-if="package.repositoryUrl"
            :href="package.repositoryUrl"
            :aria-label="`${package.title} repository on GitHub`"
            class="inline-flex items-center gap-1.5 rounded-full border border-slate-200 px-3 py-1 text-slate-700 underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 dark:border-slate-700 dark:text-slate-300">
            <SiteIcon name="github" family="brands" size="sm" />
            GitHub
        </DocsLink>
    </div>
</template>
